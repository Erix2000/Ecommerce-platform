import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
import connection from "../../db_connect/db.mjs";
const upload = multer(); // 創建multer實例，用於文件上傳

// 讓console.log呈現檔案與行號，與字串訊息呈現顏色用
// import { extendLog } from "../../utils/tool.mjs";
import "colors";
import authenticate from "../../middleware/authenticate.mjs";

const router = express.Router();
router.use(bodyParser.json());

// 取得今天的日期物件
const today = new Date();
const day = today.getDate();
const month = today.getMonth() + 1;
const year = today.getFullYear();

// 會員中心 > 歷史訂單 相關路由

router.get("/", authenticate, async (req, res) => {
  // 先取得需要使用的參數
  const { oid } = req.query;
  const user_id = req.decoded.id;

  // 當有查詢參數 oid 時，抓取特定訂單的詳細資訊 ([oid].js)
  if (oid) {
    const [resultsOrderProduct, fieldOrderProduct] = await connection
      .execute(
        "SELECT order_item.*, product.product_img, product.product_id, product.product_name, comment.comment_valid FROM order_item JOIN product ON order_item.item_id = product.product_id LEFT JOIN comment ON comment.comment_valid = 1 AND comment.order_id = order_item.order_id AND product.product_id = comment.item_id AND comment.item_type = order_item.item_type WHERE order_item.order_id = ? AND order_item.item_type = 'product'",
        [oid]
      )
      .catch((error) => {
        res.status(500).json({ status: "fail", msg: "伺服器沒有回應" });
      });
    const [resultsOrderCourse, fieldOrderCourse] = await connection
      .execute(
        "SELECT order_item.*, course_list.course_img, course_list.course_id, course_list.course_name, comment.comment_valid FROM order_item JOIN course_list ON order_item.item_id = course_list.course_id LEFT JOIN comment ON comment.comment_valid = 1 AND comment.order_id = order_item.order_id AND course_list.course_id = comment.item_id AND comment.item_type = order_item.item_type WHERE order_item.order_id = ? AND order_item.item_type = 'course'",
        [oid]
      )
      .catch((error) => {
        res.status(500).json({ status: "fail", msg: "伺服器沒有回應" });
      });
    const [resultsOrderDetail, fieldOrderDetail] = await connection
      .execute(
        "SELECT *, DATE_FORMAT(created_at, '%Y-%m-%d') AS formatted_created_at, DATE_FORMAT(posted_at, '%Y-%m-%d') AS formatted_posted_at, DATE_FORMAT(canceled_at, '%Y-%m-%d') AS formatted_canceled_at, DATE_FORMAT(arrived_at, '%Y-%m-%d') AS formatted_arrived_at, DATE_FORMAT(finished_at, '%Y-%m-%d') AS formatted_finished_at, DATE_FORMAT(returned_at, '%Y-%m-%d') AS formatted_returned_at, DATE_FORMAT(payment_at, '%Y-%m-%d %H:%i:%s') AS payment_at FROM `order` WHERE `order_id` = ?",
        [oid]
      )
      .catch((error) => {
        res.status(500).json({ status: "fail", msg: "伺服器沒有回應" });
      });

    const results = {
      orderProduct: resultsOrderProduct,
      orderCourse: resultsOrderCourse,
      orderDetail: resultsOrderDetail,
    };
    res.json(results);

    // 當沒有時，抓取該用戶的所有訂單資訊
  } else {
    const [results, field] = await connection
      .execute("SELECT * FROM `order` WHERE `user_id` = ? and `order_id` = ?", [
        user_id,
        oid,
      ])
      .catch((error) => {
        res.status(500).json({ status: "fail", msg: "伺服器沒有回應" });
      });
    res.json(results);
  }
});

// 當對 order/:oid 發送 post 請求時，抓取特定訂單的產品資訊
router.post("/:oid", async (req, res) => {
  const { oid } = req.body;
  if (oid) {
    const [results, field] = await connection
      .execute("SELECT * FROM `order_item` WHERE `order_id` = ?", [oid])
      .catch((error) => {
        res.status(500).json({ status: "fail", msg: "伺服器沒有回應" });
      });
    res.json(results);
  }
});

