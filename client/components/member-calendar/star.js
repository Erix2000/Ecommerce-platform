import { useState, useEffect } from 'react'
// 導入`.module.css`檔案
import styles from './star.module.scss'

export default function Star({
  starCount = 5, // 有幾個星星圖示，可以評分的最大值
  initRating = 0, // 初始的評分
  onRatingChange, //當評分有改變時，呼叫的函式
  color = '#bc955c',
  icon = <i className={`bi bi-star-fill`} />,
}) {
  // 滑鼠點按時的評分，一開始是0代表沒有評分
  const [rating, setRating] = useState(initRating)
  // 滑鼠游標懸停(hover)評分，一開始是0代表沒有懸停
  // 懸停(hover)需要兩個事件配合：onMouseEnter + onMouseLeave
  const [hoverRating, setHoverRating] = useState(0)

  // 當initRating改變時更新rating狀態
  useEffect(() => {
    setRating(initRating)
  }, [initRating])

  return (
    <>
      <div>
        {/* 產生5個成員都是1的陣列，表達式語法 */}
        {Array(starCount)
          .fill(1)
          .map((v, i) => {
            // 每個星星的分數，剛好是索引值+1
            const score = i + 1

            return (
              <button
                type="button" // 添加這行來防止提交表單
                key={i}
                filled={i < rating} // 這裡使用 rating prop 來決定是否填充星星
                className={styles['star-btn']}
                // 滑鼠移入星星區域時，設定hoverRating為目前的分數
                onMouseEnter={() => {
                  setHoverRating(score)
                }}
                // 滑鼠離開星星區域時，設定hoverRating為0
                onMouseLeave={() => {
                  setHoverRating(0)
                }}
                onClick={() => {
                  // 點按後設定分數
                  setRating(score)
                  // 設定評分給父母元件
                  onRatingChange(score)
                }}
              >
                <div // 判斷分數(score)如果小於等於目前的評分(rating)狀態，
                  // 或小於等於目前的懸停評分(hoverRating)狀態，則套用亮起樣式
                  // 利用style屬性
                  style={{
                    color:
                      score <= Math.max(hoverRating, rating)
                        ? color
                        : '#d9d9d9',
                  }}
                >
                  {icon}
                </div>
              </button>
            )
          })}
      </div>
    </>
  )
}
