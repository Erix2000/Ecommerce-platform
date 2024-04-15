import express from "express";
// import cookieParser from "cookie-parser";
import createError from "http-errors";
import cors from "cors";
import indexRouter from "./routes/index.mjs";
import cartRouter from "./routes/cart.mjs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// import session from "express-session";
// // 使用檔案的session store，存在sessions資料夾
// import sessionFileStore from "session-file-store";
// const FileStore = sessionFileStore(session);

// 讓console.log呈現檔案與行號，與字串訊息呈現顏色用
// import { extendLog } from "./utils/tool.mjs";
import "colors";
// import { Session } from "inspector";
//extendLog();

// 建立 Express 應用程式
const app = express();
app.use(express.static("public"));

// 設置token的黑名單
// const blackListedToken = [];

// 定義CORS白名單，只有這些來源的請求才被接受
const whitelist = [
  "http://localhost:5500",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://sandbox-web-pay.line.me",
  "https://8564-2001-b400-e3ff-feb4-fdcd-f85-8c23-4ba7.ngrok-free.app",
  "https://logistics-stage.ecpay.com.tw",
  "https://logistics.ecpay.com.tw",

  undefined, // 允許非瀏覽器的請求，如Postman或CURL
];

//綠界用
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Session用
// const fileStoreOptions = {};
// 剖折 Cookie 標頭與增加至 req.cookies
// app.use(cookieParser());

// 設置CORS中間件的選項
const corsOptions = {
  credentials: true, // 允許攜帶憑證資訊（如cookies）
  origin(origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true); // 如果請求來源在白名單中，允許跨來源請求
    } else {
      callback(new Error("不允許傳遞資料")); // 否則，拒絕並返回錯誤
    }
  },
  // methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions)); // 使用CORS中間件，配置跨來源請求的處理
app.use(express.json()); // 使用內建的中間件解析JSON格式的請求體
app.use(express.urlencoded({ extended: true })); // 使用內建的中間件解析URL編碼的請求體（主要用於處理表單提交）

// 設定路由路徑
app.use("/", indexRouter);

// 捕抓404錯誤處理
app.use((req, res, next) => {
  next(createError(404));
});

// session-cookie使用
// app.use(
//   session({
//     store: new FileStore(fileStoreOptions), // 使用檔案記錄session
//     name: "SESSION_ID", // cookie名稱，儲存在瀏覽器裡
//     secret: "67f71af4602195de2450faeb6f8856c0", // 安全字串，應用一個高安全字串
//     cookie: {
//       maxAge: 30 * 86400000, // 30 * (24 * 60 * 60 * 1000) = 30 * 86400000 => session保存30天
//       // httpOnly: false,
//       // sameSite: 'none',
//     },
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// 錯誤處理中間件
app.use((err, req, res, next) => {
  // 設置本地變量，僅在開發環境中提供錯誤信息
  res.locals.message = err.message; // 將錯誤信息存儲在響應的本地變量中，以便在視圖中使用
  res.locals.error = req.app.get("env") === "development" ? err : {}; // 如果當前環境是開發環境，則將錯誤詳情存儲在本地變量中，否則存儲一個空對象

  // 渲染錯誤頁面
  res.status(err.status || 500); // 設置HTTP狀態碼。如果錯誤對象中有狀態碼則使用該狀態碼，否則預設使用500
});

export default app;
