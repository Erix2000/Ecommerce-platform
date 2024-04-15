import React, { useState, useContext, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { checkAuth } from '@/services/user.js'

const LecturerContext = createContext(null)

// 定義初始用戶數據結構
export const initLecturerData = {
  exclusive_code: '',
  user_valid: 1,
}

export const LecturerProvider = ({ children }) => {
  const [lecturer, setLecturer] = useState({
    isLecturer: false,
    userData: initLecturerData,
  })

  const router = useRouter()

  const lecturerRoute = '/member/i-want-lecturer'

  const protectedRoutes = [
    '/member/lecturer-info',
    '/member/lecturer-info-revise',
    '/member/lecturer-info-class',
  ]

  // 檢查會員認證用

  const handleCheckLecturer = async () => {
    const res = await checkAuth()
    if (res.status === 'success') {
      const dbUser = res.data.user
      const userData = { ...initLecturerData }
      let isValidLecturer = true
      for (const key in userData) {
        if (Object.hasOwn(dbUser, key)) {
          userData[key] = dbUser[key] || ''
        }
      }
      if (!userData.exclusive_code || userData.user_valid !== 2) {
        isValidLecturer = false
      }
      setLecturer({ isLecturer: isValidLecturer, userData })
      if (!isValidLecturer && protectedRoutes.includes(router.pathname)) {
        router.push(lecturerRoute)
      }
    } else {
      if (protectedRoutes.includes(router.pathname)) {
        router.push(lecturerRoute)
      }
    }
  }

  useEffect(() => {
    if (router.isReady && !lecturer.isLecturer) {
      handleCheckLecturer()
    }
  }, [router.isReady, router.pathname])
  return (
    <LecturerContext.Provider
      value={{
        lecturer,
        setLecturer,
      }}
    >
      {children}
    </LecturerContext.Provider>
  )
}

export const useLecturer = () => useContext(LecturerContext)
