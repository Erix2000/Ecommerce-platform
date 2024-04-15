import express from "express";
import connection from "../db_connect/db.mjs";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";
import ecpay_payment from "ecpay_aio_nodejs";
import ecpay_logistics from "ecpay_logistics_nodejs";
import moment from "moment-timezone";
import { v4 as uuidv4 } from "uuid";
import authenticate from "../middleware/authenticate.mjs";

dotenv.config();
const uuid = uuidv4();
//綠界開始
const { MERCHANTID, HASHKEY, HASHIV, HOST, MERCHANTID2, HASHKEY2, HASHIV2 } =
  process.env;
const options = {
  OperationMode: "Test",
  MercProfile: {
    MerchantID: MERCHANTID,
    HashKey: HASHKEY,
    HashIV: HASHIV,
  },
  IgnorePayment: [],
  IsProjectContractor: false,
};
//物流

let TradeNo;

//往下寫router
//綠界結束
const upload = multer();

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
// const userId = 1; //假userId
router.get("/confirm/coupon", authenticate, async (req, res) => {
  const id = req.decoded.id;
  const date = new Date();
  const today = date.toISOString();
  const [userCoupon] = await connection
    .execute(
      `SELECT coupon.coupon_id AS coupon_id, expire_at, coupon_name, coupon_threshold, coupon_discount, coupon_img, coupon_valid, coupon_intro, expire_at FROM coupon_user_mapping JOIN coupon ON coupon.coupon_id = coupon_user_mapping.coupon_id WHERE user_id = ? AND expire_at > ? AND valid = 1 ORDER BY coupon_threshold ASC`,
      [id, today]
    )
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });

  res.send(userCoupon);
});
router.get("/confirm/points", authenticate, async (req, res) => {
  const id = req.decoded.id;

  const [userOriginPoints] = await connection
    .execute(
      "SELECT SUM(points_change) AS total_points FROM member_points WHERE user_id = ?",
      [id]
    )
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return [[], []];
    });
  res.send(userOriginPoints[0]);
});

