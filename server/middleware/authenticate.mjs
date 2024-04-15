import jwt from "jsonwebtoken";
import "dotenv/config.js";
const secretKey = process.env.ACCESS_TOKEN_SECRET;

// 驗證HTTP請求中的JWT（JSON Web Token）令牌的有效性
export default function authenticate(req, res, next) {
  // 從請求頭中獲取 Authorization 欄位
  const authHeader = req.get("Authorization");

  // 檢查 Authorization 欄位是否存在且格式正確（以 "Bearer " 開頭）
  if (authHeader && authHeader.indexOf("Bearer ") === 0) {
    // 從 Authorization 欄位中分割出 token
    const token = authHeader.split(" ")[1];

    // 如果 token 在黑名單中（例如已經被登出或手動撤銷），則返回錯誤
    // if (blackListedToken.includes(token)) {
    //   res.status(401).json({ error: "token過期" });
    //   return false;
    // }

    // 使用 jwt.verify 方法驗證 token 的有效性
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        // 如果驗證失敗（例如 token 過期或不合法），返回 401 狀態碼和錯誤信息
        return res.status(401).json({
          status: "error",
          message: "不合法的存取令牌",
        });
      } else {
        // 如果驗證成功，將解碼後的 token 信息附加到請求對象上，以供後續使用
        req.decoded = decoded;
        next(); // 繼續處理下一個中間件或路由處理器
      }
    });
  } else {
    // 如果沒有提供 token 或格式不正確，返回 401 狀態碼和錯誤信息
    return res.status(401).json({
      status: "error",
      message: "無登入驗證資料，請重新登入",
    });
  }
}
