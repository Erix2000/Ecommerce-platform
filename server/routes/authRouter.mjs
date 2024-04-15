import express from "express";
import { userLogin, logoutUser } from "../db-helpers/user.mjs";
import authenticate from "../middleware/authenticate.mjs";
import connection from "../db_connect/db.mjs";
import multer from "multer";
import dotenv from "dotenv";
import "colors";

const upload = multer(); 
const router = express.Router();
dotenv.config();

// 檢查登入狀態用
router.get("/check", authenticate, async (req, res) => {
  try {
    const uuid = req.decoded.uuid;
    const [users] = await connection.execute(
      "SELECT * FROM user WHERE uuid = ?",
      [uuid]
    );
    if (users.length === 0) {
      return res.status(404).json({ status: "error", message: "用户不存在" });
    }
    const user = users[0];
    delete user.password; 
    return res.status(200).json({ status: "success", user });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// 使用者登入
router.post("/login", upload.none(), async (req, res) => {
  try {
    const accessToken = await userLogin(req);
    res.setHeader("Authorization", `Bearer ${accessToken}`);
    res.json({
      status: "success",
      message: "傳送access token回應",
      accessToken,
    });
  } catch (error) {
    console.error("Error executing query:", error);
    res.json({ status: "error", message: error.message });
  }
});

// 使用者登出
router.post("/logout", authenticate, async (req, res) => {
  try {
    const { uuid } = req.decoded;
    const result = await logoutUser(uuid);
    if (result.success) {
      res.status(200).json({
        status: "success",
        accessToken: result.expiredToken,
      });
    } else {
      res.status(401).json({
        status: "error",
        message: result.message,
      });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: "內部伺服器錯誤" });
  }
});

export default router;
