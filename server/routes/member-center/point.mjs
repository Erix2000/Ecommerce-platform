import express from "express";
import multer from "multer";
const upload = multer(); // 創建multer實例，用於文件上傳

// 讓console.log呈現檔案與行號，與字串訊息呈現顏色用
// import { extendLog } from "../utils/tool.mjs";
// import "colors";
// extendLog();

var router = express.Router();

// 會員中心 > 歷史訂單 相關路由
router.get("/", function (req, res) {
  res.send("點數紀錄頁");
});

export default router;
