import React, { useEffect, useState } from 'react'
import styles from './member.module.scss'
import Link from 'next/link'
import validator from 'validator'
import Form from 'react-bootstrap/Form'
import Swal from 'sweetalert2'
import { getUserInfo, updateUserInfo } from '@/services/user.js'
import { useRouter } from 'next/router'

export default function UserInfoRevise() {
  const userInfoData = {
    uuid: '',
    user_name: '',
    user_birth: '',
    user_tel: '',
    user_sex: '',
    user_img: '',
    mailing_address: '',
    delivery_address: '',
  }
  const router = useRouter()
  const [user, setUser] = useState(userInfoData)
  const [errors, setErrors] = useState(userInfoData)
  const images = [
    '20.svg',
    '21.svg',
    '22.svg',
    '23.svg',
    '24.svg',
    '25.svg',
    '26.svg',
    '27.svg',
    '28.svg',
    '29.svg',
  ]

  const handleAvatarChange = (e) => {
    setUser({ ...user, user_img: e.target.value })
  }

  useEffect(() => {
    const obtainUserData = async () => {
      const { data, status, error } = await getUserInfo()
      if (status === 'success' && data) {
        setUser({
          uuid: data.user.uuid || '',
          user_name: data.user.user_name || '',
          user_birth: data.user.user_birth || '',
          user_tel: data.user.user_tel || '',
          user_sex: data.user.user_sex || '',
          user_img: data.user.user_img || '',
          mailing_address: data.user.mailing_address || '',
          delivery_address: data.user.delivery_address || '',
        })
      } else {
        console.error('獲取資料失敗:', error)
      }
    }
    obtainUserData()
  }, [])

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

    if (validator.isEmpty(user.user_name, { ignore_whitespace: true })) {
      newErrors.user_name ||= '姓名為必填欄位'
    }
    if (user.user_tel && !validator.matches(user.user_tel, /^(09)\d{8}$/)) {
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

    try {
      const { data, error } = await updateUserInfo(user.uuid, user)
      if (error) {
        console.error('更新失败:', error)
        Swal.fire({
          icon: 'error',
          title: '錯誤訊息',
          text: error.message,
          confirmButtonColor: '#003e52',
        })
      } else {
        console.log('更新成功', data)
        Swal.fire({
          icon: 'info',
          title: '更新成功',
          text: data.message,
          confirmButtonColor: '#003e52',
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/member/user-info')
          }
        })
      }
    } catch (error) {
      console.error('更新請求失敗:', error)
      Swal.fire({
        icon: 'error',
        title: '錯誤訊息',
        text: error.message,
        confirmButtonColor: '#003e52',
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
        user_name: '台灣黑熊',
        user_birth: '2000-11-01',
        user_sex: '生理女',
        user_tel: '0987654321',
        mailing_address: '台北市士林區士商路189號',
        delivery_address: '',
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
    <div className={`${styles['content']} container`}>
      <div className={`${styles['main-title']}`} onClick={handleClick}>
        修改會員資料
      </div>
      <form className={`${styles['main-content']}`} onSubmit={handleSubmit}>
        <div className={`${styles['radioGroup']}`}>
          <div className={`${styles['tabbar']}`}>
            <div className={`${styles['label-name']}`}>頭貼</div>
            <div className={` ${styles['radioWrapperContainer']}`}>
              {images.map((image, index) => (
                <div key={index} className={`${styles['radioWrapper']}`}>
                  <input
                    type="radio"
                    id={`image${index}`}
                    name="user_img"
                    value={image}
                    className={`${styles['hiddenRadio']}`}
                    onChange={handleAvatarChange}
                    checked={user.user_img === image}
                  />
                  <label
                    htmlFor={`image${index}`}
                    className={styles.imageLabel}
                    style={{ backgroundImage: `url(/avatar/${image})` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className={`${styles['tabbar']}`}>
            <div className={`${styles['label-name']}`}>姓名</div>
            <input
              className={`${styles['form-control']} ${
                errors.user_name ? styles['invalid'] : ''
              }`}
              type="text"
              name="user_name"
              placeholder="修改會員資料"
              value={user.user_name}
              onChange={handleFieldChange}
              onBlur={handleBlur}
            />
          </label>
          <div className={`${styles['error']}`}>{errors.user_name}</div>
        </div>
        <div>
          <label className={`${styles['tabbar']}`}>
            <div className={`${styles['label-name']}`}>生日</div>
            <input
              className={`${styles['form-control']}`}
              type="date"
              name="user_birth"
              placeholder="年/月/日"
              value={user.user_birth}
              max={new Date().toISOString().split('T')[0]}
              onChange={handleFieldChange}
            />
          </label>
          <div className={`${styles['error']}`}></div>
        </div>
        <div>
          <label className={`${styles['tabbar']}`}>
            <div className={`${styles['label-name']}`}>連絡電話</div>
            <input
              className={`${styles['form-control']} ${
                errors.user_tel ? styles['invalid'] : ''
              }`}
              type="text"
              name="user_tel"
              placeholder="填入連絡電話"
              value={user.user_tel}
              onChange={handleFieldChange}
            />
          </label>
          <div className={`${styles['error']}`}>{errors.user_tel}</div>
        </div>
        <div className="">
          <label className={`${styles['tabbar']}`} htmlFor="genderSelect">
            <div className={`${styles['label-name']}`}>生理性別</div>
            <div className={`${styles['form-control']} ${styles['form-sex']}`}>
              <Form.Select
                id="genderSelect"
                aria-label="請選擇性別"
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
            <input
              className={`${styles['form-control']}`}
              type="text"
              name="mailing_address"
              placeholder="填入通訊地址"
              value={user.mailing_address}
              onChange={handleFieldChange}
            />
          </label>
          <div className={`${styles['error']}`}></div>
        </div>
        <div>
          <label
            className={`${styles['tabbar']}  ${styles['ditto-r']} align-items-start`}
          >
            <div className={`${styles['label-name']}`}>寄送地址</div>
            <input
              className={`${styles['form-control']}`}
              type="text"
              name="delivery_address"
              placeholder="填入寄送地址"
              value={user.delivery_address}
              onChange={handleFieldChange}
            />
            <div className={`${styles['ditto-a']}`}>
              <input
                className={`mx-2 ${styles['form-check-input']}`}
                type="checkbox"
                name="ditto"
                id="dittoCheckbox"
                onClick={handleAddressCopy}
              />
              <label htmlFor="dittoCheckbox">同上</label>
            </div>
          </label>
          <div className={`${styles['error']}`}></div>
        </div>

        <div className={`${styles['btn-group']}`}>
          <Link
            type="button"
            href="/member/user-info"
            className={`${styles['cancel']}`}
          >
            取消
          </Link>
          <button type="submit" href="#" className={`${styles['submit']}`}>
            送出
          </button>
        </div>
      </form>
    </div>
  )
}
