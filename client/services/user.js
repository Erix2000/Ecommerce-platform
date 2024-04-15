// import useSWR from 'swr'

// 資料庫基本路由
const BASE_URL = 'http://localhost:3005'

// ■■■ 檢查會員狀態使用 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export const checkAuth = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const response = await fetch(`${BASE_URL}/api/member/check`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    console.log('checkAuth', data)
    if (!response.ok) {
      // throw new Error(data.message || '網路回應不好')
      return {
        data: null,
        state: 'error',
        error: data.message || '網路回應不好',
      }
    }
    return { data, status: 'success', error: null }
  } catch (error) {
    console.error('檢查會員狀態請求失敗:', error)
    return {
      data: null,
      status: 'error',
      error: error.message || '檢查會員狀態請求失敗',
    }
  }
}

// ■■■ Google Login(Firebase)登入用■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export const googleLogin = async (providerData = {}) => {
  try {
    const response = await fetch(`${BASE_URL}/api/google-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(providerData),
    })
    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    console.error('Google 登入請求失敗:', error)
    return { data: null, error: error.message || 'Google 登入請求失敗' }
  }
}

// LINE Login登入用，要求LINE登入的網址
export const lineLoginRequest = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/line-login/login`)
    const data = await response.json()
    if (data.url) {
      window.location.href = data.url
    }
    return { data, error: null }
  } catch (error) {
    console.error('LINE 登入請求失敗:', error)
    return { data: null, error: error.message || 'LINE 登入請求失敗' }
  }
}

// LINE Login登入用，處理LINE方登入後，向我們的伺服器進行登入動作
export const lineLoginCallback = async (query) => {
  try {
    // 先列印出查詢參數，用於調試

    // 將查詢參數(query)轉換成URL的查詢字符串格式
    const qs = new URLSearchParams(query).toString()
    console.log(qs)
    // 使用fetch發送請求到後端的LINE登入回調接口，並附加查詢字符串
    const response = await fetch(`${BASE_URL}/api/line-login/callback?${qs}`, {
      method: 'GET', // 指定請求方法為GET
    })
    // 從響應中解析JSON格式的數據
    const data = await response.json()
    // 如果成功，返回包含數據和null錯誤的對象
    return { data, error: null }
  } catch (error) {
    // 捕獲並處理任何在請求過程中發生的錯誤
    console.error('LINE登入回調請求失敗:', error) // 在控制台列印錯誤信息
    // 返回包含null數據和錯誤消息的對象
    return { data: null, error: error.message || 'LINE登入回調請求失敗' }
  }
}

// LINE 登出用
// export const lineLogout = async (line_uid) => {
//   try {
//     const response = await fetch(
//       `${BASE_URL}/api/line-login/logout?line_uid=${line_uid}`,
//       {
//         method: 'GET',
//       }
//     )
//     const data = await response.json()
//     return { data, error: null }
//   } catch (error) {
//     console.error('LINE登出請求失敗:', error)
//     return { data: null, error: error.message || 'LINE登出請求失敗' }
//   }
// }

// ■■■ 會員登入 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// {
//   "status": "success",
//   "message": "傳送access token回應",
//   "accessToken": "eyJhbGciOiJIUzI1NiIsInR..."
// }
export const login = async (user = {}) => {
  try {
    const response = await fetch(`${BASE_URL}/api/member/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_email: user.user_email,
        password: user.password,
      }),
    })
    console.log(response)
    const data = await response.json()
    console.log(data)
    if (!response.ok) {
      let errorMessage = '網路回應不好'
      if (data.message) {
        switch (data.message) {
          case '使用者不存在':
            errorMessage = '帳號不存在，請檢查輸入或進行註冊。'
            break
          case '密碼錯誤':
            errorMessage = '密碼錯誤，請再次嘗試。'
            break
          default:
            errorMessage = data.message
        }
      }
      throw new Error(errorMessage)
    }

    return { data, error: null }
  } catch (error) {
    console.error('登入請求失敗:', error)
    return {
      data: null,
      status: 'error',
      error: error.message || '登入請求失敗',
    }
  }
}

// ■■■ 會員登出 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// {
//   "status": "success",
//   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...."
// }
export const logout = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const response = await fetch(`${BASE_URL}/api/member/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      localStorage.removeItem('accessToken')
      console.log('Before removing:', localStorage.getItem('accessToken'))
      localStorage.removeItem('accessToken')
      console.log('After removing:', localStorage.getItem('accessToken'))
    }
    return { data, error: null }
  } catch (error) {
    console.error('登出請求失敗:', error)
    return { data: null, error: error.message || '登出請求失敗' }
  }
}

// ■■■ 會員資訊 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// {
//   "status": "success",
//   "msg": "查詢資料成功",
//   "user": {
//       "user_id": 13,
//       "uuid": "a0d6bf38-e757-45fa-841e-9fb9ff95c1f0",
//       "exclusive_code": null,
//       "user_name": "徐上閔222",
//       "user_email": "happymin0318@gmail.com",
//       "google_id": null,
//       "line_id": null,
//       "user_img": null,
//       "user_sex": "生理男",
//       "user_birth": "1982-08-04",
//       "mailing_address": null,
//       "delivery_address": null,
//       "user_tel": null,
//       "points_total": null,
//       "other_information": null,
//       "created_at": "2024-03-08T16:00:00.000Z",
//       "modified_at": null,
//       "user_valid": 0
//   }
// }
export const getUserInfo = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    console.log(123, token)
    const response = await fetch(`${BASE_URL}/api/member/user-info`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    console.log(data)
    if (!response.ok) {
      return {
        data: null,
        status: 'error',
        error: data.message || '獲取資訊時網路回應不佳',
      }
    }
    return { data, status: 'success', error: null }
  } catch (error) {
    console.error('獲取會員資訊請求失敗:', error)
    return {
      data: null,
      status: 'error',
      error: error.message || '獲取會員資訊請求失敗',
    }
  }
}