router.post(
  "/confirm/payment",
  authenticate,

  upload.none(),
  async (req, res) => {
    const id = 1;
    const [orderId] = await connection.execute(
      "SELECT order_id FROM `order` ORDER BY order_id DESC LIMIT 1"
    );
    //訂單編號
    const date = new Date();
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const today = date.toISOString().split("T")[0];
    const fakeTime = `0000-00-00`;
    const orderIdNext = (
      Number(orderId[0].order_id.toString().slice(2, -4)) + 1
    ).toString();
    const newOrderId = Number(`${year + orderIdNext + month + day}`);
    //使用者id
    //取得formData
    const {
      userName,
      phone,
      address,
      payment,
      driving,
      points,
      coupon,
      cartItem,
      remark,
    } = req.body;
    //coupon處理
    const couponObj = JSON.parse(coupon);
    const couponId = couponObj.id ? couponObj.id : null;
    const couponDiscount = couponObj.discount ? couponObj.discount : 0;

    //點數處理
    const userUsedPoints = points ? points : 0;
    const userUsedPointsDisplay = Number(-userUsedPoints);
    //總價
    const cart = JSON.parse(cartItem);
    const subtotal = cart.reduce((acc, item) => {
      return (acc += item.quantity * item.item_price);
    }, 0);
    const sum =
      subtotal > 1000
        ? subtotal - couponDiscount - userUsedPoints
        : subtotal + 60 - couponDiscount - userUsedPoints;
    //備註處理
    // const userRemark = remark ? :

    console.log(
      newOrderId,
      id,
      driving,
      address,
      sum,
      payment,
      remark,
      couponId,
      today,
      fakeTime
    );

    //添加歷史訂單
    await connection.execute(
      "INSERT INTO `order` (order_id, user_id, recipient_name, recipient_phone, post_method, post_address, total_cost, payment_method, remark, payment_at, coupon_id, used_points, created_at, posted_at, canceled_at, arrived_at, finished_at, returned_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        newOrderId,
        id,
        userName,
        phone,
        driving,
        address,
        sum,
        payment,
        remark,
        null,
        couponId,
        userUsedPointsDisplay,
        today,
        fakeTime,
        fakeTime,
        fakeTime,
        fakeTime,
        fakeTime,
      ]
    );
    //添加訂單細節
    cart.map(async (item) => {
      await connection.execute(
        "INSERT INTO order_item ( order_id, item_id, item_type, item_qty, item_price) VALUES (?,?,?,?,?)",
        [
          newOrderId,
          item.item_id,
          item.item_type,
          item.quantity,
          item.item_price,
        ]
      );
    });

    //會員扣點

    const [userOriginPoints] = await connection.execute(
      "SELECT SUM(points_change) AS total_points FROM member_points WHERE user_id = ?",
      [id]
    );

    const orderAddPoints = Math.floor(sum / 100);

    //添加點數細節
    const memo = `消費折抵`;
    const memo2 = `消費贈點`;
    const displayPointsChange = Number(-userUsedPoints);

    if (userUsedPoints > 0) {
      await connection.execute(
        "INSERT INTO member_points (user_id, points_change, points_created_at, points_text) VALUES (?,?,?,?)",
        [id, displayPointsChange, today, memo]
      );
    }

    await connection.execute(
      "INSERT INTO member_points (user_id, points_change, points_created_at, points_text) VALUES (?,?,?,?)",
      [id, orderAddPoints, today, memo2]
    );

    //已使用優惠券扣除
    await connection.execute(
      "UPDATE coupon_user_mapping SET used_at=?, valid = 0 WHERE user_id = ? AND coupon_id = ?",
      [today, id, couponId]
    );

    //扣除庫存
    const findProduct = await cart.filter((item) => {
      return item.item_type === "product";
    });
    const findCourse = await cart.filter((item) => {
      return item.item_type === "course";
    });

    findProduct.map(async (product) => {
      await connection.execute(
        "UPDATE product SET product_stock = ? WHERE product_id = ? ",
        [product.product_stock - product.quantity, product.product_id]
      );
    });
    findCourse.map(async (course) => {
      await connection.execute(
        "UPDATE course_list SET course_stock = ? WHERE course_id = ? ",
        [course.course_stock - course.quantity, course.course_id]
      );
    });

    res.send(
      JSON.stringify({ status: "success", payment, orderId: newOrderId })
    );
  }
);
router.get("/confirm/creat-linepay", async (req, res) => {
  const orderId = req.query.orderId;
  const [order] = await connection.execute(
    "SELECT *, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at FROM `order` WHERE order_id = ?",
    [orderId]
  );
  const headers = {
    "Content-Type": "application/json",
    "X-LINE-ChannelId": process.env.LINE_PAY_CHANNEL_ID,
    "X-LINE-ChannelSecret": process.env.LINE_PAY_CHANNEL_SECRET,
  };
  const body = {
    orderId: order[0].order_id,
    amount: order[0].total_cost,
    currency: "TWD",
    productName: "MR.BEAN 咖啡豆專賣店",
    productImageUrl:
      "https://live.staticflickr.com/65535/53649622652_358ecdacf2_b.jpg",

    confirmUrl: `http://localhost:3005/cart/comfirm/check-linepay?orderId=${orderId}`,
    cancelUrl: `http://localhost:3005/cart/comfirm/check-linepay?orderId=${orderId}`,
  };
  await axios
    .post("https://sandbox-api-pay.line.me/v2/payments/request", body, {
      headers,
    })
    .then((result) => {
      // console.log(result);
      res.redirect(result.data.info.paymentUrl.web);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/comfirm/check-linepay", async (req, res) => {
  const orderId = req.query.orderId;

  const taiwanTime = moment().tz("Asia/Taipei").format("YYYY-MM-DD HH:mm:ss");

  const [order] = await connection.execute(
    "SELECT *, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at FROM `order` WHERE order_id = ?",
    [orderId]
  );
  const body = {
    amount: order[0].total_cost,
    currency: "TWD",
  };
  const headers = {
    "Content-Type": "application/json",
    "X-LINE-ChannelId": process.env.LINE_PAY_CHANNEL_ID,
    "X-LINE-ChannelSecret": process.env.LINE_PAY_CHANNEL_SECRET,
  };
  const transactionId = req.query.transactionId;

  await axios
    .post(
      `https://sandbox-api-pay.line.me/v2/payments/${transactionId}/confirm`,
      body,
      {
        headers,
      }
    )
    .then(async (result) => {
      if (result.data.returnCode === "0000") {
        await connection.execute(
          "UPDATE `order` SET payment_at = ? WHERE user_id = ? AND order_id = ?",
          [taiwanTime, order[0].user_id, order[0].order_id]
        );
        res.redirect(
          `http://localhost:3000/cart/confirm/success?orderId=${orderId}`
        );
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
//ECpay 開始

router.get("/confirm/ecpay", async (req, res) => {
  const orderId = req.query.orderId;
  const [order] = await connection.execute(
    "SELECT total_cost FROM `order` WHERE order_id = ?",
    [orderId]
  );

  const MerchantTradeDate = new Date().toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
  TradeNo = "test" + new Date().getTime();
  let base_param = {
    MerchantTradeNo: orderId,
    MerchantTradeDate,
    TotalAmount: `${order[0].total_cost}`,
    TradeDesc: "MR.BEAN 咖啡豆專賣店",
    ItemName: "MR.BEAN 咖啡豆專賣店",
    ReturnURL: `${HOST}/cart/confirm/ecpay-check?orderId=${orderId}`,
    ClientBackURL: `http://localhost:3000/cart/confirm/success?orderId=${orderId}`,
  };
  const create = new ecpay_payment(options);
  const html = create.payment_client.aio_check_out_all(base_param);
  res.render("payment", {
    html,
  });
});

// 後端接收綠界回傳的資料
router.post("/confirm/ecpay-check", async (req, res) => {
  const orderId = req.query.orderId;

  const taiwanTime = moment().tz("Asia/Taipei").format("YYYY-MM-DD HH:mm:ss");
  const { CheckMacValue } = req.body;
  const data = { ...req.body };
  delete data.CheckMacValue;

  const create = new ecpay_payment(options);
  const checkValue = create.payment_client.helper.gen_chk_mac_value(data);

  console.log(
    "確認交易正確性：",
    CheckMacValue === checkValue,
    CheckMacValue,
    checkValue
  );
  if (CheckMacValue === checkValue) {
    await connection.execute(
      "UPDATE `order` SET payment_at = ? WHERE order_id = ?",
      [taiwanTime, orderId]
    );

    res.send("1|OK");
  }
});

//ECpay結束
router.get("/confirm/success", authenticate, async (req, res) => {
  const orderId = req.query.orderId;
  const [order] = await connection.execute(
    "SELECT *, CONVERT_TZ(payment_at, '+00:00', '+8:00') AS payment_at, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at FROM `order` WHERE order_id = ?",
    [orderId]
  );
  res.send(JSON.stringify(order));
});

//物流
router.get("/confirm/logistics", async (req, res) => {
  const LogisticsSubType = req.query.LogisticsSubType;
  let base_param = {
    MerchantTradeNo: `erixnoemail2000`,
    ServerReplyURL: `${HOST}/cart/confirm/logistics/success`,
    LogisticsType: "CVS",
    LogisticsSubType: `${LogisticsSubType}`,
    IsCollection: "N",
    Device: "0",
  };

  let create = new ecpay_logistics();

  let response = create.query_client.expressmap(base_param);
  res.send(response);
});
router.post("/confirm/logistics/success", (req, res) => {
  const { CVSStoreID, CVSAddress, CVSStoreName } = req.body;
  const logistics = `${CVSStoreName} ｜ ${CVSAddress} (${CVSStoreID}) `;
  res.redirect(`http://localhost:3000/cart/confirm?logistics=${logistics}`);
});

export default router;
