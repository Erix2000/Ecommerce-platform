import connection from "../db_connect/db.mjs";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../config/mail.mjs";
import "dotenv/config.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { generateHash, compareHash } from "../db-helpers/password-hash.mjs";
import fs from "fs/promises";
import path from "path";
const secretKey = process.env.ACCESS_TOKEN_SECRET;

// ■■■ 會員註冊 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// {
//   "status": "success",
//   "msg": "註冊成功，請檢查您的郵箱進行認證。",
//   "user": {
//       "user_id": 39,
//       "uuid": "1cf45ce0-2a04-456e-8cae-cfaa07f7fd5c",
//       "exclusive_code": null,
//       "user_name": "徐上閔",
//       "user_email": "aaa@gmail.com",
//       "google_id": null,
//       "line_id": null,
//       "password": "$2b$10$HRjw/...",
//       "user_img": null,
//       "user_sex": null,
//       "user_birth": null,
//       "mailing_address": null,
//       "delivery_address": null,
//       "user_tel": null,
//       "other_information": null,
//       "created_at": "2024-03-04T16:00:00.000Z",
//       "modified_at": null,
//       "user_valid": 0
//   }
// }
export async function userSignUp(req) {
  const {
    user_name,
    user_email,
    password,
    user_birth,
    user_tel,
    user_sex,
    mailing_address,
    delivery_address,
  } = req.body;
  const [users] = await connection.execute(
    "SELECT 1 FROM user WHERE user_email = ?",
    [user_email]
  );

  if (users.length > 0) {
    throw new Error("電子郵件已被使用。");
  }

  const uuid = uuidv4();
  const hashedPassword = await generateHash(password);
  // let sexDescription;
  // switch (user_sex) {
  //   case "1":
  //     sexDescription = "生理男";
  //     break;
  //   case "2":
  //     sexDescription = "生理女";
  //     break;
  //   case "3":
  //     sexDescription = "不方便透漏";
  //     break;
  //   default:
  //     sexDescription = null;
  // }
  const validDuration = 24 * 60 * 60 * 1000;
  const validExpiresAt = new Date(Date.now() + validDuration);
  const created_at = new Date();

  await connection.execute(
    "INSERT INTO user (uuid,user_name, user_email, password, user_birth, user_tel, user_sex, mailing_address, delivery_address,created_at,validmail_expires_at,user_valid) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?,?,?,0)",
    [
      uuid,
      user_name,
      user_email,
      hashedPassword,
      user_birth || null,
      user_tel || null,
      user_sex || null,
      mailing_address || null,
      delivery_address || null,
      created_at,
      validExpiresAt,
    ]
  );

  const [user] = await connection.execute(
    "SELECT * FROM user WHERE user_email = ?",
    [user_email]
  );

  if (user.length > 0) {
    await sendVerificationEmail({ user: user[0] });
    return user[0];
  } else {
    throw new Error("插入後未找到用戶。");
  }
}

// ■■■ 信箱驗證 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export async function validateUserEmail(req) {
  const { token } = req.query;
  const decodedToken = decodeURIComponent(token);
  const [users] = await connection.execute(
    "SELECT user_id FROM user WHERE uuid = ? AND validmail_expires_at > NOW()",
    [decodedToken]
  );
  if (users.length > 0) {
    const user = users[0];
    await connection.execute(
      "UPDATE user SET user_valid = 1, validmail_expires_at = NULL WHERE uuid = ?",
      [decodedToken]
    );
    const [coupon] = await connection.execute(
      "INSERT INTO coupon_user_mapping (user_id, coupon_id, expire_at, valid) VALUES (?, 1, DATE_ADD(NOW(), INTERVAL 30 DAY), 1)",
      [user.user_id]
    );

    if (coupon.affectedRows > 0) {
      return { success: true, message: "帳號已驗證成功，並已添加優惠券" };
    } else {
      await connection.execute(
        "UPDATE user SET user_valid = 0, validmail_expires_at = NOW() + INTERVAL 1 HOUR WHERE uuid = ?",
        [decodedToken]
      );
      return { success: false, message: "驗證成功但添加優惠券失敗" };
    }
  } else {
    return { success: false, message: "驗證無效或已過期" };
  }
}

