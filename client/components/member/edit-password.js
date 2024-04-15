import React, { useState } from 'react'
import styles from './member.module.scss'
import Link from 'next/link'
import validator from 'validator'
import Swal from 'sweetalert2'
import { updatePassword } from '@/services/user.js'

export default function EditPassword() {
  const editPasswordData = {
    password: '',
    newpassword: '',
    newpassword2: '',
  }

  const [password, setPassword] = useState(editPasswordData)
  const [errors, setErrors] = useState(editPasswordData)
  const [show, setShow] = useState({
    password: false,
    newpassword: false,
    newpassword2: false,
  })

  const showPassword = (fieldName) => {
    setShow((prevShow) => ({
      ...prevShow,
      [fieldName]: !prevShow[fieldName],
    }))
  }

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setPassword((prevPassword) => ({
      ...prevPassword,
      [name]: value,
    }))

    const updatedPassword = { ...password, [name]: value }
    const newErrors = validateFields(updatedPassword, errors, name)
    setErrors(newErrors)
  }

  const validateFields = (password, errors, fieldname = '') => {
    const newErrors = {}
    Object.keys(errors).forEach((prop) => (newErrors[prop] = ''))

    if (validator.isEmpty(password.password, { ignore_whitespace: true })) {
      newErrors.password ||= '密碼為必填欄位'
    }

    if (validator.isEmpty(password.newpassword, { ignore_whitespace: true })) {
      newErrors.newpassword ||= '新密碼為必填欄位'
    }

    if (validator.isEmpty(password.newpassword2, { ignore_whitespace: true })) {
      newErrors.newpassword2 ||= '重複確認密碼為必填欄位'
    }

    if (
      !validator.isStrongPassword(password.newpassword, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      newErrors.newpassword ||=
        '密碼至少8個至多12個字元，而且至少需包含一個英文小寫字元'
    }

    if (password.newpassword.length > 12) {
      newErrors.newpassword ||= '密碼至多12個字元'
    }

    if (password.newpassword !== password.newpassword2) {
      newErrors.newpassword2 ||= '密碼與確認密碼要一致'
    }

    return fieldname
      ? { ...errors, [fieldname]: newErrors[fieldname] }
      : newErrors
  }

  const handleBlur = (e) => {
    const newErrors = validateFields(password, errors, e.target.name)
    setErrors(newErrors)
  }

  const hasError = (errors, fieldname) => {
    return !!errors[fieldname]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const inputs = e.target.elements

    const newErrors = validateFields(password, errors)
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

    const res = await updatePassword(password)
    console.log(res)
    if (res.data.status === 'success') {
      Swal.fire({
        title: '<h1>密碼修改成功</h1>',
        icon: 'info',
        html: `
            <strong>您已修改密碼成功</strong>
        `,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonColor: '#003e52',
        confirmButtonText: `
          我已了解
        `,
      }).then((result) => {
        if (result.value) {
          window.location.href = '/member/user-info'
        }
      })
      setPassword(editPasswordData)
    } else {
      Swal.fire({
        icon: 'error',
        title: '錯誤訊息',
        text: res.data.message,
        confirmButtonColor: '#003e52',
      })
      setPassword(editPasswordData)
      return
    }
  }
  // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  const [isClicked, setIsClicked] = useState(false)
  const handleClick = () => {
    setIsClicked(!isClicked)
    if (!isClicked) {
      setPassword({
        ...password,
        password: 'qwe12345',
        newpassword: 'qwe123456',
        newpassword2: 'qwe123456',
      })
    } else {
      setPassword({
        ...password,
        password: '',
        newpassword: '',
        newpassword2: '',
      })
    }
  }
  // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  return (
    <div className={`${styles['content']} container`}>
      <div className={`${styles['main-title']}`} onClick={handleClick}>
        修改密碼
      </div>
      <form onSubmit={handleSubmit} className={`${styles['main-content']}`}>
        <div className={`${styles['password-input']} mb-3`}>
          <label className={`${styles['tabbar']}`}>
            <div className={`${styles['label-name']} d-sm-block d-none`}>
              原密碼
            </div>
            <input
              className={`${styles['form-control']} ${
                errors.password ? styles['invalid'] : ''
              }`}
              type={show.password ? 'text' : 'password'}
              name="password"
              placeholder="輸入原密碼"
              value={password.password}
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
          <div className={`${styles['error']}`}>{errors.password}</div>
        </div>
        <div className={`${styles['password-input']} mb-3`}>
          <label className={`${styles['tabbar']}`}>
            <div className={`${styles['label-name']} d-sm-block d-none`}>
              新密碼
            </div>
            <input
              className={`${styles['form-control']} 
              ${errors.newpassword ? styles['invalid'] : ''}`}
              type={show.newpassword ? 'text' : 'password'}
              name="newpassword"
              placeholder="輸入您的新密碼"
              value={password.newpassword}
              onChange={handleFieldChange}
              onBlur={handleBlur}
              onCopy={(e) => e.preventDefault()}
            />
          </label>
          <button
            type="button"
            className={`${styles['read-password']} `}
            onClick={() => showPassword('newpassword')}
          >
            {show.newpassword ? (
              <i className="bi bi-eye"></i>
            ) : (
              <i className="bi bi-eye-slash"></i>
            )}
          </button>
          <div className={`${styles['error']}`}>{errors.newpassword}</div>
        </div>
        <div className={`${styles['password-input']} mb-3`}>
          <label className={`${styles['tabbar']}`}>
            <div className={`${styles['label-name']} d-sm-block d-none`}>
              確認密碼
            </div>
            <input
              className={`${styles['form-control']} 
              ${errors.newpassword2 ? styles['invalid'] : ''}`}
              type={show.newpassword2 ? 'text' : 'password'}
              name="newpassword2"
              placeholder="再次輸入新密碼。"
              value={password.newpassword2}
              onChange={handleFieldChange}
              onBlur={handleBlur}
              onCopy={(e) => e.preventDefault()}
            />
          </label>
          <button
            type="button"
            className={`${styles['read-password']} `}
            onClick={() => showPassword('newpassword2')}
          >
            {show.newpassword2 ? (
              <i className="bi bi-eye"></i>
            ) : (
              <i className="bi bi-eye-slash"></i>
            )}
          </button>

          <div className={`${styles['error']}`}>{errors.newpassword2}</div>
        </div>

        <div className={`${styles['btn-group']}`}>
          <Link
            type="button"
            href="/member/user-info"
            className={`${styles['cancel']}`}
          >
            取消
          </Link>
          <button
            type="submit"
            href="/member/user-info"
            className={`${styles['submit']}`}
          >
            送出
          </button>
        </div>
      </form>
    </div>
  )
}
