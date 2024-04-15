import React, { useState, useContext, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { checkAuth } from '@/services/user.js'

const AuthContext = createContext(null)

export const initUserData = {
  user_id: 0,
  uuid: 0,
  user_name: '',
  user_email: '',
  google_id: '',
  line_id: '',
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuth: false,
    userData: initUserData,
  })

  const router = useRouter()

  // 登入頁路由
  const loginRoute = '/member/login'
  // 隱私頁面路由，未登入時會檢查後跳轉至登入頁
  const protectedRoutes = [
    '/member/user-info-revise',
    '/member/user-info-point',
    '/member/user-info-confirm',
    '/member/user-info',
    '/member/lecturer-info',
    '/member/lecturer-info-revise',
    '/member/lecturer-info-class',
    '/member/i-want-lecturer',
    '/member/edit-password',
    '/member/coupon',
    '/member/order',
    '/member/order/[oid]',
    '/member/course',
    '/member/favorite',
    '/member/comment',
    '/member/daily-game',
    '/cart',
    '/cart/confirm',
    '/cart/confirm/success',
  ]

  // 檢查會員認證用
  const handleCheckAuth = async () => {
    // 定義異步函數檢查認證狀態
    const res = await checkAuth() // 調用 checkAuth 函數
    // 伺服器 API 成功的回應為 { status: 'success', data: { user } }
    if (res.status === 'success') {
      // 如果認證成功
      // 只需要 initUserData 的定義屬性值
      const dbUser = res.data.user // 從回應中獲取用戶數據
      // console.log(dbUser)
      const userData = { ...initUserData } // 創建一個新的 userData 對象

      for (const key in userData) {
        // 遍歷 initUserData 中的所有鍵
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn
        if (Object.hasOwn(dbUser, key)) {
          // 如果 dbUser 中有對應的鍵，則將值賦予 userData
          userData[key] = dbUser[key] || ''
        }
      }
      setAuth({ isAuth: true, userData }) // 更新認證狀態和用戶數據
    } else {
      // 如果是隱私頁面，並且用戶沒有登入則跳轉致登入頁
      if (protectedRoutes.includes(router.pathname)) {
        router.push(loginRoute)
      }
    }
  }

  useEffect(() => {
    if (router.isReady && !auth.isAuth) {
      handleCheckAuth()
    }
  }, [router.isReady, router.pathname])
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
