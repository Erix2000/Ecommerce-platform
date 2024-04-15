import React, { useState } from 'react'
import styles from './member.module.scss'
import Image from 'next/image'
import LogoIndigo from '@/assets/img/logo/logo-indigo-upright.svg'
import Link from 'next/link'
import validator from 'validator'
import Swal from 'sweetalert2'
import Form from 'react-bootstrap/Form'
import { register } from '@/services/user.js'

export default function Register() {
  const registerData = {
    user_name: '',
    user_email: '',
    password: '',
    password2: '',
    user_birth: '',
    user_sex: '',
    user_tel: '',
    mailing_address: '',
    delivery_address: '',
    agree: false,
  }

  const [user, setUser] = useState(registerData)

  const [errors, setErrors] = useState({ ...registerData, agree: '' })
  const [buttonText, setButtonText] = useState('送出')
  const [show, setShow] = useState({
    password: false,
    password2: false,
  })

  const showPassword = (fieldName) => {
    setShow((prevShow) => ({
      ...prevShow,
      [fieldName]: !prevShow[fieldName],
    }))
  }

  const handleFieldChange = (e) => {
    const { name, value, checked } = e.target

    if (name === 'agree') {
      setUser({ ...user, [name]: checked })
    } else {
      setUser({ ...user, [name]: value })
    }

    const updatedUser = { ...user, [name]: name === 'agree' ? checked : value }
    const fieldErrors = validateFields(updatedUser, errors, name)
    setErrors(fieldErrors)
  }

  const validateFields = (user, errors, fieldname = '') => {
    const newErrors = {}
    if (fieldname) newErrors[fieldname] = ''

    if (validator.isEmpty(user.user_name, { ignore_whitespace: true })) {
      newErrors.user_name ||= '姓名為必填欄位'
    }

    if (validator.isEmpty(user.user_email, { ignore_whitespace: true })) {
      newErrors.user_email ||= '電子郵件為必填欄位'
    }

    if (validator.isEmpty(user.password, { ignore_whitespace: true })) {
      newErrors.password ||= '密碼為必填欄位'
    }

    if (validator.isEmpty(user.password2, { ignore_whitespace: true })) {
      newErrors.password2 ||= '密碼驗證為必填欄位'
    }

    if (!user.agree) {
      newErrors.agree ||= '需要同意會員註冊條款'
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

    if (user.password !== user.password2) {
      newErrors.password2 ||= '密碼與密碼驗證要一致'
    }

    if (!validator.isEmail(user.user_email)) {
      newErrors.user_email ||= '電子郵件格式不正確'
    }
    if (!validator.matches(user.user_tel, /^(09)\d{8}$/)) {
      newErrors.user_tel ||= '手機號碼格式不正確'
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

  const handleAddressCopy = () => {
    setUser({ ...user, delivery_address: user.mailing_address })
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
    setButtonText('正在傳送信件')
    const res = await register(user)
    if (res.data.status === 'success') {
      setButtonText('送出')
      Swal.fire({
        title: '<h1>註冊成功</h1>',
        icon: 'info',
        html: `
            <strong>恭喜您完成註冊！</strong><br/>
            作為『MR.Bean』的一員，我們需要您的協助來完成最後的認證程序。<br/>
            <hr/>
            請您<strong>查收您的電子郵件以取得認證信函</strong>，同時<strong>重新登入</strong>。<br/>

            感謝您對我們的支持與熱愛咖啡的熱情。<br/>
            期待與您一同品味美好的咖啡時光！<br/>
        `,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonColor: '#003e52',
        confirmButtonText: `
          我已了解
        `,
      }).then((result) => {
        if (result.value) {
          window.location.href = '/member/login'
        }
      })
    } else {
      setButtonText('送出')
      Swal.fire({
        icon: 'error',
        title: '錯誤訊息',
        text: res.data.message,
        confirmButtonColor: '#003e52',
      })
      return
    }
  }
  // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  const [isClicked, setIsClicked] = useState(false)
  const handleClick = () => {
    setIsClicked(!isClicked)
    if (!isClicked) {
      setUser({
        ...user,
        user_name: '楮玄機',
        user_email: 'mrbean.ispan@gmail.com',
        password: 'qwe12345',
        password2: 'qwe12345',
        user_birth: '2024-01-01',
        user_sex: '生理男',
        user_tel: '0901234567',
        mailing_address: '臺中市北區淡溝里館前路1號',
        delivery_address: '臺中市北區淡溝里館前路1號',
        agree: true,
      })
    } else {
      setUser({
        ...user,
        user_name: '',
        user_email: '',
        password: '',
        password2: '',
        user_birth: '',
        user_sex: '',
        user_tel: '',
        mailing_address: '',
        delivery_address: '',
        agree: false,
      })
    }
  }
  // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

  return (
    <main className={`container`}>
      <div className={`${styles['content']} container`}>
        <div className={`${styles['login-content']}`}>
          <div className={`${styles['main-title']}`}>會員註冊</div>
          <div className={`${styles['login-main']} d-block d-sm-flex`}>
            <form onSubmit={handleSubmit} className="row">
              <div className="mb-1">
                <label className={`${styles['tabbar']}`}>
                  <div className={`${styles['label-name']}`}>姓名</div>
                  <div className={`${styles['label-content']}`}>
                    <input
                      className={`${styles['form-control']}  
                      ${errors.user_name ? styles['invalid'] : ''}`}
                      type="text"
                      name="user_name"
                      placeholder="輸入名稱 (必填)"
                      value={user.user_name}
                      onChange={handleFieldChange}
                      onBlur={handleBlur}
                    />
                  </div>
                </label>
                <div className={`${styles['error']} ${styles['error-r']}`}>
                  {errors.user_name}
                </div>
              </div>
              <div className="mb-1">
                <label className={`${styles['tabbar']}`}>
                  <div className={`${styles['label-name']}`}>電子信箱</div>
                  <div className={`${styles['label-content']}`}>
                    <input
                      className={`${styles['form-control']}  
                      ${errors.user_email ? styles['invalid'] : ''}`}
                      type="text"
                      name="user_email"
                      placeholder="輸入電子郵件 (必填)"
                      value={user.user_email}
                      onChange={handleFieldChange}
                      onBlur={handleBlur}
                    />
                  </div>
                </label>
                <div className={`${styles['error']} ${styles['error-r']}`}>
                  {errors.user_email}
                </div>
              </div>
              <div className={`${styles['password-input']} mb-1 `}>
                <label className={`${styles['tabbar']}`}>
                  <div className={`${styles['label-name']}`}>密碼</div>
                  <div className={`${styles['label-content']}`}>
                    <input
                      className={`${styles['form-control']}
                      ${errors.password ? styles['invalid'] : ''}`}
                      type={show.password ? 'text' : 'password'}
                      name="password"
                      placeholder="輸入密碼 (必填)"
                      value={user.password}
                      onChange={handleFieldChange}
                      onBlur={handleBlur}
                      onCopy={(e) => e.preventDefault()}
                    />
                  </div>
                </label>
                <div className={`${styles['error']} ${styles['error-r']}`}>
                  {errors.password}
                </div>
                <button
                  type="button"
                  className={`${styles['read-password']} px-3 mt-2`}
                  onClick={() => showPassword('password')}
                >
                  {show.password ? (
                    <i className="bi bi-eye"></i>
                  ) : (
                    <i className="bi bi-eye-slash"></i>
                  )}
                </button>
              </div>
              <div className={`${styles['password-input']} mb-1`}>
                <label className={`${styles['tabbar']}`}>
                  <div className={`${styles['label-name']}`}>密碼驗證</div>
                  <div className={`${styles['label-content']}`}>
                    <input
                      className={`${styles['form-control']} 
                      ${errors.password2 ? styles['invalid'] : ''}`}
                      type={show.password2 ? 'text' : 'password'}
                      name="password2"
                      placeholder="重複確認密碼 (必填)"
                      value={user.password2}
                      onChange={handleFieldChange}
                      onBlur={handleBlur}
                      onCopy={(e) => e.preventDefault()}
                    />
                  </div>
                </label>
                <div className={`${styles['error']} ${styles['error-r']}`}>
                  {errors.password2}
                </div>
                <button
                  type="button"
                  className={`${styles['read-password']} px-3 mt-2`}
                  onClick={() => showPassword('password2')}
                >
                  {show.password2 ? (
                    <i className="bi bi-eye"></i>
                  ) : (
                    <i className="bi bi-eye-slash"></i>
                  )}
                </button>
              </div>

              <div>
                <label className={`${styles['tabbar']}`}>
                  <div className={`${styles['label-name']}`}>生日</div>
                  <div className={`${styles['label-content']}`}>
                    <input
                      className={`${styles['form-control']}`}
                      type="date"
                      name="user_birth"
                      max={new Date().toISOString().split('T')[0]}
                      value={user.user_birth}
                      onChange={handleFieldChange}
                    />
                  </div>
                </label>
                <div className={`${styles['error']}`}></div>
              </div>
              <div className="mb-1">
                <label className={`${styles['tabbar']}`}>
                  <div className={`${styles['label-name']}`}>連絡電話</div>
                  <div className={`${styles['label-content']}`}>
                    <input
                      className={`${styles['form-control']} ${
                        errors.user_tel ? styles['invalid'] : ''
                      }`}
                      type="text"
                      name="user_tel"
                      placeholder="輸入連絡電話"
                      value={user.user_tel}
                      onBlur={handleBlur}
                      onChange={handleFieldChange}
                    />
                  </div>
                </label>
                <div className={`${styles['error']} ${styles['error-r']}`}>
                  {errors.user_tel}
                </div>
              </div>
              <div className="">
                <label className={`${styles['tabbar']}`} htmlFor="genderSelect">
                  <div className={`${styles['label-name']}`}>生理性別</div>
                  <div className={`${styles['form-sex']}`}>
                    <Form.Select
                      id="genderSelect"
                      aria-label="請選擇性別"
                      defaultValue=""
                      name="user_sex"
                      value={user.user_sex}
                      onChange={handleFieldChange}
                    >
                      <option value="" disabled>
                        請選擇性別
                      </option>
                      <option value="生理男">生理男</option>
                      <option value="生理女">生理女</option>
                      <option value="不方便透漏">不方便透漏</option>
                    </Form.Select>
                  </div>
                </label>
                <div className={`${styles['error']}`}></div>
              </div>

              <div>
                <label className={`${styles['tabbar']}`}>
                  <div className={`${styles['label-name']}`}>通訊地址</div>
                  <div className={`${styles['label-content']}`}>
                    <input
                      className={`${styles['form-control']}`}
                      type="text"
                      name="mailing_address"
                      placeholder="輸入通訊地址"
                      value={user.mailing_address}
                      onChange={handleFieldChange}
                    />
                  </div>
                </label>
                <div className={`${styles['error']}`}></div>
              </div>
              <div>
                <label
                  className={`${styles['tabbar']} ${styles['ditto-r']} align-items-start`}
                >
                  <div className={`${styles['label-name']}`}>寄送地址</div>
                  <div className={`${styles['label-content']}`}>
                    <input
                      className={`${styles['form-control']}`}
                      type="text"
                      name="delivery_address"
                      placeholder="輸入寄送地址"
                      value={user.delivery_address}
                      onChange={handleFieldChange}
                    />
                    <div className={`${styles['ditto-a']}`}>
                      <input
                        id="ditto"
                        className={`mx-2 
                    ${styles['form-check-input']}`}
                        type="checkbox"
                        name="ditto"
                        onClick={handleAddressCopy}
                      />
                      <label htmlFor="ditto">同上</label>
                    </div>
                  </div>
                </label>
                <div className={`${styles['error']}`}></div>
              </div>
              <div className="d-flex align-items-start">
                <div>
                  <input
                    id="agree"
                    className={`mx-2 
                    ${styles['form-check-input']}`}
                    type="checkbox"
                    name="agree"
                    checked={user.agree}
                    onChange={handleFieldChange}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="agree" className={styles['agreeLabel']}>
                    我同意會員註冊條款
                  </label>
                </div>
                <div className={`${styles['error']}  mt-0 mb-3 ms-0`}>
                  &emsp;{errors.agree}
                </div>
              </div>
              <div className={`${styles['btn-group']}`}>
                <Link
                  type="button"
                  href="/member/login"
                  className={`${styles['cancel']}`}
                >
                  取消
                </Link>
                <button
                  type="submit"
                  href="#"
                  className={`${styles['submit']}`}
                >
                  {buttonText}
                </button>
              </div>
            </form>
            <div
              className={`${styles['login-logo']} d-none d-xl-block`}
              onClick={handleClick}
            >
              <Image
                style={{ width: '300px', height: '300px' }}
                src={LogoIndigo}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