// ■■■ 會員登入 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// {
//   "status": "success",
//   "message": "傳送access token回應",
//   "accessToken": "eyJhbGc7...."
//   }
export async function userLogin(req) {
  const { user_email, password } = req.body;

  if (!user_email || !password) {
    throw new Error("沒有收到必要資料");
  }

  const [hasUserRows] = await connection.execute(
    "SELECT * FROM user WHERE user_email=? LIMIT 1",
    [user_email]
  );

  if (hasUserRows.length === 0) {
    throw new Error("使用者不存在");
  }

  const isValid = await compareHash(password, hasUserRows[0].password);

  if (!isValid) {
    throw new Error("密碼錯誤");
  }

  const returnUser = {
    id: hasUserRows[0].user_id,
    uuid: hasUserRows[0].uuid,
    username: hasUserRows[0].user_name,
    google_id: hasUserRows[0].google_id,
    line_id: hasUserRows[0].line_id,
  };

  const accessToken = jwt.sign(returnUser, secretKey, {
    expiresIn: "1d",
  });
  return accessToken;
}

// ■■■ 會員登出 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// {
//     "status": "success",
//     "accessToken": "eyJhbGciOi....."
// }
export async function logoutUser(uuid) {
  try {
    const [results] = await connection.execute(
      "SELECT 1 FROM user WHERE uuid = ?",
      [uuid]
    );
    if (results.length > 0) {
      const expiredToken = jwt.sign(
        { id: "", uuid: "", username: "", google_id: "", line_id: "" },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "-10s" }
      );
      return { success: true, expiredToken };
    } else {
      return { success: false, message: "登出失敗，用戶不存在" };
    }
  } catch (error) {
    console.error("Error executing logout:", error);
    throw error;
  }
}

// ■■■ 查看會員資料 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export async function userInfo(req) {
  const uuid = req.decoded.uuid;
  const [users] = await connection.execute(
    "SELECT * FROM user WHERE uuid = ?",
    [uuid]
  );
  if (users.length === 0) {
    throw new Error("用户不存在");
  }

  const user = users[0];

  user.user_birth = user.user_birth
    ? user.user_birth.toISOString().substring(0, 10)
    : "";

  const [pointsRecords] = await connection.execute(
    "SELECT points_change FROM member_points WHERE user_id = ?",
    [user.user_id]
  );

  const totalPointsChange = pointsRecords.reduce(
    (acc, record) => acc + record.points_change,
    0
  );
  user.points_total = totalPointsChange;

  delete user.password;
  return user;
}
// ■■■ 修改會員密碼 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export async function updatePassword(req) {
  const updatePasswordData = req.body;
  const uuid = req.decoded.uuid;

  if (!updatePasswordData.password || !updatePasswordData.newpassword) {
    throw new Error("密碼不能為空");
  }

  const [dbUser] = await connection.execute(
    "SELECT * FROM user WHERE uuid = ?",
    [uuid]
  );
  if (dbUser.length === 0) {
    throw new Error("用戶不存在");
  }
  const passwordIsValid = await compareHash(
    updatePasswordData.password,
    dbUser[0].password
  );
  if (!passwordIsValid) {
    throw new Error("當前密碼不正確");
  }

  const newIsSameAsCurrent = await compareHash(
    updatePasswordData.newpassword,
    dbUser[0].password
  );
  if (newIsSameAsCurrent) {
    throw new Error("新密碼不能與當前密碼相同");
  }

  const hashedPassword = await generateHash(updatePasswordData.newpassword);
  const [row] = await connection.execute(
    "UPDATE user SET password = ?,modified_at= CURRENT_TIMESTAMP WHERE uuid = ?",
    [hashedPassword, uuid]
  );
}

// ■■■ 修改會員資料 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export async function userUpdate(req) {
  const updateData = req.body;
  const uuid = req.params.uuid;

  if (req.decoded.uuid !== uuid) {
    throw new Error("存取會員資料失敗");
  }

  if (!uuid || !updateData.user_name) {
    throw new Error("缺少必要資料");
  }

  const [dbUser] = await connection.execute(
    "SELECT 1 FROM user WHERE uuid = ?",
    [uuid]
  );

  if (dbUser.length === 0) {
    throw new Error("使用者不存在");
  }

  if (!updateData.user_birth) {
    delete updateData.user_birth;
  }
  const [userUpdateResult] = await connection.execute(
    "UPDATE user SET user_name = ?, user_birth = ?, user_tel = ?, user_sex = ?,user_img=?, mailing_address = ?, delivery_address = ?,modified_at= CURRENT_TIMESTAMP WHERE uuid = ?",
    [
      updateData.user_name,
      updateData.user_birth || null,
      updateData.user_tel || null,
      updateData.user_sex || null,
      updateData.user_img,
      updateData.mailing_address,
      updateData.delivery_address || null,
      uuid,
    ]
  );
  if (userUpdateResult.affectedRows === 0) {
    throw new Error("更新失敗或沒有數據被更新");
  }
  const [rows] = await connection.execute("SELECT * FROM user WHERE uuid = ?", [
    uuid,
  ]);
  const user = rows[0];
  delete user.password;
  return user;
}

