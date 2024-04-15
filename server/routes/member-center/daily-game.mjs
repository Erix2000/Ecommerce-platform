import express from "express"; // Node.js 的 Web 應用程式框架
import multer from "multer"; //用於處理在表單中上傳的文件
import connection from "../../db_connect/db.mjs"; // 連線資料庫
import moment from 'moment-timezone'; //處理不同時區的日期和時間

const dateString = '2024-03-13'; // 假設這是後端返回的日期字串
const dateInTaipei = moment.tz(dateString, "Asia/Taipei"); // 將日期解析為台北時區的時間

const upload = multer(); // 創建 multer 實例，用於文件上傳
const router = express.Router();

// POST 路由，用於處理簽到
router.post("/sign-in", async (req, res) => {
    const { uuid, signInDate, pointsText } = req.body;

    try {
        // 使用 uuid 查詢 user_id
        const [userQueryResults] = await connection.query(
            "SELECT user_id FROM user WHERE uuid = ?",
            [uuid]
        );

        if (userQueryResults.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = userQueryResults[0].user_id;

        // 查詢當月已簽到的次數
        const [monthSignInCount] = await connection.query(
            "SELECT COUNT(*) AS count FROM sign_in_records WHERE user_id = ? AND MONTH(sign_in_date) = MONTH(?) AND YEAR(sign_in_date) = YEAR(?)",
            [userId, signInDate, signInDate]
        );

        // 根據當月簽到次數決定獲得的積分
        let points = 1; // 預設為1分
        const signInCount = monthSignInCount[0].count + 1; // 包括這個月的簽到次數+當天簽到
        if (signInCount === 8) {
            points = 3;
        } else if (signInCount === 15) {
            points = 6;
        } else if (signInCount === 22) {
            points = 11;
        }

        // 插入簽到記錄到 sign_in_records 表，包括獲得的積分
        await connection.query(
            "INSERT INTO sign_in_records (user_id, sign_in_date, points, points_text) VALUES (?, ?, ?, ?)",
            [userId, signInDate, points, pointsText || '簽到贈點']
        );

        // 查詢並更新 points_total
        // const [latestPointsResult] = await connection.query(
        //     "SELECT points_total FROM member_points WHERE user_id = ? ORDER BY points_created_at DESC LIMIT 1",
        //     [userId]
        // );

        // let newPointsTotal = points;
        // if (latestPointsResult.length > 0) {
        //     newPointsTotal += latestPointsResult[0].points_total;
        // }

        // 插入積分記錄到 member_points 表
        await connection.query(
            "INSERT INTO member_points (user_id, points_change, points_created_at, points_text) VALUES (?, ?, now(), ?)",
            [userId, points, pointsText || '簽到贈點']
        );

        res.status(200).json({
            message: "Sign-in and points updated successfully",
            points: points
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET 路由，用於讀取資料庫有哪些天數簽到過了
router.get("/signed-dates", async (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const [rows] = await connection.query(
            "SELECT CONVERT_TZ(sign_in_date, '+00:00', '+08:00') AS sign_in_date FROM sign_in_records WHERE user_id = ?",
            [user_id]
        );

        const signedDates = rows.map(row =>
            row.sign_in_date instanceof Date ? row.sign_in_date.toISOString().split('T')[0] : row.sign_in_date
        );

        res.json(signedDates);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
