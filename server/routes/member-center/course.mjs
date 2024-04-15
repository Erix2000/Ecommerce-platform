import express from "express";
import multer from "multer";
import connection from "../../db_connect/db.mjs";
import authenticate from "../../middleware/authenticate.mjs";

const upload = multer(); // 創建multer實例，用於文件上傳

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const user_id = req.decoded.id;
  try {
    const [result, field] = await connection.execute(
      "SELECT order.order_id, order_item.item_id, course_list.*, lecturer.lecturer_name, DATE_FORMAT(course_list.course_date_start, '%Y-%m-%d') AS course_date_start, DATE_FORMAT(course_list.course_date_end, '%Y-%m-%d') AS course_date_end FROM `order` JOIN order_item ON order.order_id = order_item.order_id AND item_type = 'course' JOIN course_list ON order_item.item_id = course_list.course_id JOIN lecturer ON lecturer.exclusive_code = course_list.exclusive_code WHERE user_id = ?",
      [user_id]
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ status: "failed", msg: "伺服器無法取得課程資訊" });
  }
});

export default router;
