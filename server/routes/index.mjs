import express from "express";
import dotenv from "dotenv";
import memberRouter from "./member-center/index.mjs";
import authRouter from "./authRouter.mjs";
import resetPassword from "./reset-password.mjs";
import googleLogin from "./google-login.mjs";
import lineLogin from "./line-login.mjs";
import usersRouter from "./usersRouter.mjs";
import cartRouter from "./cart.mjs";
import productRouter from "./product.mjs";
import courseRouter from "./course.mjs";
import forumRouter from "./forum.mjs";

dotenv.config();

// 讓console.log呈現檔案與行號，與字串訊息呈現顏色用
//import { extendLog } from "../utils/tool.mjs";
import "colors";
//extendLog();

const router = express.Router();

router.use("/api/member", usersRouter);
router.use("/api/member", authRouter);
router.use("/api/reset-password", resetPassword);
router.use("/api/google-login", googleLogin);
router.use("/api/line-login", lineLogin);

router.use("/member", memberRouter);
router.use("/cart", cartRouter);
router.use("/product", productRouter);
router.use("/course", courseRouter);
router.use("/forum", forumRouter);

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log(process.env.DB_HOST);
  res.send("index");
});

// res.redirect("/expense");
export default router;
