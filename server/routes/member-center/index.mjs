import express from "express";
import multer from "multer";
import orderRouter from "./order.mjs";
import favoriteRouter from "./favorite.mjs";
import pointRouter from "./point.mjs";
import commentRouter from "./comment.mjs";
import gameRouter from "./daily-game.mjs"
import couponRouter from "./coupon.mjs";
import courseRouter from './course.mjs'
import lecturerForumRouter from './lecturer-forum.mjs'

const upload = multer(); // 創建multer實例，用於文件上傳

// 讓console.log呈現檔案與行號，與字串訊息呈現顏色用
// import { extendLog } from "../utils/tool.mjs";
// import "colors";
// extendLog();

var router = express.Router();

router.use("/order", orderRouter); // 歷史訂單頁路由
router.use("/point", pointRouter); // 點數紀錄頁路由
router.use("/coupon", couponRouter); // 優惠券頁路由
router.use("/course", courseRouter);  // 我的課程路由
router.use("/comment", commentRouter); // 評論紀錄頁路由
router.use("/game", gameRouter); // 簽到遊戲頁路由
router.use("/favorite", favoriteRouter);  // 我的收藏頁路由
router.use("/lecturer-forum", lecturerForumRouter);  // 講師文章路由

// 會員中心首頁，導向至會員資料頁
router.get("/", function (req, res) {
  res.redirect("/member/user-info");
});

// 會員中心 > 基本資料 相關路由
router.get("/user-info", function (req, res) {
  res.send("會員基本資料頁");
});

export default router;