router.post("/", authenticate, async (req, res) => {
  const user_id = req.decoded.id;
  const [results, field] = await connection
    .execute(
      "SELECT *, DATE_FORMAT(created_at, '%Y-%m-%d') AS formatted_created_at, DATE_FORMAT(posted_at, '%Y-%m-%d') AS formatted_posted_at, DATE_FORMAT(canceled_at, '%Y-%m-%d') AS formatted_canceled_at, DATE_FORMAT(arrived_at, '%Y-%m-%d') AS formatted_arrived_at, DATE_FORMAT(finished_at, '%Y-%m-%d') AS formatted_finished_at, DATE_FORMAT(returned_at, '%Y-%m-%d') AS formatted_returned_at FROM `order` WHERE `user_id` = ? ORDER BY created_at DESC",
      [user_id]
    )
    .catch((error) => {
      res.status(500).json({ status: "fail", msg: "伺服器沒有回應" });
    });
  res.json(results);
});

// 取消訂單 (order-card.js)
router.put("/", authenticate, async (req, res) => {
  const { order_id, used_points, total_cost } = req.body;
  const user_id = req.decoded.id;
  // 將該訂單的取消日期加入今日日期
  const [results, field] = await connection
    .execute("UPDATE `order` SET canceled_at = ? WHERE order_id = ?", [
      today,
      order_id,
    ])
    .catch((error) => {
      res.status(500).json({ status: "fail", msg: "伺服器沒有回應" });
    });
  // 如果有使用點數折抵，則返還
  if (used_points) {
    const [resultsA, fieldA] = await connection
      .execute("INSERT INTO member_points VALUES (DEFAULT, ?, ?, ?, ?)", [
        user_id,
        -used_points,
        today,
        `${order_id} 取消`,
      ])
      .catch((error) => {
        res.status(500).json({ status: "fail", msg: "伺服器沒有回應" });
      });
  }

  // 將該筆訂單因消費獲得的點數扣除
  const [resultsB, fieldB] = await connection
    .execute("INSERT INTO member_points VALUES (DEFAULT, ?, ?, ?, ?)", [
      user_id,
      -total_cost / 100,
      today,
      `${order_id} 取消`,
    ])
    .catch((error) => {
      res.status(500).json({ status: "fail", msg: "伺服器沒有回應" });
    });
  res
    .status(200)
    .json({ msg: `cancel order success, order_number: ${order_id}` });
});

// 訂單退貨 (order-card.js)
router.delete("/", authenticate, async (req, res) => {
  const { order_id, used_points, total_cost } = req.body;
  const user_id = req.decoded.id;
  const [results, field] = await connection
    .execute("UPDATE `order` SET returned_at = ? WHERE order_id = ?", [
      today,
      order_id,
    ])
    .catch((error) => {
      console.log(error);
      return [[], []];
    });
  // 如果有使用點數折抵，則返還
  if (used_points) {
    const [resultsA, fieldA] = await connection
      .execute("INSERT INTO member_points VALUES (DEFAULT, ?, ?, ?, ?)", [
        user_id,
        -used_points,
        today,
        `${order_id} 退貨`,
      ])
      .catch((error) => {
        res.status(500).json({ status: "fail", msg: "伺服器沒有回應" });
      });
  }

  // 將該筆訂單因消費獲得的點數扣除
  const [resultsB, fieldB] = await connection
    .execute("INSERT INTO member_points VALUES (DEFAULT, ?, ?, ?, ?)", [
      user_id,
      -total_cost / 100,
      today,
      `${order_id} 退貨`,
    ])
    .catch((error) => {
      res.status(500).json({ status: "fail", msg: "伺服器沒有回應" });
    });
  res
    .status(200)
    .json({ msg: `return order success, order_number: ${order_id}` });
});

export default router;
