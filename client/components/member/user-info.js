import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import styles from './member.module.scss'
import Link from 'next/link'
import { getUserInfo } from '@/services/user.js'

const initUserInfo = {
  user_name: '',
  user_email: '',
  user_sex: '',
  user_birth: '',
  user_tel: '',
  mailing_address: '',
  delivery_address: '',
  points_total: '',
}

export default function UserInfo() {
  const { auth } = useAuth()
  const [userInfo, setUserInfo] = useState(initUserInfo)
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.isAuth) return

      try {
        const res = await getUserInfo()
        if (res.status !== 'success') {
          console.log('載入用戶資料失敗')
          return
        }
        setUserInfo(res.data.user)
        setHasProfile(true)
        console.log('用戶資料載入成功')
      } catch (error) {
        console.error('載入使用者資料失敗：', error)
      }
    }

    fetchUserData()
  }, [auth.isAuth])
  console.log(userInfo.user_img)
  return (
    <div className={`${styles['content']} container`}>
      {hasProfile ? (
        <>
          <div className={`${styles['main-title']}`}>
            會員資料
            <Link href="/member/user-info-revise">
              <i className="bi bi-pencil-square ms-3"></i>
            </Link>
          </div>

          <div
            className={`${styles['main-content']} d-md-flex flex-column flex-md-row align-items-center`}
          >
            <div className={`col-12 col-md-8 order-2 order-md-1`}>
              <div className={`${styles['tabbar']} mb-4`}>
                <div className={`${styles['label-name']}`}>姓名</div>
                <div className={`${styles['form-view']}`}>
                  {userInfo.user_name || '尚未填寫'}
                </div>
              </div>
              <div className={`${styles['tabbar']} mb-4`}>
                <div className={`${styles['label-name']}`}>電子信箱</div>
                <div className={`${styles['form-view']}`}>
                  {userInfo.user_email || '尚未填寫'}
                </div>
              </div>
              <div className={`${styles['tabbar']} mb-4`}>
                <div className={`${styles['label-name']}`}>密碼</div>
                <div className={`${styles['form-view']}`}>
                  <Link href="/member/edit-password">
                    修改密碼 <i className="bi bi-pencil-square"></i>
                  </Link>
                </div>
              </div>
              <div className={`${styles['tabbar']} mb-4`}>
                <div className={`${styles['label-name']}`}>生理性別</div>
                <div className={`${styles['form-view']}`}>
                  {userInfo.user_sex || '尚未填寫'}
                </div>
              </div>
              <div className={`${styles['tabbar']} mb-4`}>
                <div className={`${styles['label-name']}`}>生日</div>
                <div className={`${styles['form-view']}`}>
                  {userInfo.user_birth || '尚未填寫'}
                </div>
              </div>
              <div className={`${styles['tabbar']} mb-4`}>
                <div className={`${styles['label-name']}`}>連絡電話</div>
                <div className={`${styles['form-view']}`}>
                  {userInfo.user_tel || '尚未填寫'}
                </div>
              </div>
              <div className={`${styles['tabbar']} mb-4`}>
                <div className={`${styles['label-name']}`}>通訊地址</div>
                <div className={`${styles['form-view']}`}>
                  {userInfo.mailing_address || '尚未填寫'}
                </div>
              </div>
              <div className={`${styles['tabbar']} mb-4`}>
                <div className={`${styles['label-name']}`}>寄送地址</div>
                <div className={`${styles['form-view']}`}>
                  {userInfo.delivery_address || '尚未填寫'}
                </div>
              </div>
              <div className={`${styles['tabbar']} mb-4`}>
                <div className={`${styles['label-name']}`}>會員點數</div>
                <div className={`${styles['form-view']}`}>
                  {userInfo.points_total || '尚未獲取點數'}{' '}
                  <Link href="/member/user-info-point">查看紀錄</Link>
                </div>
              </div>
            </div>
            <div
              className={`${styles['user-icon']} col-2 order-1 order-md-2 d-none d-md-block`}
            >
              {userInfo.user_img ? (
                <img
                  className={`${styles['icon-img']}`}
                  src={`/avatar/${userInfo.user_img}`}
                  alt="Points Total"
                />
              ) : (
                <div className={`${styles['icon-p']}`}>
                  <span>尚未選擇大頭貼</span>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div>用戶資料加載中...</div>
      )}
    </div>
  )
}
