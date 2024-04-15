import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import connection from "../db_connect/db.mjs";
import "dotenv/config.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const upload = multer();

router.post("/", upload.none(), async function (req, res, next) {
  if (!req.body.providerId || !req.body.uid) {
    return res.json({ status: "error", message: "缺少google登入資料" });
  }

  const { displayName, email, uid, photoURL } = req.body;
  const google_uid = uid;
const user_img ="23.svg"
  try {
    // 以下流程:
    // 1. 先查詢資料庫是否有同google_uid的資料
    // 2-1. 有存在 -> 執行登入工作
    // 2-2. 不存在 -> 建立一個新會員資料(無帳號與密碼)，只有google來的資料 -> 執行登入工作

    // 1. 先查詢資料庫是否有同google_uid的資料
    const [users] = await connection.query(
      "SELECT * FROM user WHERE google_uid = ?",
      [google_uid]
    );
    let returnUser;
    if (users.length > 0) {
      // 2-1. 有存在 -> 從資料庫查詢會員資料
      const dbUser = users[0];
      returnUser = {
        id: dbUser.user_id,
        uuid: dbUser.uuid,
        user_name: dbUser.user_name,
        google_uid: dbUser.google_uid,
        line_uid: dbUser.line_uid,
      };
    } else {
      const [users] = await connection.query(
        "SELECT * FROM user WHERE user_email = ?",
        [email]
      );
      if (users.length > 0) {
        const dbUser = users[0];
        await connection.query(
          "UPDATE user SET google_uid = ? WHERE user_id = ?",
          [google_uid, dbUser.user_id]
        );

        returnUser = {
          id: dbUser.user_id,
          uuid: dbUser.uuid,
          user_name: dbUser.user_name,
          google_uid: google_uid,
          line_uid: dbUser.line_uid,
        };
      } else {
        // 2-2. 不存在 -> 建立一個新會員資料(無帳號與密碼)，只有google來的資料 -> 執行登入工作
        const newUserUUID = uuidv4();
        const created_at = new Date();
        const [result] = await connection.query(
          "INSERT INTO user (uuid,user_name, user_email, google_uid, user_img,created_at,user_valid) VALUES (?,?, ?, ?, ?,?,?)",
          [newUserUUID, displayName, email, google_uid, user_img, created_at, 1]
        );
        await connection.query(
          "INSERT INTO coupon_user_mapping (user_id, coupon_id, expire_at, valid) VALUES (?, 1, DATE_ADD(NOW(), INTERVAL 30 DAY), 1)",
          [result.insertId]
        );

        returnUser = {
          id: result.insertId,
          uuid: newUserUUID, 
          user_name: displayName,
          google_uid: google_uid,
          line_uid: "",
        };
      }
    }

    const accessToken = jwt.sign(returnUser, accessTokenSecret, {
      expiresIn: "3d",
    });

    return res.json({
      status: "success",
      accessToken,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: error.message || "資料庫操作失敗" });
  }
});

export default router;
