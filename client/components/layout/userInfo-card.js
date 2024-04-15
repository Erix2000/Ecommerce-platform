import React, { useState, useEffect } from 'react'
import styles from '@/styles/UserInfoCard.module.scss'
import { logout,getUserInfo } from '@/services/user.js'
import useFirebase from '@/hooks/use-firebase'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
const UserInfoCard = ({ isVisible }) => {
  const { auth } = useAuth()
  const { logoutFirebase } = useFirebase()
  const handleLogout = async (e) => {
    e.preventDefault()
    logoutFirebase()
    const res = await logout()
    // console.log(res)
    if (res.data.status === 'success') {
      console.log('登出成功:', res.data)
      window.location.href = '/member/login'
    } else {
      console.error('登出失敗:', res.error)
    }
  }
  const [userInfo, setUserInfo] = useState({ user_name: '', points_total: '' })
  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.isAuth) return

      try {
        const res = await getUserInfo()
        // console.log(res.data.user)
        if (res.status !== 'success') {
          console.log('載入用戶資料失敗')
          return
        }
        const user = res.data.user
        setUserInfo(user)

        console.log('用戶資料載入成功')
      } catch (error) {
        console.error('載入使用者資料失敗：', error)
      }
    }
    fetchUserData()
  }, [auth])
  // console.log(userInfo)
  return (
    <div
      className={`${styles.userInfoCard} ${isVisible ? styles.show : ''}`}
      //   onMouseLeave={toggleVisibility}
    >
      {auth.isAuth ? (
        <>
          <header className={styles.cardHeader}>
            <p className={styles.userEmail}>{userInfo.user_email}</p>
          </header>
          <div className={styles.cardBody}>
            <p className={styles.userName}>{userInfo.user_name}，你好!</p>
            <Link href="/member/user-info-point" className={styles.userPoints}>
              <i className="bi bi-currency-exchange">&thinsp;</i>
              {userInfo.points_total || '您尚未獲取點數'}
            </Link>
          </div>
          <div className={styles.buttonGroup}>
            <Link href="/member/user-info" className={styles.manageButton}>
              管理帳號
            </Link>
            <button
              className={styles.logoutButton}
              onClick={(e) => {
                handleLogout(e)
                localStorage.removeItem('info')
              }}
            >
              <i className="bi bi-box-arrow-right"></i>&thinsp; 登出
            </button>
          </div>
          <footer className={styles.cardFooter}>
            <button type="button" className={styles.notion}>
              隱私權政策
            </button>
            ．
            <button type="button" className={styles.notion}>
              隱私權政策
            </button>
          </footer>
        </>
      ) : (
        <div className={styles.loginPrompt}>
          <p>請先登入</p>
          <Link href="/member/login">
            <button className={styles.loginButton}>登入</button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default UserInfoCard
