import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import styles from './member.module.scss'
import Link from 'next/link'
import { checkAuth, getLecturerInfo } from '@/services/user.js'

const initLecturerInfo = {
  lecturer_name: '',
  lecturer_img: '',
  lecturer_expertise: '',
  lecturer_honor: '',
  lecturer_experience: '',
}
export default function LecturerInfo() {
  const { auth } = useAuth()
  const [lecturerInfo, setLecturerInfo] = useState(initLecturerInfo)
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.isAuth) return

      try {
        const res = await getLecturerInfo()
        if (res.data.status !== 'success') {
          console.log('載入用戶資料失敗')
          return
        }
        setLecturerInfo(res.data.lecturer)
        setHasProfile(true)
        console.log('用戶資料載入成功')
      } catch (error) {
        console.error('載入使用者資料失敗：', error)
      }
    }

    fetchUserData()
  }, [auth])

  function createDivs(string, className) {
    if (!string) return null
    return string.split('、').map((item, index) => (
      <div
        key={index}
        className={`d-flex flex-column flex-grow-1 ${className}`}
      >
        {item}
      </div>
    ))
  }

  return (
    <div className={`${styles['content']} container`}>
      <div className={`${styles['main-title']}`}>
        講師資料
        <Link href="/member/lecturer-info-revise">
          <i className="bi bi-pencil-square ms-3"></i>
        </Link>
      </div>
      <div
        className={`${styles['main-content']} d-md-flex flex-column flex-md-row align-items-center`}
      >
        <div className={`col-12 col-md-8 order-2 order-md-1`}>
          <div className={`${styles['tabbar']} pb-3`}>
            <div
              className={`${styles['label-name']} ${styles['label-name-lecturer']}`}
            >
              姓名
            </div>
            <div className={`${styles['form-view']}`}>
              {lecturerInfo.lecturer_name || '尚未填寫'}
            </div>
          </div>

          <div className={`${styles['tabbar']} pb-3`}>
            <div
              className={`${styles['label-name']} ${styles['label-name-lecturer']}`}
            >
              專業領域
            </div>
            <div className={`${styles['form-view']}`}>
              {lecturerInfo.lecturer_expertise || '尚未填寫'}
            </div>
          </div>

          <div
            className={`pb-3 ${styles['tabbar']} ${styles['tabbar-textarea']} `}
          >
            <div className={`${styles['label-name']}`}>專業證照</div>
            <div className={` d-flex flex-column flex-grow-1`}>
              {createDivs(lecturerInfo.lecturer_honor, styles['form-view'])}
            </div>
          </div>

          <div
            className={`pb-3 ${styles['tabbar']} ${styles['tabbar-textarea']} `}
          >
            <div className={`${styles['label-name']}`}>比賽經歷</div>
            <div className={` d-flex flex-column flex-grow-1  ${styles['label-info-lecturer']}`}>
              {createDivs(
                lecturerInfo.lecturer_experience,
                styles['form-view']
              )}
            </div>
          </div>
        </div>
        <div className={`${styles['user-icon']} col-2 order-1 order-md-2 `}>
          {lecturerInfo.lecturer_img ? (
            <img
              className={`${styles['icon-img']}`}
              src={`http://localhost:3005/lecturer/${lecturerInfo.lecturer_img}`}
              alt="Points Total"
            />
          ) : (
            <div className={`${styles['icon-p']}`}>
              <span>尚未選擇大頭貼</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