// ■■■ 查看會員點數 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export async function useInfoPoint(req) {
  const id = req.decoded.id;
  const [rows] = await connection.execute(
    "SELECT *, DATE_FORMAT(points_created_at, '%Y-%m-%d') AS formatted_points_created_at FROM member_points WHERE user_id = ? ORDER BY points_id DESC",
    [id]
  );
  const pointsRecords = rows;
  return pointsRecords;
}

// ■■■ 查看講師資料 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export async function lecturerInfo(req) {
  const uuid = req.decoded.uuid;
  const [user] = await connection.execute("SELECT * FROM user WHERE uuid = ?", [
    uuid,
  ]);
  if (user.length === 0) {
    throw new Error("用户不存在");
  }
  const exclusiveCode = user[0].exclusive_code;
  const [row] = await connection.execute(
    "SELECT * FROM lecturer WHERE exclusive_code = ?",
    [exclusiveCode]
  );
  if (row.length === 0) {
    throw new Error("講師不存在");
  }
  const lecturer = row[0];
  return lecturer;
}

// ■■■ 修改講師資料 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export async function lecturerUpdate(req, filename) {
  const updateData = req.body;
  const exclusiveCode = req.params.exclusiveCode;
  const uuid = req.decoded.uuid;
  const [dbUser] = await connection.execute(
    "SELECT * FROM user WHERE uuid = ?",
    [uuid]
  );
  if (dbUser[0].exclusive_code !== exclusiveCode) {
    throw new Error("無權存取此資料");
  }
  if (
    !exclusiveCode ||
    !updateData.lecturer_name ||
    !updateData.lecturer_expertise ||
    !updateData.lecturer_honor ||
    !updateData.lecturer_experience
  ) {
    throw new Error("缺少必要資料");
  }
  if (filename) {
    updateData.lecturer_img = filename;
  }
  const [lecturerExist] = await connection.execute(
    "SELECT lecturer_img FROM lecturer WHERE exclusive_code = ?",
    [exclusiveCode]
  );
  if (lecturerExist.length > 0) {
    const oldLecturerImg = lecturerExist[0].lecturer_img;
    if (oldLecturerImg && filename && oldLecturerImg !== filename) {
      const oldImagePath = path.join("public", "lecturer", oldLecturerImg);
      try {
        await fs.unlink(oldImagePath);
        console.log(`Deleted old image: ${oldLecturerImg}`);
      } catch (err) {
        console.error(`Error deleting old image: ${err}`);
      }
    }
  }
  if (lecturerExist.length === 0) {
    throw new Error("講師不存在");
  }
  const newLecturerImg = filename ? filename : lecturerExist[0].lecturer_img;
  const [lecturerUpdateResult] = await connection.execute(
    "UPDATE lecturer SET lecturer_name = ?,lecturer_img = ?, lecturer_expertise = ?, lecturer_honor = ?, lecturer_experience = ?,modified_at= CURRENT_TIMESTAMP WHERE exclusive_code = ?",
    [
      updateData.lecturer_name,
      newLecturerImg,
      updateData.lecturer_expertise,
      updateData.lecturer_honor,
      updateData.lecturer_experience,
      exclusiveCode,
    ]
  );
  if (lecturerUpdateResult.affectedRows === 0) {
    throw new Error("更新失敗或沒有數據被更新");
  }
  const [rows] = await connection.execute(
    "SELECT * FROM lecturer WHERE exclusive_code = ?",
    [exclusiveCode]
  );
  const updatedLecturer = rows[0];
  return updatedLecturer;
}

// ■■■ 查看講師課程資料 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export async function lecturerInfoClasses(req) {
  const uuid = req.decoded.uuid;
  const [user] = await connection.execute("SELECT * FROM user WHERE uuid = ?", [
    uuid,
  ]);
  if (user.length === 0) {
    throw new Error("用户不存在");
  }
  const exclusiveCode = user[0].exclusive_code;
  const [row] = await connection.execute(
    "SELECT * FROM course_list WHERE exclusive_code = ?",
    [exclusiveCode]
  );
  if (row.length === 0) {
    throw new Error("講師不存在");
  }
  const course = row;
  return course;
}
