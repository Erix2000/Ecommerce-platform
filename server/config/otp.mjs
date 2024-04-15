import * as OTPAuth from 'otpauth'
import 'dotenv/config.js'

const otpSecret = process.env.OTP_SECRET

let totp = null

// 產生一個令牌（以字串形式傳回目前令牌）。
// 每個使用者使用 email+sharedSecret 來分享秘密
const generateToken = (email = '') => {
  // 建立新的 TOTP 物件
  // 註: issuer和label是當需要整合Google Authenticator使用的
  totp = new OTPAuth.TOTP({
    issuer: 'express-base',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromLatin1(email + otpSecret),
  })

  return totp.generate()
}

//驗證令牌（如果在搜尋視窗中找不到令牌，則傳回令牌增量或 null，在這種情況下應將其視為無效）。
// 驗証totp在step window期間產生的token一致用的(預設30s)
const verifyToken = (token) => {
  const delta = totp.validate({ token, window: 1 })
  return delta === null ? false : true
}

export { generateToken, verifyToken }
