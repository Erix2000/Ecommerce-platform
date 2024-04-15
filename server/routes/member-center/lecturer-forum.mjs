import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import connection from "../../db_connect/db.mjs";
import authenticate from "../../middleware/authenticate.mjs";
import bodyParser from "body-parser"; //處理req.body
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import fileUpload from 'express-fileupload';

let eq = ""
const router = express.Router();
const app = express();


// ■■■■■■■■■

// 查看講師文章(查看) // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
router.get("/manage", authenticate, async (req, res) => {
  console.log(req.query.exclusive_code); //請求要求回來東西  取到exclusive_code

  const [lecturer, lecturerFeild] = await connection // 必填欄位 資料庫 欄位名稱/資料 [, ]物件陣列
    // 抓取該講師exclusive_code 渲染回前端呈現 其文章
    .execute(
      `SELECT
                  forum_list.forum_id,
                  forum_list.forum_title,
                  forum_list.forum_introduce,
                  forum_list.forum_img,
                  forum_list.forum_hastag,
                  forum_list.forum_category_id,
                  DATE_FORMAT(forum_list.forum_modified_at, '%Y-%m-%d') AS forum_modified_at,
                  forum_category.forum_category_name,
                  lecturer.*
                  FROM forum_list
                  JOIN forum_category ON forum_list.forum_category_id = forum_category.forum_category_id
                  JOIN lecturer ON forum_list.exclusive_code = lecturer.exclusive_code
                  WHERE forum_list.exclusive_code =?`,
      [req.query.exclusive_code]
    )
    .then((lecturerResult) => {
      //整理DATA
      // console.log(lecturerResult);
      return lecturerResult;
    })
    .catch((err) => {
      console.log(err);
      return [[], []];
    });
    eq = req.query.exclusive_code;
    console.log(eq);
  // console.log(lecturer); //[ {},{} ]
  res.json(lecturer); // 步驟4 丟回前端
});
// -----------------
//圖片上傳
app.use(fileUpload({
  createParentPath: true,
  // limits: { fileSize: 50 * 1024 * 1024 } 
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/forum'); // 儲存的路徑
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const fileName = uniqueName + extension; // 重新命名文件

    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });
//------------------

// 講師文章新增(create) // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// router.post("/forum-create", authenticate, async (req, res) => { // 先把會員驗證 authenticate 註解， 最後再開

router.post("/forum-create", 
upload.single("forum_img"),//input的name
// authenticate,
async (req, res) => {

  const forum_img = req.file.filename; 
  
  //取得今天的日期物件
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  
  // 物件做解構賦值
  const {
    forum_title,
    forum_introduce,
    forum_article,
    // forum_img,
    forum_hastag,
    forum_category_id,
    exclusive_code,
  } = req.body;

  const [createForum, createForumFeild] = await connection
    .execute(
      // 必填欄位 資料庫 欄位名稱/資料 [, ]物件陣列
      "INSERT INTO forum_list (forum_title, forum_introduce, forum_article, forum_img, forum_hastag, forum_modified_at, forum_vaild, forum_category_id, exclusive_code) VALUES(?,?,?,?,?,?,1,?,?)",
      [
        forum_title,
        forum_introduce,
        forum_article,
        forum_img,
        forum_hastag || null,
        today,
        forum_category_id,
        exclusive_code
      ]
    )
    .then((createForumResult) => {
      //整理DATA
      // console.log(createForumResult);
      return createForumResult;
    })
    .catch((err) => {
      console.log(err);
      return [[], []];
    });
  console.log(createForum); // [ {},{} ]
  res.json(createForum); // 步驟4 丟回前端
 });





// 講師文章修改(resive) // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// router.get("/forum-revise", authenticate, async (req, res) => {});
router.put("/forum-revise", async (req, res) => {
  // console.log(req.query);
  // 取得今天的日期物件
const today = new Date();
const day = today.getDate();
const month = today.getMonth() + 1;
const year = today.getFullYear();

// 物件做解構賦值
const {
  forum_title,
  forum_introduce,
  forum_article,
  forum_img,
  forum_hastag,
  forum_category_id,
  forum_id
} = req.body;

const [updateForum, updateForumFeild] = await connection
  .execute(
    // 修改資料庫內容的 SQL 語句
    "UPDATE forum_list SET forum_title=?, forum_introduce=?, forum_article=?, forum_img=?, forum_hastag=?, forum_modified_at=?, forum_category_id=? WHERE forum_id=?",
    [
      forum_title,
      forum_introduce,
      forum_article,
      forum_img || null,
      forum_hastag || null,
      today,
      forum_category_id,
      forum_id, // 條件：根據 forum_id 更新
    ]
  )
  .then((updateForumResult) => {
    // 整理資料
    // console.log(updateForumResult);
    return updateForumResult;
  })
  .catch((err) => {
    console.log(err);
    return [[], []];
  });
console.log(updateForum); // [ {},{} ]
res.json(updateForum); // 步驟4 丟回前端
});

// 講師文章刪除(delete) // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// router.get("/forum-delete", authenticate, async (req, res) => {});

router.delete("/forum-delete", async (req, res) => {
  // 接收從前端傳遞的資料
  const { forum_id } = req.body;

  // 做刪除操作
  const [deleteForum, deleteForumField] = await connection.execute(
    "DELETE FROM forum_list WHERE forum_id = ?",
    [forum_id]
  );

  // 檢查刪除操作的結果
  if (deleteForum.affectedRows > 0) {
    res.json({ message: "Forum deleted successfully" });
  } else {
    res.status(400).json({ error: "Failed to delete forum" });
  }
});



// 會員帳密
// account: happymin0318@gmail.com
// password: qwe12345

export default router;
