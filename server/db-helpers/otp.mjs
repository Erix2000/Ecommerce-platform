import connection from "../db_connect/db.mjs";
import { generateToken } from "../config/otp.mjs";
import { generateHash, compareHash } from "./password-hash.mjs";

// 判斷是否可以重設token，如果可以，返回true
const shouldReset = (expTimestamp, exp, limit = 60) => {
  const createdTimestamp = expTimestamp - exp * 60 * 1000; // 計算創建時間戳
  return Date.now() - createdTimestamp > limit * 1000; // 如果當前時間與創建時間的差大於限制時間，則可重設
};

// 生成OTP，exp為到期時間（分鐘），limit為不產生新token的時間限制（秒）
const createOtp = async (email, exp = 30, limit = 60) => {
  // 查詢使用者是否存在
  const [userRows] = await connection.query(
    "SELECT * FROM user WHERE user_email = ?",
    [email]
  );
  if (userRows.length === 0) {
    console.log("ERROR - 使用者帳號不存在");
    return {};
  }
  const user = userRows[0];

  // 查詢是否已有OTP紀錄
  const [foundOtpRows] = await connection.query(
    "SELECT * FROM otps WHERE email = ?",
    [email]
  );
  const foundOtp = foundOtpRows[0];

  // 判斷是否滿足重設條件
  if (foundOtp && !shouldReset(foundOtp.exp_timestamp, exp, limit)) {
    console.log("ERROR - 60秒內不能重新生成OTP");
    return {};
  }

  // 生成新的OTP token
  const token = generateToken(email);
  const exp_timestamp = Date.now() + exp * 60 * 1000; // 計算過期時間戳

  // 更新或插入OTP記錄
  if (foundOtp) {
    await connection.query(
      "UPDATE otps SET token = ?, exp_timestamp = ? WHERE email = ?",
      [token, exp_timestamp, email]
    );
  } else {
    await connection.query(
      "INSERT INTO otps (user_id, email, token, exp_timestamp) VALUES (?, ?, ?, ?)",
      [user.user_id, email, token, exp_timestamp]
    );
  }

  return { token, exp_timestamp };
};

// 更新密碼
const updatePassword = async (email, token, newPassword) => {
  // 查詢OTP記錄
  const [foundOtpRows] = await connection.query(
    "SELECT * FROM otps WHERE email = ? AND token = ?",
    [email, token]
  );
  const foundOtp = foundOtpRows[0];

  // 確認OTP記錄存在且未過期
  if (!foundOtp) {
    return { status: "error", message: "Token資料不存在" };
  }

  if (Date.now() > foundOtp.exp_timestamp) {
    return { status: "error", message: "Token已過期" };
  }

  const [userRows] = await connection.query(
    "SELECT password FROM user WHERE user_id = ?",
    [foundOtp.user_id]
  );

  if (userRows.length === 0) {
    return { status: "error", message: "用戶不存在" };
  }
  const currentUserPassword = userRows[0].password;

  const isSamePassword = await compareHash(newPassword, currentUserPassword);
  if (isSamePassword) {
    return { status: "error", message: "新密碼不能與舊密碼相同" };
  }

  // 加密新密碼並更新使用者資料庫記錄
  const encryptedPassword = await generateHash(newPassword);

  await connection.query("UPDATE user SET password = ? WHERE user_id = ?", [
    encryptedPassword,
    foundOtp.user_id,
  ]);
  // 刪除OTP記錄
  await connection.query("DELETE FROM otps WHERE id = ?", [foundOtp.id]);

  return { status: "success", message: "密碼更新成功" };
};

export { createOtp, updatePassword };
