import express from "express";
import multer from "multer";
import connection from "../../db_connect/db.mjs";

const upload = multer(); // 創建 multer 實例，用於文件上傳
const router = express.Router();

// 格式化日期的function
function formatDate(date) {
  const d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
}
// 刪除評論的function
async function updateCommentValid(commentId) {
  const sql = `UPDATE comment SET comment_valid = 0 WHERE comment_id = ?`;

  try {
    const [result] = await connection.execute(sql, [commentId]);
    return result;
  } catch (error) {
    console.error('更新評論狀態時發生錯誤：', error);
    throw error;
  }
}

// 新增評論頁，獲取商品詳情的函數
async function getItemDetails(tableName, itemId) {
  let query = '';
  let queryParams = [itemId];

  if (tableName === 'product') {
    query = 'SELECT product_name, product_img, product_spec, product_code FROM product WHERE product_id = ?';
  } else if (tableName === 'course_list') {
    query = 'SELECT course_name, course_img, course_location, course_category_id, course_id FROM course_list WHERE course_id = ?';
  } else {
    // 如果表名不是預期的，可以拋出錯誤或者處理異常情況
    throw new Error('Invalid table name');
  }

  const [rows] = await connection.query(query, queryParams);
  return rows.length > 0 ? rows[0] : null;
}

async function getOrderItemDetails(orderId, itemId, itemType) {
  const [rows] = await connection.query(
    'SELECT item_price FROM order_item WHERE order_id = ? AND item_id = ? AND item_type = ?',
    [orderId, itemId, itemType]
  );
  if (rows.length > 0) {
    return { item_price: rows[0].item_price }; // 返回包含 item_price 的對象
  } else {
    return null;
  }
}

// 會員中心 > 評論紀錄 相關路由
// 獲取登入使用者的所有有效評論的路由
router.get("/comments", async (req, res) => {
  const { uuid, type } = req.query; // 新增一個type查詢參數來指定篩選類型

  try {
    const [users] = await connection.query('SELECT user_id FROM user WHERE uuid = ?', [uuid]);
    if (users.length === 0) {
      return res.status(404).json({ message: "用戶未找到" });
    }
    const userId = users[0].user_id;

    // 基於篩選類型修改SQL查詢
    let query = 'SELECT * FROM comment WHERE comment_valid = 1 AND user_id = ?';
    let queryParams = [userId];

    // 如果type不是'all'，則添加額外的SQL條件
    if (type !== 'all') {
      query += ' AND item_type = ?';
      queryParams.push(type);
    }

    // 添加排序條件
    query += ' ORDER BY comment_created_at DESC';

    const [rows] = await connection.query(query, queryParams);

    const commentsWithDetails = await Promise.all(rows.map(async (comment) => {
      let itemDetails = {};
      if (comment.item_type === 'product') {
        const [products] = await connection.query('SELECT product_name FROM product WHERE product_id = ?', [comment.item_id]);
        itemDetails = products[0] ? products[0] : {};
      } else if (comment.item_type === 'course') {
        const [courses] = await connection.query('SELECT course_name FROM course_list WHERE course_id = ?', [comment.item_id]);
        itemDetails = courses[0] ? courses[0] : {};
      }
      return { ...comment, itemDetails };
    }));

    res.json(commentsWithDetails);
  } catch (err) {
    console.error("查詢有效評論時發生錯誤：", err);
    res.status(500).json({ message: "從資料庫獲取評論時發生錯誤" });
  }
});


