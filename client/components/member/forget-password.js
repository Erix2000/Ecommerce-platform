import React, { useState, useEffect } from 'react'
import styles from './member.module.scss'
import Image from 'next/image'
import LogoIndigo from '@/assets/img/logo/logo-indigo-upright.svg'
import Link from 'next/link'
import validator from 'validator'
import useInterval from '@/hooks/use-interval'
import { requestOtpToken, resetPassword } from '@/services/user.js'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

export default function ForgetPassword() {
  const resetPasswordData = {
    email: '',
    token: '',
    password: '',
    password2: '',
  }
  const [user, setUser] = useState(resetPasswordData)
  const [errors, setErrors] = useState(resetPasswordData)
  const [showFields, setShowFields] = useState(false)
  const [show, setShow] = useState({
    password: false,
    password2: false,
  })
  const [buttonText, setButtonText] = useState('取得驗證碼')
  const [disableBtn, setDisableBtn] = useState(false)
  const [count, setCount] = useState(60) // 60s
  const [delay, setDelay] = useState(null) // delay=null可以停止, delay是數字時會開始倒數
  const router = useRouter()

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setUser((prevUser) => ({ ...prevUser, [name]: value }))
    // 只有當密碼或確認密碼欄位被改變時才執行相應的檢查
    if (name === 'password' || name === 'password2' || name === 'token') {
      const newErrors = validateFields({ ...user, [name]: value }, errors, name)
      setErrors(newErrors)
    }
  }

  const validateFields = (user, errors, fieldname = '') => {
    const newErrors = { ...errors }

    // 驗證電子郵件
    if (fieldname === 'email' || fieldname === '') {
      newErrors.email = ''
      if (validator.isEmpty(user.email, { ignore_whitespace: true })) {
        newErrors.email = '電子郵件為必填欄位'
      } else if (!validator.isEmail(user.email)) {
        newErrors.email = '電子郵件格式不正確'
      }
    }
    if (fieldname === 'token' || fieldname === '') {
      newErrors.token = ''
      if (validator.isEmpty(user.token, { ignore_whitespace: true })) {
        newErrors.token = '驗證碼為必填欄位'
      } else if (!validator.isNumeric(user.token)) {
        newErrors.token = '驗證碼必須是數字格式'
      }
    }

    // 驗證密碼
    if (fieldname === 'password' || fieldname === '') {
      // 首先清空先前的錯誤信息
      newErrors.password = ''

      // 檢查是否為必填欄位
      if (validator.isEmpty(user.password, { ignore_whitespace: true })) {
        newErrors.password = '密碼為必填欄位'
      }
      // 如果密碼不是空的，再進行長度檢查
      else if (user.password.length > 12) {
        newErrors.password = '密碼至多12個字元'
      }
      // 最後檢查密碼強度
      else if (
        !validator.isStrongPassword(user.password, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 0,
          minNumbers: 1,
          minSymbols: 0,
        })
      ) {
        newErrors.password =
          '密碼至少8個至多12個字元，而且至少需包含一個英文小寫字元和一個數字'
      }
    }

    // 驗證確認密碼
    if (fieldname === 'password2' || fieldname === '') {
      newErrors.password2 = ''
      if (validator.isEmpty(user.password2, { ignore_whitespace: true })) {
        newErrors.password2 = '確認密碼為必填欄位'
      } else if (user.password !== user.password2) {
        newErrors.password2 = '密碼與確認密碼要一致'
      }
    }

    return newErrors
  }
  
  const handleBlur = (e) => {
    const newErrors = validateFields(user, errors, e.target.name)
    setErrors(newErrors)
  }

  useInterval(() => {
    if (count > 0) {
      setCount(count - 1)
    } else {
      setButtonText('取得驗證碼')
      setDisableBtn(false)
      setDelay(null)
    }
  }, delay)

  useEffect(() => {
    if (delay !== null) {
      setButtonText(`${count}秒後再次取得驗証碼`)
    } else {
      setButtonText('取得驗証碼')
    }
  }, [count, delay])

  const showPassword = (fieldName) => {
    setShow((prevShow) => ({
      ...prevShow,
      [fieldName]: !prevShow[fieldName],
    }))
  }

  const handleRequestOtpToken = async () => {
    setErrors(resetPasswordData)
    if (validator.isEmpty(user.email, { ignore_whitespace: true })) {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '電子郵件為必填欄位',
        confirmButtonColor: '#003e52',
        confirmButtonText: '確定',
      })
      return
    }
    if (!validator.isEmail(user.email)) {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '電子郵件格式不正確',
        confirmButtonColor: '#003e52',
        confirmButtonText: '確定',
      })
      return
    }

    if (delay === null) {
      try {
        setButtonText('信件寄送中')
        const res = await requestOtpToken(user.email)
        if (res.status === 'success') {
          setCount(60)
          setDelay(1000)
          setDisableBtn(true)
          Swal.fire({
            title: '成功!',
            text: '驗證碼已寄送至電子信箱',
            icon: 'success',
            confirmButtonColor: '#003e52',
            confirmButtonText: '確定',
          })
          setShowFields(true)
        } else {
          setButtonText('取得驗証碼')
          Swal.fire({
            title: '錯誤!',
            text: '錯誤',
            icon: 'error',
            confirmButtonColor: '#003e52',
            confirmButtonText: '確定',
          })
        }
      } catch (error) {
        setButtonText('取得驗証碼')
        Swal.fire({
          title: '成功!',
          text: '請求一次性驗證碼失敗',
          icon: 'error',
          confirmButtonColor: '#003e52',
          confirmButtonText: '確定',
        })
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '60s內無法重新獲得驗證碼',
        confirmButtonColor: '#003e52',
        confirmButtonText: '確定',
      })
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    const newErrors = validateFields(user, errors)
    setErrors(newErrors)
    let hasError = false
    for (const key in newErrors) {
      if (newErrors[key]) {
        hasError = true
        break
      }
    }

    if (hasError) {
      setErrors(newErrors)
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '請確保所有字段正確填寫',
        confirmButtonColor: '#003e52',
        confirmButtonText: '確定',
      })
      return
    }

    try {
      const res = await resetPassword(user.email, user.password, user.token)
      console.log(res)
      if (res.status === 'success') {
        Swal.fire({
          title: '成功!',
          text: '您的密碼已經成功重置。',
          icon: 'success',
          confirmButtonColor: '#003e52',
          confirmButtonText: '確定',
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/member/login')
          }
        })
      } else {
        Swal.fire({
          title: '失敗!',
          text: '密碼重置失敗',
          icon: 'error',
          confirmButtonColor: '#003e52',
          confirmButtonText: '確定',
        })
      }
    } catch (error) {
      Swal.fire({
        title: '錯誤!',
        text: '重設密碼時發生錯誤。',
        icon: 'error',
        confirmButtonColor: '#003e52',
        confirmButtonText: '確定',
      })
    }
  }
  // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  const [isClicked, setIsClicked] = useState(false)
  const handleClickMail = () => {
    setIsClicked(!isClicked)
    if (!isClicked) {
      setUser({
        ...user,
        email: 'mrbean.ispan@gmail.com',
      })
    } else {
      setUser({
        ...user,
        email: '',
      })
    }
  }
  const handleClickPassword = () => {
    setIsClicked(!isClicked)
    if (!isClicked) {
      setUser({
        ...user,
        password: 'qwe12345',
        password2: 'qwe12345',
      })
    } else {
      setUser({
        ...user,
        password: '',
        password2: '',
      })
    }
  }
  // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  return (
    <main className={`${styles['main']} ${styles['main-container']} py-5`}>
      <div className="container pb-5">
        <div className={`${styles['login-form']} col-sm-5`}>
          <form>
            <div className={styles['login-logo']} onClick={handleClickMail}>
              <Image
                style={{ width: '150px', height: '150px' }}
                src={LogoIndigo}
                alt=""
              />
            </div>
            <div
              className={`${styles['login-title']} text-center mb-3`}
              onClick={handleClickPassword}
            >
              忘記密碼
            </div>
            <p className={`${styles['login-p']} mb-3`}>
              輸入你的會員電子郵件地址，按下&quot;取得驗証碼&ldquo;按鈕後，我們會將密碼重設指示寄送給你。
            </p>
            <div className="mb-3">
              <label className={`${styles['tabbar']}`}>
                <div className={`${styles['label-name']} `}>電子信箱</div>
                <input
                  className={`${styles['form-control']}
                  ${errors.email ? styles['invalid'] : ''}`}
                  type="text"
                  name="email"
                  placeholder="輸入電子郵件"
                  value={user.email}
                  onChange={handleFieldChange}
                  onBlur={handleBlur}
                />
              </label>
              <div className={`${styles['error']} ${styles['error-login']}`}>
                {errors.email}
              </div>
            </div>
            {showFields && (
              <>
                <div className="mb-3 row position-relative">
                  <label className={`${styles['tabbar']}`}>
                    <div className={`${styles['label-name']} `}>驗證碼</div>
                    <input
                      className={`${styles['form-control']} 
                  ${errors.token ? styles['invalid'] : ''}`}
                      type="text"
                      name="token"
                      placeholder="輸入電子郵件驗證碼"
                      value={user.token}
                      onChange={handleFieldChange}
                      onBlur={handleBlur}
                    />
                  </label>
                  <div
                    className={`${styles['error']} ${styles['error-login']}`}
                  >
                    {errors.token}
                  </div>
                </div>
                <div className={`${styles['password-input']} mb-3`}>
                  <label className={`${styles['tabbar']}`}>
                    <div className={`${styles['label-name']}`}>密碼</div>
                    <input
                      className={`${styles['form-control']} 
                  ${errors.password ? styles['invalid'] : ''}`}
                      type={show.password ? 'text' : 'password'}
                      name="password"
                      placeholder="輸入密碼"
                      value={user.password}
                      onChange={handleFieldChange}
                      onBlur={handleBlur}
                      onCopy={(e) => e.preventDefault()}
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

                  <div
                    className={`${styles['error']} ${styles['error-login']}`}
                  >
                    {errors.password}
                  </div>
                </div>
                <div className={`${styles['password-input']} mb-3`}>
                  <label className={`${styles['tabbar']}`}>
                    <div className={`${styles['label-name']}`}>確認密碼</div>
                    <input
                      className={`${styles['form-control']} 
                  ${errors.password2 ? styles['invalid'] : ''}`}
                      type={show.password2 ? 'text' : 'password'}
                      name="password2"
                      placeholder="輸入確認密碼"
                      value={user.password2}
                      onChange={handleFieldChange}
                      onBlur={handleBlur}
                      onCopy={(e) => e.preventDefault()}
                    />
                  </label>
                  <button
                    type="button"
                    className={`${styles['read-password']} `}
                    onClick={() => showPassword('password2')}
                  >
                    {show.password2 ? (
                      <i className="bi bi-eye"></i>
                    ) : (
                      <i className="bi bi-eye-slash"></i>
                    )}
                  </button>
                  <div
                    className={`${styles['error']} ${styles['error-login']}`}
                  >
                    {errors.password2}
                  </div>
                </div>
              </>
            )}
            <div className="row d-flex text-center">
              <button
                type="button"
                className={`${styles['login-btn']} col-5`}
                onClick={handleRequestOtpToken}
                disabled={disableBtn}
              >
                {buttonText}
              </button>

              <button
                type="submit"
                className={`${styles['login-btn']} col-5`}
                onClick={handleResetPassword}
              >
                確認重設密碼
              </button>
            </div>
            <div className={`row mt-2 text-center ${styles['notice']}`}>
              <p>
                還不是會員？
                <Link href="/member/register" className={styles['a-link']}>
                  加入我們
                </Link>
                。
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
