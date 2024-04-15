import express from "express";
import multer from "multer";
import connection from "../../db_connect/db.mjs";
import authenticate from "../../middleware/authenticate.mjs";

const upload = multer(); // 創建multer實例，用於文件上傳

const router = express.Router();

// 取得今天的日期物件
const today = new Date();
const day = today.getDate();
const month = today.getMonth() + 1;
const year = today.getFullYear();

// 取得過期日的日期物件 (今天後七天)
const expireDate = new Date();
expireDate.setDate(today.getDate() + 7);

// 會員中心 > 優惠券 相關路由
router.get("/", authenticate, async (req, res) => {
  const user_id = req.decoded.id;

  try {
    // 可使用
    const [resultsHas, fieldHas] = await connection.execute(
      "SELECT coupon_user_mapping.*, DATE_FORMAT(coupon_user_mapping.expire_at, '%Y-%m-%d') AS formatted_coupon_end, coupon.coupon_discount, coupon.coupon_threshold, coupon.coupon_name, coupon.coupon_id, coupon.coupon_img FROM coupon_user_mapping JOIN coupon ON coupon_user_mapping.coupon_id = coupon.coupon_id WHERE expire_at > ? AND user_id = ? AND  valid = 1",
      [today, user_id]
    );
    // 未領取
    const [resultsUntaken, fieldUntaken] = await connection.execute(
      "SELECT coupon.*, DATE_FORMAT(coupon.coupon_end, '%Y-%m-%d') AS formatted_coupon_end,  coupon_user_mapping.coupon_id AS mapping_coupon_id FROM `coupon` LEFT JOIN coupon_user_mapping ON coupon.coupon_id = coupon_user_mapping.coupon_id WHERE coupon_start < ? AND  coupon_end > ? AND coupon_point = 0 AND user_id IS NULL",
      [today, today]
    );
    // 可兌換
    const [resultsUnexchange, fieldUnexchange] = await connection.execute(
      "SELECT coupon.*, DATE_FORMAT(coupon.coupon_end, '%Y-%m-%d') AS formatted_coupon_end FROM `coupon` WHERE coupon_point > 0",
      [today]
    );
    // 已失效
    const [resultsInvalid, fieldExpired] = await connection.execute(
      "SELECT coupon.coupon_img, coupon.coupon_name, coupon_user_mapping.*, DATE_FORMAT(coupon_user_mapping.expire_at, '%Y-%m-%d') AS formatted_expire_at, DATE_FORMAT(coupon_user_mapping.used_at, '%Y-%m-%d') AS formatted_used_at FROM `coupon_user_mapping` JOIN coupon ON coupon.coupon_id = coupon_user_mapping.coupon_id WHERE (valid = 0 OR (expire_at < ? AND valid = 1))",
      [today]
    );

    const results = {
      has: resultsHas,
      untaken: resultsUntaken,
      unexchange: resultsUnexchange,
      invalid: resultsInvalid,
    };
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", msg: `error: ${error}` });
  }
});

router.post("/", authenticate, async (req, res) => {
  const { coupon_id, coupon_end, coupon_point } = req.body;
  const user_id = req.decoded.id;
  // 過期日設定
  //  如果有結束日期則套用
  //  如果沒有則套用7天后為過期日
  const expire_at = coupon_end ? coupon_end : expireDate;
  const [points, field] = await connection.execute(
    "SELECT points_change from member_points WHERE user_id = ?",
    [user_id]
  );
  let user_point = 0;
  points.map((value, index) => {
    user_point += value.points_change;
  });

  // 寫入 user-coupon 資料庫
  try {
    if (coupon_point < user_point) {
      const [results, field] = await connection.execute(
        "INSERT INTO coupon_user_mapping VALUES (?, ?, ?, ?, ?)",
        [user_id, coupon_id, "0000-00-00", expire_at, 1]
      );

      // 如果是兌換優惠券
      // 寫入點數資料庫進行扣除點數
      if (coupon_point) {
        const [results, field] = await connection.execute(
          "INSERT INTO member_points VALUES (DEFAULT, ?, ?, ?, '兌換優惠券')",
          [user_id, -coupon_point, today]
        );
        res.status(200).json({ status: "success", msg: "兌換成功" });
      }
    } else {
      res.status(500).json({ status: "fail", msg: "點數不足，兌換失敗" });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: `請稍後再試，若問題持續發生，敬請聯絡客服`,
    });
  }
});

export default router;
