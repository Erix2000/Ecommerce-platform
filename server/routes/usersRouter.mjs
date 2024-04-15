import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import "colors"; //與字串訊息呈現顏色用
import {
  userSignUp,
  validateUserEmail,
  userInfo,
  useInfoPoint,
  userUpdate,
  updatePassword,
  lecturerInfo,
  lecturerUpdate,
  lecturerInfoClasses,
} from "../db-helpers/user.mjs";
import authenticate from "../middleware/authenticate.mjs";
import { v4 as uuidv4 } from "uuid";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/lecturer"); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4() + path.extname(file.originalname); 
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage: storage });
const router = express.Router();
dotenv.config();

// 使用者註冊(新增)
router.post("/register", upload.none(), async (req, res) => {
  try {
    const user = await userSignUp(req);
    console.log(user);
    res.status(200).json({
      status: "success",
      msg: "註冊成功，請檢查您的郵箱進行認證。",
      user,
    });
  } catch (error) {
    res.status(409).json({ status: "error", message: error.message });
  }
});

// 註冊後信件認證
router.get("/validate", async (req, res) => {
  try {
    const isValidated = await validateUserEmail(req);
    if (isValidated.success) {
      res.send(`
        <html>
        <head>
          <title>驗證成功</title>
          <meta http-equiv="refresh" content="1;url=http://localhost:3000/member/login" />
        </head>
        <body>
          <h1>驗證成功</h1>
          <p>你的帳號已成功驗證，如果你的頁面沒有自動跳轉，請<a href="http://localhost:3000/member/login">點擊這裡</a>。</p>
        </body>
        </html>
      `);
    } else {
      res.status(404).json({ status: "error", message: isValidated.message });
      console.log(isValidated.message);
    }
  } catch (error) {
    console.error("驗證過程中出錯:", error);
  }
});

// 查看使用者資料(查看)
router.get("/user-info", authenticate, async (req, res, next) => {
  try {
    const user = await userInfo(req);
    res.status(200).json({
      status: "success",
      msg: "查詢資料成功",
      user,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// 使用者修改資料(更改)
router.put(
  "/:uuid/use-info-revise",
  upload.none(),
  authenticate,
  async (req, res, next) => {
    try {
      const user = await userUpdate(req);
      res.status(200).json({
        status: "success",
        msg: "修改成功，請查看更新後資訊",
        user,
      });
    } catch (error) {
      res.status(409).json({ status: "error", message: error.message });
    }
  }
);

// 使用者密碼修改(更改)
router.put(
  "/edit-password",
  upload.none(),
  authenticate,
  async (req, res, next) => {
    try {
      const user = await updatePassword(req);
      res.status(200).json({
        status: "success",
        msg: "密碼修改成功，請查看更新後資訊",
      });
    } catch (error) {
      res.status(409).json({ status: "error", message: error.message });
    }
  }
);

// 查看使用者點數(查看)
router.get("/use-info-point", authenticate, async (req, res, next) => {
  try {
    const user = await useInfoPoint(req);
    res.status(200).json({
      status: "success",
      msg: "查詢資料成功",
      user,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// 查看講師資料(查看)
router.get("/lecturer-info", authenticate, async (req, res, next) => {
  try {
    const lecturer = await lecturerInfo(req);
    res.status(200).json({
      status: "success",
      msg: "查詢資料成功",
      lecturer,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// 講師修改資料(更改)
router.put(
  "/:exclusiveCode/lecturer-info-revise",
  // upload.none(),
  upload.single("lecturer_img"),
  authenticate,
  async (req, res, next) => {
    try {
      let filename = null;
      if (req.file) {
        filename = req.file.filename;
      }
      const lecturer = await lecturerUpdate(req, filename);
      res.status(200).json({
        status: "success",
        msg: "修改成功，請查看更新後資訊",
        lecturer,
      });
    } catch (error) {
      res.status(409).json({ status: "error", message: error.message });
    }
  }
);

// 查看講師課程(查看)
router.get("/lecturer-info-class", authenticate, async (req, res, next) => {
  try {
    const course = await lecturerInfoClasses(req);
    res.status(200).json({
      status: "success",
      msg: "查詢資料成功",
      course,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;
