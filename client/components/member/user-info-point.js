import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import styles from './member.module.scss'
import { getUserInfoPoint } from '@/services/user.js'

export default function UserInfoPoint() {
  const { auth } = useAuth()
  const [userPointRecords, setUserPointRecords] = useState([])
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.isAuth) return
      try {
        const res = await getUserInfoPoint()
        console.log(res);
        if (res.status !== 'success') {
          console.log('載入用戶資料失敗')
          return
        }
        const processedData = processUserData(res.data.user)
        setUserPointRecords(processedData)
        setHasProfile(true)
        console.log('用戶資料載入成功')
      } catch (error) {
        console.error('載入使用者資料失敗：', error)
      }
    }
    fetchUserData()
  }, [auth.isAuth])

  function processUserData(data) {
    let accumulatedPoints = 0
    const processedData = []
    for (let i = data.length - 1; i >= 0; i--) {
      const record = data[i]
      accumulatedPoints += record.points_change
      processedData.unshift({
        ...record,
        remainingPoints: accumulatedPoints,
      })
    }
    return processedData
  }
  return (
    <div className={`${styles['content']} container`}>
      <div className={`${styles['main-title']}`}>點數紀錄</div>
      <table className={`${styles['point-table']} `}>
        <thead>
          <tr>
            <th className={`${styles['point-th']} col-3`}>發生日期</th>
            <th className={`${styles['point-th']} col-3`}>項目</th>
            <th className={`${styles['point-th']} col-3`}>異動</th>
            <th className={`${styles['point-th']} col-3`}>剩餘點數</th>
          </tr>
        </thead>
        <tbody>
          {userPointRecords.map((record, index) => (
            <tr key={index}>
              <td className={`${styles['point-td']}`}>
                {record.formatted_points_created_at}
              </td>
              <td className={`${styles['point-td']}`}>{record.points_text}</td>
              <td
                className={`${
                  record.points_change < 0 ? styles['negative'] : ''
                } ${styles['point-td']}`}
              >
                {record.points_change}
              </td>
              <td className={`${styles['point-td']}`}>
                {record.remainingPoints}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
