import React, { useState, useEffect } from 'react'
import styles from './member.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import LogoIndigo from '@/assets/img/logo/logo-indigo-upright.svg'
import LineLogo from '@/assets/img/login/line.svg'
import GoogleLogo from '@/assets/img/login/google.svg'
import validator from 'validator'
import {
  login,
  googleLogin,
  getUserInfo,
  lineLoginRequest,
  lineLoginCallback,
} from '@/services/user.js'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import useFirebase from '@/hooks/use-firebase'
import { initUserData, useAuth } from '@/hooks/use-auth'

export default function Login() {
  const loginData = {
    user_email: '',
    password: '',
  }
  const [user, setUser] = useState(loginData)
  const [errors, setErrors] = useState(loginData)
  const [show, setShow] = useState({
    password: false,
  })
  const { auth, setAuth } = useAuth()
  const router = useRouter()
  const { loginGoogleRedirect, initApp } = useFirebase()

  const callbackLineLogin = async (query) => {
    const res = await lineLoginCallback(query)
    if (res.data.status === 'success') {
      localStorage.setItem('accessToken', res.data.data.accessToken)
      const res1 = await getUserInfo()
      if (res1.data.status === 'success') {
        const dbUser = res1.data.user

        const userData = { ...initUserData }

        for (const key in userData) {
          if (Object.hasOwn(dbUser, key)) {
            userData[key] = dbUser[key] || ''
          }
        }
        setAuth({
          isAuth: true,
          userData,
        })

        Swal.fire({
          icon: 'success',
          color: '#003e52',
          title: '已成功登入',
          text: '已成功登入',
          buttonsStyling: true,
          confirmButtonColor: '#003e52',
          confirmButtonText: '我已了解',
        })
      } else {
        console.log('登入後無法得到會員資料')
      }
    } else {
      console.log(`已是登入狀態或登入失敗`)
    }
  }

  const goLineLogin = async () => {
    if (auth.isAuth) return
    try {
      const res = await lineLoginRequest()
      console.log(res)
    } catch {
      console.error('Error while fetching Line login URL:')
    }
  }

  useEffect(() => {
    if (router.isReady) {
      if (!router.query.code) return
      callbackLineLogin(router.query)
    }
  }, [router.isReady, router.query])
  // TODO-----------------------------------------------------

  useEffect(() => {
    initApp(callbackGoogleLoginRedirect)
  }, [])

  // 處理google登入後，要向伺服器進行登入動作
  const callbackGoogleLoginRedirect = async (providerData) => {
    if (auth.isAuth) return
    const res = await googleLogin(providerData)
    localStorage.setItem('accessToken', res.data.accessToken)
    if (res.data.status === 'success') {
      const res1 = await getUserInfo(res.data.accessToken)
      if (res1.data.status === 'success') {
        const dbUser = res1.data.user
        const userData = { ...initUserData }
        for (const key in userData) {
          if (Object.hasOwn(dbUser, key)) {
            userData[key] = dbUser[key] || ''
          }
        }
        setAuth({
          isAuth: true,
          userData,
        })
        Swal.fire({
          icon: 'success',
          color: '#003e52',
          title: '已成功登入',
          text: '已成功登入',
          buttonsStyling: true,
          confirmButtonColor: '#003e52',
          confirmButtonText: '我已了解',
        })
      } else {
        Swal.fire({
          icon: 'error',
          color: '#8a0000',
          title: '錯誤訊息',
          text: '登入後無法得到會員資料',
          buttonsStyling: true,
          confirmButtonColor: '#003e52',
          confirmButtonText: '我已了解',
        })
      }
    } else {
      Swal.fire({
        icon: 'error',

        color: '#8a0000',
        title: '錯誤訊息',
        text: '登入失敗',
        buttonsStyling: true,
        confirmButtonColor: '#003e52',
        confirmButtonText: '我已了解',
      })
    }
  }

  useEffect(() => {
    if (auth.isAuth) {
      router.push('/member/user-info')
    }
  }, [auth.isAuth, router])

  const showPassword = (fieldName) => {
    setShow((prevShow) => ({
      ...prevShow,
      [fieldName]: !prevShow[fieldName],
    }))
  }

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setUser((prevPassword) => ({
      ...prevPassword,
      [name]: value,
    }))

    const updatedUser = { ...user, [name]: value }
    const newErrors = validateFields(updatedUser, errors, name)
    setErrors(newErrors)
  }

  const validateFields = (user, errors, fieldname = '') => {
    const newErrors = {}
    Object.keys(errors).forEach((prop) => (newErrors[prop] = ''))

    if (validator.isEmpty(user.user_email, { ignore_whitespace: true })) {
      newErrors.user_email ||= '電子郵件為必填欄位'
    }

    if (!validator.isEmail(user.user_email)) {
      newErrors.user_email ||= '電子郵件格式不正確'
    }

    if (validator.isEmpty(user.password, { ignore_whitespace: true })) {
      newErrors.password ||= '密碼為必填欄位'
    }

    if (
      !validator.isStrongPassword(user.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
      })
    ) {
      newErrors.password ||=
        '密碼至少8個至多12個字元，而且至少需包含一個英文小寫字元'
    }

    if (user.password.length > 12) {
      newErrors.password ||= '密碼至多12個字元'
    }

    return fieldname
      ? { ...errors, [fieldname]: newErrors[fieldname] }
      : newErrors
  }

  const handleBlur = (e) => {
    const newErrors = validateFields(user, errors, e.target.name)
    setErrors(newErrors)
  }

  const hasError = (errors, fieldname) => {
    return !!errors[fieldname]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const inputs = e.target.elements
    const newErrors = validateFields(user, errors)
    setErrors(newErrors)

    for (let i = 0; i < inputs.length; i++) {
      if (
        inputs[i].nodeName === 'INPUT' &&
        hasError(newErrors, inputs[i].name)
      ) {
        inputs[i].focus()
        return
      }
    }

    const res = await login(user)
    if (res.data.status === 'error') {
      setErrors({
        ...newErrors,
        form: res.data.message || '出現未知錯誤',
      })
      Swal.fire({
        icon: 'error',
        title: '登入失敗',
        text: res.data.message,
        confirmButtonColor: '#003e52',
        confirmButtonText: '我已了解',
      })
    } else if (res.data.status === 'success' && res.data.accessToken) {
      localStorage.setItem('accessToken', res.data.accessToken)
      Swal.close()
      window.location.href = '/member/user-info'
      Swal.fire({
        title: '<h1>登入成功</h1>',
        background: '#003e52',
        color: '#ffffff',
        didOpen: () => {
          Swal.showLoading()
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          window.location.href = '/member/user-info'
        }
      })
    } else {
      Swal.fire({
        icon: 'error',
        color: '#8a0000',
        title: '錯誤訊息',
        text: '出現未知錯誤，請稍後在試',
        buttonsStyling: true,
        confirmButtonColor: '#003e52',
        confirmButtonText: '我已了解',
      })
    }
  }

  // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  const [isClicked, setIsClicked] = useState(false)
  const handleClick = () => {
    setIsClicked(!isClicked)
    if (!isClicked) {
      setUser({
        ...user,
        user_email: 'mrbean.ispan@gmail.com',
        password: 'qwe12345',
      })
    } else {
      setUser({ ...user, user_email: '', password: '' })
    }
  }
  // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  return (
    <main className={`${styles['main']} py-5`}>
      <div className={`container pb-5`}>
        <div className={`${styles['login-form']} col-sm-5`}>
          <form onSubmit={handleSubmit}>
            <div className={styles['login-logo']} onClick={handleClick}>
              <Image
                style={{ width: '150px', height: '150px' }}
                src={LogoIndigo}
                alt=""
              />
            </div>
            <div className="mb-3">
              <label className={styles['tabbar']}>
                <div className={`${styles['label-name']} me-3`}>電子信箱</div>
                <input
                  className={`${styles['form-control']} 
                  ${errors.user_email ? styles['invalid'] : ''}`}
                  type="text"
                  name="user_email"
                  placeholder="輸入電子郵件"
                  value={user.user_email}
                  onChange={handleFieldChange}
                  onBlur={handleBlur}
                />
              </label>
              <div className={`${styles['error']} ${styles['error-login']}`}>
                {errors.user_email}
              </div>
            </div>
            <div className={`${styles['password-input']} mb-2`}>
              <label className={styles['tabbar']}>
                <div className={`${styles['label-name']} me-3`}>密碼</div>
                <input
                  className={`${styles['form-control']} 
                  ${errors.password ? styles['invalid'] : ''}`}
                  type={show.password ? 'text' : 'password'}
                  name="password"
                  placeholder="輸入密碼"
                  value={user.password}
                  onChange={handleFieldChange}
                  onBlur={handleBlur}
                />
              </label>
              <button
                type="button"
                className={`${styles['read-password']} `}
                onClick={() => showPassword('password')}
              >
                {show.password ? (
                  <i className="bi bi-eye"></i>
                ) : (
                  <i className="bi bi-eye-slash"></i>
                )}
              </button>
              <div className={`${styles['error']} ${styles['error-login']}`}>
                {errors.password}
              </div>
            </div>
            <div className="row mb-2">
              <div className=" d-flex justify-content-between">
                <div
                  className={`${styles['form-check']} d-flex align-items-center`}
                >
                  <input
                    className={`${styles['form-check-input']}`}
                    type="checkbox"
                    id="gridCheck1"
                  />
                  <label
                    className={`${styles['notice']} ms-1`}
                    htmlFor="gridCheck1"
                  >
                    保持登入狀態
                  </label>
                </div>
                <div className={` ${styles['notice']}`}>
                  <span>
                    還不是會員？
                    <Link href="/member/register" className={styles['a-link']}>
                      加入我們
                    </Link>
                    。
                  </span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className={`${styles['login-btn']} row col-12`}
            >
              登入
            </button>
            <div className="m-1 text-center">
              <Link
                href="/member/forget-password"
                className={`${styles['a-link']}`}
              >
                忘記密碼？
              </Link>
            </div>
            <div className={`row text-center mt-3 ${styles['notice']}`}>
              <p>
                如登入，即代表同意本站
                <Link href="#" className={styles['a-link']}>
                  隱私權政策
                </Link>
                和
                <Link href="#" className={styles['a-link']}>
                  使用條款
                </Link>
                。
              </p>
            </div>
            <div className={`mb-3 ${styles['hr-sect']}`}>快速登入</div>
            <div className="row mb-2">
              <div className="col-sm-12">
                <div className="d-flex justify-content-evenly">
                  <button
                    className={styles['quick-login']}
                    type="button"
                    onClick={() => loginGoogleRedirect()}
                  >
                    <Image
                      style={{ width: '50px', height: '48px' }}
                      src={GoogleLogo}
                      alt=""
                    />
                  </button>
                  <button
                    className={styles['quick-login']}
                    type="button"
                    onClick={goLineLogin}
                  >
                    <Image
                      style={{ width: '50px', height: '48px' }}
                      src={LineLogo}
                      alt=""
                    />
                  </button>
                  {/* <button className={styles['quick-login']} type="button">

                    <Image
                      style={{ width: '50px', height: '48px' }}
                      src={FacebookLogo}
                      alt=""
                    />
                  </button> */}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