// ■■■ 忘記密碼/OTP 要求一次性密碼 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export const requestOtpToken = async (email = '') => {
  try {
    const response = await fetch(`${BASE_URL}/api/reset-password/otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    return await response.json()
  } catch (error) {
    // console.error('請求OTP失敗:', error)
    throw new Error('請求OTP時發生錯誤')
  }
}

// ■■■ 忘記密碼/OTP 重設密碼 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export const resetPassword = async (email = '', password = '', token = '') => {
  try {
    const response = await fetch(`${BASE_URL}/api/reset-password/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        token,
        password,
      }),
    })
    return await response.json()
  } catch (error) {
    console.error('重設密碼失敗:', error)
    throw new Error('重設密碼時發生錯誤')
  }
}

// ■■■ 註冊用 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export const register = async (user = {}) => {
  try {
    const response = await fetch(`${BASE_URL}/api/member/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || '網路請求未成功')
    }
    return { data, error: null }
  } catch (error) {
    console.error('註冊請求失敗:', error)
    return {
      data: {
        status: 'error',
        message: error.message || '註冊請求失敗',
      },
    }
  }
}

// ■■■ 修改會員一般資料用 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export const updateUserInfo = async (uuid = 0, user = {}) => {
  const token = localStorage.getItem('accessToken')
  try {
    const response = await fetch(
      `${BASE_URL}/api/member/${uuid}/use-info-revise`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      }
    )
    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    console.error('修改會員資料請求失敗:', error)
    return { data: null, error: error.message || '修改會員資料請求失敗' }
  }
}

// ■■■ 修改會員密碼專用 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export const updatePassword = async (password = {}) => {
  const token = localStorage.getItem('accessToken')
  try {
    const response = await fetch(`${BASE_URL}/api/member/edit-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(password),
    })
    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    console.error('修改會員密碼請求失敗:', error)
    return { data: null, error: error.message || '修改會員密碼請求失敗' }
  }
}

// ■■■ 會員點數資訊 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export const getUserInfoPoint = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const response = await fetch(`${BASE_URL}/api/member/use-info-point`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (!response.ok) {
      return {
        data: null,
        status: 'error',
        error: data.message || '獲取資訊時網路回應不佳',
      }
    }
    return { data, status: 'success', error: null }
  } catch (error) {
    console.error('獲取會員資訊請求失敗:', error)
    return {
      data: null,
      status: 'error',
      error: error.message || '獲取會員資訊請求失敗',
    }
  }
}

// ■■■ 講師資訊 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// {
//   "status": "success",
//   "msg": "查詢資料成功",
//   "lecturer": {
//       "lecturer_id": 1,
//       "exclusive_code": "A7k8c6WmJb",
//       "lecturer_name": "徐上閔",
//       "lecturer_img": "https://random....",
//       "lecturer_expertise": "義式咖啡、拉花",
//       "lecturer_honor": "SCA 義式咖...",
//       "lecturer_experience": "2018 年 WCE 世界..."
//   }
// }
export const getLecturerInfo = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const response = await fetch(`${BASE_URL}/api/member/lecturer-info`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    // console.log(data);
    if (!response.ok) {
      return {
        data: null,
        status: 'error',
        error: data.message || '獲取資訊時網路回應不佳',
      }
    }
    return { data, status: 'success', error: null }
  } catch (error) {
    console.error('獲取會員資訊請求失敗:', error)
    return {
      data: null,
      status: 'error',
      error: error.message || '獲取會員資訊請求失敗',
    }
  }
}

// ■■■ 修改講師資料用 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export const updateLecturerInfo = async (exclusiveCode = 0, formData) => {
  const token = localStorage.getItem('accessToken')
  try {
    const response = await fetch(
      `${BASE_URL}/api/member/${exclusiveCode}/lecturer-info-revise`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    )
    console.log(formData)
    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    console.error('修改會員資料請求失敗:', error)
    return { data: null, error: error.message || '修改會員資料請求失敗' }
  }
}

// ■■■ 講師課程資訊 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export const geLecturerInfoClasses = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const response = await fetch(`${BASE_URL}/api/member/lecturer-info-class`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (!response.ok) {
      return {
        data: null,
        status: 'error',
        error: data.message || '獲取資訊時網路回應不佳',
      }
    }
    return { data, status: 'success', error: null }
  } catch (error) {
    console.error('獲取會員資訊請求失敗:', error)
    return {
      data: null,
      status: 'error',
      error: error.message || '獲取會員資訊請求失敗',
    }
  }
}

// ■■■ 解析accessToken用的函式 ■■■■■■■■■■■■■■■■■■■■
export const parseJwt = (token) => {
  const base64Payload = token.split('.')[1]
  const payload = Buffer.from(base64Payload, 'base64')
  return JSON.parse(payload.toString())
}