// 獲取商品詳情路由
router.get('/getItemDetails', async (req, res) => {
  const { item_type, item_id, order_id } = req.query;

  try {
    // 根據商品類型選擇適當的表名
    const tableName = item_type === 'product' ? 'product' : 'course_list';

    // 使用通用的 getItemDetails 函數獲取商品或課程的詳細信息
    let itemDetails = await getItemDetails(tableName, item_id);

    // 如果找到商品詳情，則繼續獲取訂單項目的詳細信息
    if (itemDetails) {
      const orderItemDetails = await getOrderItemDetails(order_id, item_id, item_type);

      // 如果找到訂單項目詳情，則結合信息
      if (orderItemDetails) {
        itemDetails.item_price = orderItemDetails.item_price; // 更新商品價格
        itemDetails.order_id = order_id; // 添加訂單ID
      }

      // 返回結合後的詳細信息
      res.json(itemDetails);
    } else {
      res.status(404).json({ message: '未找到相應的商品信息' });
    }
  } catch (error) {
    console.error('查詢商品信息時發生錯誤:', error);
    res.status(500).json({ message: '服務器內部錯誤' });
  }
});

// 新增評論路由
router.post("/comment-create", async (req, res) => {
  const { order_id, item_id, item_type, comment_star, comment_text, uuid } = req.body;

  try {
    // 從 user 表中查詢 user_id
    const [users] = await connection.query('SELECT user_id FROM user WHERE uuid = ?', [uuid]);
    if (users.length === 0) return res.status(404).json({ message: "用戶未找到" });

    const user_id = users[0].user_id;

    // 檢查是否已評論過
    const [existingComment] = await connection.query(
      'SELECT * FROM comment WHERE user_id = ? AND order_id = ? AND item_id = ? AND item_type = ? AND comment_valid = 1',
      [user_id, order_id, item_id, item_type]
    );

    if (existingComment.length > 0) {
      return res.status(409).json({ message: "您已對該商品/課程在此訂單下提交過評論" });
    }

    // 插入新評論
    const comment_created_at = formatDate(new Date()); 
    const [result] = await connection.query(
      'INSERT INTO comment (order_id, item_id, item_type, user_id, comment_star, comment_text, comment_created_at, comment_valid) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
      [order_id, item_id, item_type, user_id, comment_star, comment_text, comment_created_at]
    );

    if (result.affectedRows > 0) {
      res.json({ status: 'success', message: '評論已成功提交' });
    } else {
      throw new Error('評論提交失敗');
    }
  } catch (error) {
    console.error('評論提交時發生錯誤:', error);
    res.status(500).json({ status: 'error', message: '評論提交時發生錯誤' });
  }
});

// 確認該使用者可以對已購買產品新增評論，如果沒購買就不能評論
router.get("/check-purchase", async (req, res) => {
  const { uuid, order_id, item_id, item_type } = req.query;

  try {
    // 從 user 表中查詢 user_id
    const [users] = await connection.query('SELECT user_id FROM user WHERE uuid = ?', [uuid]);
    if (users.length === 0) {
      return res.status(404).json({ message: "用戶未找到" });
    }
    const user_id = users[0].user_id;

    // 檢查在指定 order_id 下，是否有符合條件的 order_item 記錄
    const [item] = await connection.query(
      'SELECT * FROM order_item WHERE order_id = ? AND item_id = ? AND item_type = ?',
      [order_id, item_id, item_type]
    );

    if (item.length > 0) {
      res.json({ status: "purchased", message: "用戶已購買此商品或課程" });
    } else {
      res.json({ status: "not-purchased", message: "您未購買此商品或課程，無法評論" });
    }
  } catch (error) {
    console.error('檢查購買狀態時發生錯誤:', error);
    res.status(500).json({ message: '檢查購買狀態時發生錯誤' });
  }
});



// 刪除評論路由
router.delete('/comment-delete/:commentId', async (req, res) => {
  const { commentId } = req.params;

  try {
    const result = await updateCommentValid(commentId);
    if (result.affectedRows > 0) {
      res.json({ message: "評論已成功刪除（設置為無效）" });
    } else {
      res.status(404).json({ message: "未找到指定評論" });
    }
  } catch (error) {
    console.error('刪除評論時發生錯誤：', error);
    res.status(500).json({ message: "刪除評論時發生錯誤" });
  }
});


export default router;


