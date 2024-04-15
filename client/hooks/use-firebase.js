// 引入 Firebase 應用的初始化模塊
import { initializeApp } from 'firebase/app'
// 引入 Firebase 身份認證相關功能
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from 'firebase/auth'
import { useEffect } from 'react'

// Firebase 配置信息，通常包含 apiKey、authDomain 等信息
import { firebaseConfig } from './firebase-config'
/**
 * 初始化應用程序，設定 UI 事件監聽和註冊 Firebase 身份驗證監聽器：
 * - onAuthStateChanged: 當用戶登入或登出時會調用此監聽器，這是我們更新 UI 的地方。
 * - getRedirectResult: 當用戶從身份驗證重定向流返回時，此 Promise 完成。你可以在這裡從身份提供商(IDP)獲取 OAuth 存取令牌。
 */
// 重定向專用，用於在同頁面(firebase 的登入頁與回調頁是同一頁)監聽登入狀態
// getRedirectResult 用於處理重定向回調頁面的情況（注意：只有重定向回來後才會調用）
// onAuthStateChanged 用於監聽 auth 物件的變化（使用這個就足夠，它會在頁面啟動時偵測目前登入狀態）
const initApp = (callback) => {
  const auth = getAuth()

  // 處理來自重定向身份驗證流的結果。
  getRedirectResult(auth)
    .then((result) => {
      if (result) {
        // 從 Google 提供者結果中獲得 Google 存取令牌。您可以使用它來存取 Google API。
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential.accessToken

        // 獲得已登入的用戶資訊。
        const user = result.user
        console.log(token)
        console.log(user)
      }
    })
    .catch((error) => {
      // 處理錯誤情況。
      console.error(error)
    })

  // 監聽身份驗證狀態的變更。
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // 用戶已登入，輸出用戶資訊。
      // console.log('user', user)
      // 回調用戶數據。
      callback(user.providerData[0])
    }
  })
}

// TODO: 目前不需要從 Firebase 登出，因為 Firebase 登出不會同時登出 Google。
const logoutFirebase = () => {
  const auth = getAuth()

  signOut(auth)
    .then(() => {
      // 登出成功。
      console.log('登出成功。')
      // 如果需要，可以將頁面重新導向至 Google 登出頁面。
    })
    .catch((error) => {
      // 處理錯誤情況。
      console.log(error)
    })
}

// 使用 Google 進行登入，透過彈出式視窗。
const loginGoogle = async (callback) => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()

  signInWithPopup(auth, provider)
    .then(async (result) => {
      // 登入成功，獲得用戶資訊。
      const user = result.user
      console.log(user)

      // 將用戶數據寫入後端資料庫等操作。
      callback(user.providerData[0])
    })
    .catch((error) => {
      // 處理錯誤情況。
      console.log(error)
    })
}

// 使用 Google 登入，重定向方式。
const loginGoogleRedirect = async (callback) => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()

  // 重定向至 Google 身份驗證。
  signInWithRedirect(auth, provider)
}

const loginFBRedirect = () => {
  const provider = new FacebookAuthProvider()
  const auth = getAuth()

  signInWithRedirect(auth, provider)
}

// 使用 Firebase 的自訂鉤子。
export default function useFirebase() {
  useEffect(() => {
    // 初始化 Firebase 應用。
    initializeApp(firebaseConfig)
  }, [])

  return {
    loginFBRedirect,
    initApp,
    loginGoogleRedirect,
    loginGoogle,
    logoutFirebase,
  }
}
