import mysql from "mysql2/promise";
import "colors";
import dotenv from "dotenv";
dotenv.config();
const connection = await mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 5,
});

// 測試連接池
connection
  .query("SELECT 1")
  .then(() => {
    console.log("INFO - 資料庫已連線 Database connected.".bgGreen);
  })
  .catch((error) => {
    console.log(
      "ERROR - 無法連線至資料庫 Unable to connect to the database.".bgRed
    );
    console.error(error);
  });

export default connection;

