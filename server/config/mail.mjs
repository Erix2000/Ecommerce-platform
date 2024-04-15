import nodemailer from "nodemailer";
import "dotenv/config.js";

let transport = null;

// 定義所有email的寄送伺服器位置
transport = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use TLS
  //在專案的 .env 檔案中定義關於寄送郵件的 process.env 變數
  auth: {
    user: process.env.SMTP_TO_EMAIL,
    pass: process.env.SMTP_TO_PASSWORD,
  }
};

// 呼叫transport函式
export const transporter = nodemailer.createTransport(transport);

// 驗証連線設定
transporter.verify((error, success) => {
  if (error) {
    // 發生錯誤
    console.error(
      "ERROR - 無法連線至SMTP伺服器 Unable to connect to the SMTP server.".bgRed
    );
    console.log(error)
  } else {
    // 代表成功
    console.log("INFO - SMTP伺服器已連線 SMTP server connected.".bgGreen);
  }
});

// export default transporter

export async function sendVerificationEmail({ user }) {
  const validationToken = encodeURIComponent(user.uuid);
  const validationLink = `http://localhost:3005/api/member/validate?token=${validationToken}`;
  // email內容
  const mailOptions = {
    from: `"support"<${process.env.SMTP_TO_EMAIL}>`,
    to: user.user_email,
    subject: "MR.Bean 個人帳號認證信",
    text: `你好!!! ${user.user_name}， \r\n我們收到了一個請求，用於通過您的電子郵件地址創建一個MR.Bean的新帳戶。如果這是您的操作，請點擊下面的連結確認您的電子郵件地址並啟用您的帳戶。

    [確認電子郵件地址和啟用帳戶](${validationLink})
    
    如果您沒有請求創建帳戶，可能是有人錯誤地輸入了您的電子郵件地址，您可以忽略此郵件。
    
    感謝您對MR.Bean的支持！

    我們將贈送一張優惠卷到你的帳戶當中，煩請查收。
    
    敬上,
    MR.Bean 開發團隊`,
    html: `    <div style="background-color: #003e52; border: 5px solid #bc955c; border-radius: 0.25rem; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: auto; padding: 40px; color: #ffffff;">
    <h2 style="color: #ffffff; font-size: 32px; text-shadow: 2px 2px 4px #000000; text-align: center;">Mr.Bean 豆豆先生 會員註冊通知</h2>
        <p style="font-size: 16px;">您好, ${user.user_name}，</p>
        <p style="font-size: 16px;">我們收到了一個請求，用於通過您的電子郵件地址創建一個MR.Bean的新帳戶。如果這是您的操作，請點擊下面的連結確認您的電子郵件地址並啟用您的帳戶。</p>
        <a href="${validationLink}" target="_blank" style="background-color: #bc955c; color: #2a3f5f; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">確認電子郵件地址和啟用帳戶</a>
        <p style="font-size: 16px;">如果您沒有請求創建帳戶，可能是有人錯誤地輸入了您的電子郵件地址，您可以忽略此郵件。</p>
        <p style="font-size: 16px;">感謝您對豆豆先生的支持與愛護！我們期待繼續為您提供最優質的咖啡豆和服務。</p>
        <p style="font-size: 16px;">祝您有個美好的一天！</p>
        <p style="font-size: 16px;">我們將贈送一張優惠卷到你的帳戶當中，煩請查收。</p>
        <p style="font-size: 16px;">敬上，</p>
        <p style="font-size: 16px;">豆豆先生團隊</p>
        <hr>
        <div style="text-align: center; font-size: 14px; padding-top: 20px;">
        © ${new Date().getFullYear()} Mr.Bean 豆豆先生. 版權所有。
    </div>
      </div>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent.", user.user_email);
  } catch (error) {
    console.error("Error sending verification email: ", error);
  }
}
