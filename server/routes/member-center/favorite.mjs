import bodyParser from "body-parser";
import express from "express";
import multer from "multer";
import connection from "../../db_connect/db.mjs";
import authenticate from "../../middleware/authenticate.mjs";

const upload = multer(); // 創建multer實例，用於文件上傳

var router = express.Router();

router.use(bodyParser.json());

// 會員中心 > 我的收藏 相關路由
router.get("/", authenticate, async (req, res) => {
  // 由 token 取出 user_id
  const user_id = req.decoded.id;

  // 透過 user_id 作為篩選條件，從收藏資料庫抓取成物件陣列
  const [resultsCourse, fieldCourse] = await connection
    .execute(
      "SELECT item_user.*, course_list.* FROM `item_user` JOIN course_list ON item_user.item_id = course_list.course_id WHERE `user_id` = ? AND item_user.item_type = 'course'",
      [user_id]
    )
    .catch((error) => {
      res.status(500).json({ status: "fail", msg: "伺服器發生錯誤" });
    });
  const [resultsProduct, fieldProduct] = await connection
    .execute(
      "SELECT item_user.*, product.* FROM `item_user` JOIN product ON item_user.item_id = product.product_id WHERE `user_id` = ? AND item_type = 'product'",
      [user_id]
    )
    .catch((error) => {
      console.log(error);
      return [[], []];
    });
  const [resultsArticle, fieldArticle] = await connection
    .execute(
      // "SELECT user_article.*, forum_list.*, DATE_FORMAT(forum_modified_at, '%Y-%m-%d') AS forum_modified_at FROM `user_article` JOIN forum_list ON forum_list.forum_id = user_article.article_id WHERE `user_id` = ?",
      "SELECT forum_list.*, user_article.*, lecturer.lecturer_name, forum_category.forum_category_name, DATE_FORMAT(forum_modified_at, '%Y-%m-%d') AS forum_modified_at  FROM `user_article` JOIN forum_list ON forum_list.forum_id = user_article.article_id JOIN forum_category ON forum_list.forum_category_id = forum_category.forum_category_id JOIN lecturer ON forum_list.exclusive_code = lecturer.exclusive_code WHERE `user_id` = ?",
      [user_id]
    )
    .catch((error) => {
      console.log(error);
      return [[], []];
    });
  // 將三個物件陣列放入新的物件中，並依據該物件陣列的內容做為鍵 (key)
  // 這樣就可以同時獲取三筆資料庫的內容並且一起回傳
  // 取用方便，前台只需要透過 results.XXX 就可以取得對應的物件陣列
  const results = {
    course: resultsCourse,
    product: resultsProduct,
    article: resultsArticle,
  };
  res.json(results);
});

export default router;
