import express from "express";
import { createOtp, updatePassword } from "../db-helpers/otp.mjs";
import { transporter } from "../config/mail.mjs";
import "dotenv/config.js";
const router = express.Router();
import multer from "multer";
const upload = multer();

const mailText = (otpToken) => `親愛的Mr.Bean會員 您好，

我們收到了一項請求，要求透過您的電子郵件地址重設密碼。為了保護您的帳戶安全，請您在重設密碼頁面輸入以下的6位數驗證碼。請留意，此驗證碼將在發送後30分鐘後失效。

您的驗證碼是：${otpToken}

如果您並未請求重設密碼，請忽略此郵件，或是您可以聯繫我們的客服人員以獲得協助。我們在這裡始終保障您的帳戶安全。

感謝您對豆豆先生的支持與愛護！我們期待繼續為您提供最優質的咖啡豆和服務。

祝您有個美好的一天！

敬上，
豆豆先生團隊
`;

const mailHtml = (otpToken) => `
    <div style="background-color: #003e52; border: 5px solid #bc955c; border-radius: 0.25rem; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: auto; padding: 40px; color: #ffffff;">
        <h2 style="color: white; font-size: 32px; text-shadow: 2px 2px 4px #000000; text-align: center;">Mr.Bean 豆豆先生 密碼重設通知</h2>
        <p style="font-size: 16px;">您好,</p>
        <p style="font-size: 16px;">我們收到了一項請求，要求透過您的電子郵件地址重設密碼。為了保護您的帳戶安全，請您在重設密碼頁面輸入以下的6位數驗證碼。請留意，此驗證碼將在發送後30分鐘後失效。</p>
        您的驗證碼是：<span style="background-color: #bc955c; color: #2a3f5f; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">${otpToken}</span>
        <p style="font-size: 16px;">如果您並未請求重設密碼，請忽略此郵件，或是您可以聯繫我們的客服人員以獲得協助。我們在這裡始終保障您的帳戶安全。</p>
        <p style="font-size: 16px;">感謝您對豆豆先生的支持與愛護！我們期待繼續為您提供最優質的咖啡豆和服務。</p>
        <p style="font-size: 16px;">祝您有個美好的一天！</p>
        <p style="font-size: 16px;">敬上，</p>
        <p style="font-size: 16px;">豆豆先生團隊</p>
        <hr>
        <div style="text-align: center; font-size: 14px; padding-top: 20px;">
            © ${new Date().getFullYear()} Mr.Bean 豆豆先生. 版權所有。
        </div>
    </div>
  `;

// 創建 OTP 路由
router.post("/otp", upload.none(), async (req, res, next) => {
  const { email } = req.body;

  if (!email) return res.json({ status: "error", message: "缺少必要資料" });

  const otp = await createOtp(email);

  if (!otp.token)
    return res.json({ status: "error", message: "Email錯誤或期間內重覆要求" });

  const mailOptions = {
    from: `"support"<${process.env.SMTP_TO_EMAIL}>`,
    to: email,
    subject: "Mr.Bean 重設密碼要求的電子郵件驗證碼",
    text: mailText(otp.token),
    html: mailHtml(otp.token),
  };

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      return res.json({ status: "error", message: "發送電子郵件失敗" });
    } else {
      return res.json({ status: "success", data: null });
    }
  });
});

// 重設密碼路由
router.post("/reset", upload.none(), async (req, res) => {
  const { email, token, password } = req.body;
  console.log("req.body", req.body);
  if (!token || !email || !password) {
    return res.json({ status: "error", message: "缺少必要資料" });
  }
  const result = await updatePassword(email, token, password);
  if (result.status === "error") {
    return res.json({
      status: "error",
      message: result.message || "修改密碼失敗",
    });
  }
  return res.json({ status: "success", message: "密碼更新成功", data: null });
});

export default router;
