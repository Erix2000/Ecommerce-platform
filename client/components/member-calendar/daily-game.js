import React, { useState, useEffect } from 'react'
import styles from '@/components/member-calendar/daily-game.module.scss'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'
import { Modal, Button } from 'react-bootstrap'

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
// 將 formatDateToYYYYMMDD 函數添加到這裡
function formatDateToYYYYMMDD(date) {
  return date
    .toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Taipei',
    })
    .replace(/\//g, '-')
}

export default function CalendarGame() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [signedDates, setSignedDates] = useState(new Set())
  const [signedCount, setSignedCount] = useState(0)
  const [isTodaySigned, setIsTodaySigned] = useState(false)
  const { auth } = useAuth()
  //  彈出視窗
  const [showModal, setShowModal] = useState(false)
  const [pointsEarned, setPointsEarned] = useState(0)
  const router = useRouter()
  const handleCloseModal = () => setShowModal(false)

  // 從 localStorage 恢復已簽到的日期和次數
  useEffect(() => {
    // 1. 從本地存儲獲取簽到數據
    const savedSignedDates = JSON.parse(
      localStorage.getItem('signedDates') || '[]'
    )
    const savedSignedCount =
      parseInt(localStorage.getItem('signedCount'), 10) || 0

    // 2. 格式化日期，確保時區一致
    const signedDatesSet = new Set(
      savedSignedDates.map((dateStr) => formatDateToYYYYMMDD(new Date(dateStr)))
    )

    // 3. 設置狀態
    setSignedDates(signedDatesSet)
    setSignedCount(savedSignedCount)
  }, [])

  // 更新 localStorage
  useEffect(() => {
    localStorage.setItem('signedDates', JSON.stringify(Array.from(signedDates)))
    localStorage.setItem('signedCount', signedCount.toString())
  }, [signedDates, signedCount])

  // 從後端獲取簽到日期
  useEffect(() => {
    if (auth.userData) {
      fetch(
        `http://localhost:3005/member/game/signed-dates?user_id=${auth.userData.user_id}`
      )
        .then((response) => response.json())
        .then((data) => {
          const signedDatesSet = new Set(data.map((date) => date.split('T')[0]))
          setSignedDates(signedDatesSet) // 更新簽到日期的狀態
          const thisMonth = `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1
          ).padStart(2, '0')}`
          // 這裡應該使用 formatDateToYYYYMMDD 來確保時區一致性
          const count = Array.from(signedDatesSet).filter((date) => {
            const formattedDate = formatDateToYYYYMMDD(new Date(date))
            return formattedDate.startsWith(thisMonth)
          }).length
          setSignedCount(count) // 更新簽到次數
        })
        .catch((error) => console.error('Error fetching signed dates:', error))
    }
  }, [auth.userData, currentDate])

  // 檢查今天是否已簽到
  useEffect(() => {
    const todayString = formatDateToYYYYMMDD(new Date())
    setIsTodaySigned(signedDates.has(todayString))
  }, [signedDates])

  // 更新 currentDate 每分鐘
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])
  //
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const emptyDays = Array.from({ length: firstDayOfMonth }, () => null)
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const handleSignClick = () => {
    const todayString = formatDateToYYYYMMDD(new Date()) // 使用函數格式化今天日期
    if (!signedDates.has(todayString)) {
      fetch('http://localhost:3005/member/game/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: auth.userData.uuid,
          signInDate: todayString,
          points: 1, // 假設每次簽到基礎點數為1
          pointsText: '簽到贈點',
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.json()
        })
        .then((data) => {
          console.log('Success:', data)
          // 在確認服務器端簽到成功後，更新前端狀態和本地存儲
          const newSignedDates = new Set(signedDates).add(todayString)
          setSignedDates(newSignedDates)
          setIsTodaySigned(true)
          const newSignedCount = signedCount + 1
          setSignedCount(newSignedCount)

          // 從服務器響應中獲取簽到獲得的點數，並顯示 Modal
          const points = data.points // 假設 data 中包含簽到獲得的點數
          setPointsEarned(points) // 更新 pointsEarned 狀態
          setShowModal(true) // 顯示 Modal

          localStorage.setItem(
            'signedDates',
            JSON.stringify(Array.from(newSignedDates))
          )
          localStorage.setItem('signedCount', newSignedCount.toString())
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  }

  return (
    <>
      {/* 簽到遊戲標題 */}
      <div className={`${styles['calendar-title']}`}>每日簽到</div>
      <div className={`container`}>
        {/* 簽到遊戲區開始 */}
        <div className={`row`}>
          {/* 月曆開始 */}
          <div className={`col-12 col-md-6`}>
            <div
              className={`${styles['calendar-container']} ${styles['calendar-div']}`}
            >
              <div className={`${styles['calendar']}`}>
                <div className={`${styles['cal-header']}`}>
                  <div className={`${styles['month']}`}>
                    {monthNames[currentMonth]}
                  </div>
                  <div className={`${styles['year']}`}>{currentYear}</div>
                </div>
                <div className={`${styles['weekdays']}`}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    (day, index) => (
                      <div key={index} className={`${styles['weekday']}`}>
                        {day}
                      </div>
                    )
                  )}
                </div>
                <div className={`${styles['days']}`}>
                  {emptyDays.map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className={`${styles['day']}`}
                    ></div>
                  ))}

                  {monthDays.map((day) => {
                    const todayString = formatDateToYYYYMMDD(new Date()) // 格式化今天的日期
                    const fullDate = `${currentYear}-${String(
                      currentMonth + 1
                    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const isToday = fullDate === todayString // 檢查是否是今天
                    return (
                      <div
                        key={day}
                        className={`${styles['day']} ${
                          signedDates.has(fullDate) ? styles['signed'] : ''
                        } ${isToday ? styles['today'] : ''}`}
                      >
                        {day}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className={`d-flex justify-content-center`}>
              <button
                className={`${styles['sign-btn']} ${
                  isTodaySigned ? styles['signed'] : ''
                }`}
                onClick={!isTodaySigned ? handleSignClick : undefined}
                disabled={isTodaySigned}
              >
                {isTodaySigned ? '已簽到' : '簽到'}
              </button>
            </div>
          </div>
          {/* 月曆結束 */}
          {/* 活動說明文字開始 */}

          <div className={`col-12 col-md-6`}>
            <div className={`${styles['activity']}`}>
              <p className={`${styles['med-size']}`}>
                本月已簽到累積
                <strong className={`${styles['skin-big-size']}`}>
                  {signedCount}
                </strong>
                天
              </p>
              <br />
              <p className={`${styles['med-size']}`}>活動說明：</p>
              <p>每日簽到成功，贈送1點</p>
              <p>簽到累積8次，再加贈2點</p>
              <p>簽到累積15次，再加贈5點</p>
              <p>簽到累積22次，再加贈10點</p>
              <br />
              <p className={`${styles['med-size']}`}>注意事項：</p>
              <p>每日限簽到1次。</p>
              <p>簽到計算方式：採每月每會員於該月總累積次數計算。</p>
              <p>每月每會員所累積總次數，會於次月1日重新計算。</p>
              <p>豆豆先生保有解釋、調整活動辦法、終止活動之權利。</p>
            </div>
            {/* 活動說明文字結束 */}
          </div>
        </div>

        {/* 簽到按鈕 */}
        {/* 簽到遊戲結束 */}
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className={`${styles['modal-head']}`}>
          <Modal.Title className={`${styles['modal-title']}`}>
            簽到成功！
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${styles['modal-body']}`}>
          恭喜獲得{pointsEarned}點
        </Modal.Body>
        <Modal.Footer className={`${styles['modal-footer']}`}>
          <Button
            className={`${styles['modal-pointBtn']}`}
            onClick={() => {
              router.push(`/member/user-info-point`)
            }}
          >
            查看點數紀錄
          </Button>
          <Button
            className={`${styles['modal-shopBtn']}`}
            onClick={() => {
              router.push('/product/00')
            }}
          >
            繼續購物
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
