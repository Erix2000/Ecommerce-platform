import { useEffect, useRef } from 'react'

// 來源: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// 在 React 函數組件中使用 setInterval
export default function useInterval(callback, delay) {
  const savedCallback = useRef() // 用來儲存最新的回調函數

  // 在組件渲染後，將傳入的 callback 函數儲存到 useRef 創建的對象中
  // 這樣可以保證時鐘 tick 時，總是調用最新的 callback 函數
  useEffect(() => {
    savedCallback.current = callback
  })

  // 這個 useEffect 負責設定和清除定時器
  useEffect(() => {
    function tick() {
      savedCallback.current() // 執行儲存的回調函數
    }

    if (delay !== null) {
      // 如果 delay 不為 null，則設置定時器
      let id = setInterval(tick, delay)
      // 返回一個清除函數，用於組件卸載時清除定時器，避免內存洩漏
      return () => clearInterval(id)
    }
  }, [delay]) // 當 delay 變化時，重新設置定時器
}
