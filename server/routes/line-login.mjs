import express from "express";
import connection from "../db_connect/db.mjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";

import "dotenv/config.js";
const router = express.Router();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const LINE_TOKEN_URL = "https://api.line.me/oauth2/v2.1/token";
const channel_id = process.env.LINE_CHANNEL_ID;
const channel_secret = process.env.LINE_CHANNEL_SECRET;
const callback_url = process.env.LINE_LOGIN_CALLBACK_URL;

// 定義LINE登入的路由
router.get("/login", (req, res) => {
  // LINE授權URL，用戶將被導向此URL進行登入
  const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${channel_id}&redirect_uri=${encodeURIComponent(callback_url)}&state=random_state&scope=openid%20profile&nonce=random_nonce`;

  // 重定向用戶到LINE登入頁面
  res.json({ url: lineLoginUrl });
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;
  console.log(123, req.query); 

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code"); 
    params.append("code", code); 
    params.append("redirect_uri", callback_url); 
    params.append("client_id", channel_id); 
    params.append("client_secret", channel_secret); 

    const tokenResponse = await fetch(LINE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    }).then((res) => res.json());

    console.log("tokenResponse", tokenResponse);
    if (tokenResponse.error) {
      throw new Error(tokenResponse.error_description);
    }

    const decodedToken = jwt.decode(tokenResponse.id_token);
    const line_uid = decodedToken.sub; // 假定sub字段存儲了LINE用戶的唯一標識
    let returnUser;

    try {
      const [users] = await connection.query(
        "SELECT * FROM user WHERE line_uid = ?",
        [line_uid]
      );

      if (users.length > 0) {
        // 如果用戶已存在，從數據庫中獲取該用戶資訊
        const dbUser = users[0]; 
        returnUser = {
          id: dbUser.user_id,
          uuid: dbUser.uuid,
          user_name: dbUser.username,
          google_uid: dbUser.google_uid,
          line_uid: dbUser.line_uid,
        };
      } else {
        // 如果用戶不存在，創建一個新的用戶紀錄
        const uuid = uuidv4();
        const created_at = new Date();
        const [result] = await connection.query(
          "INSERT INTO user (uuid,user_name, user_email, line_uid, line_access_token,created_at,user_valid) VALUES (?,?, ?, ?, ?,?,?)",
          [
            uuid,
            decodedToken.name,
            "",
            line_uid,
            tokenResponse.access_token,
            created_at,
            1,
          ]
        );
        await connection.query(
          "INSERT INTO coupon_user_mapping (user_id, coupon_id, expire_at, valid) VALUES (?, 1, DATE_ADD(NOW(), INTERVAL 30 DAY), 1)",
          [result.insertId]
        );
        returnUser = {
          id: result.insertId,
          uuid: uuid,
          username: decodedToken.name,
          google_uid: "",
          line_uid: line_uid,
        };
      }
    } catch (error) {
      console.error("數據庫操作或其他錯誤:", error);
      throw error; 
    }

    const accessToken = jwt.sign(returnUser, accessTokenSecret, {
      expiresIn: "3d",
    });

    res.json({
      status: "success",
      data: { accessToken },
    });
  } catch (error) {
    console.error("處理失敗:", error);
    res
      .status(500)
      .json({ status: "error", message: error.message || "內部服務器錯誤" });
  }
});

export default router;
