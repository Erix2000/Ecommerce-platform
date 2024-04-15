import React, { useEffect, useState } from 'react'
import styles from './member.module.scss'
import Link from 'next/link'
import validator from 'validator'
import Swal from 'sweetalert2'
import { getLecturerInfo, updateLecturerInfo } from '@/services/user.js'
import { useRouter } from 'next/router'
export default function SpeakerInfoRevise() {
  const speakerData = {
    exclusive_code: '',
    lecturer_name: '',
    lecturer_img: '',
    lecturer_expertise: '',
    lecturer_honor: '',
    lecturer_experience: '',
  }
  const [lecturer, setLecturer] = useState(speakerData)
  const [errors, setErrors] = useState({ ...speakerData, agree: '' })
  const router = useRouter()

  useEffect(() => {
    const obtainLecturerData = async () => {
      const { data, status, error } = await getLecturerInfo()
      if (status === 'success' && data) {
        setLecturer({
          exclusive_code: data.lecturer.exclusive_code || '',
          lecturer_name: data.lecturer.lecturer_name || '',
          lecturer_img: data.lecturer.lecturer_img || '',
          lecturer_expertise: data.lecturer.lecturer_expertise || '',
          lecturer_honor: data.lecturer.lecturer_honor || '',
          lecturer_experience: data.lecturer.lecturer_experience || '',
        })
      } else {
        console.error('獲取資料失敗:', error)
      }
    }
    obtainLecturerData()
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLecturer({ ...lecturer, lecturer_img: file })
    }
  }

  const handleFieldChange = (e) => {
    const { name, value, checked } = e.target
    if (name === 'agree') {
      setLecturer({ ...lecturer, [name]: checked })
    } else {
      setLecturer({ ...lecturer, [name]: value })
    }

    const updatedUser = {
      ...lecturer,
      [name]: name === 'agree' ? checked : value,
    }
    const fieldErrors = validateFields(updatedUser, errors, name)
    setErrors(fieldErrors)
  }

  const validateFields = (lecturer, errors, fieldname = '') => {
    const newErrors = {}
    Object.keys(errors).forEach((prop) => (newErrors[prop] = ''))

    if (
      validator.isEmpty(lecturer.lecturer_name, { ignore_whitespace: true })
    ) {
      newErrors.lecturer_name ||= '姓名為必填欄位'
    }

    if (
      validator.isEmpty(lecturer.lecturer_expertise, {
        ignore_whitespace: true,
      })
    ) {
      newErrors.lecturer_expertise ||= '專業領域為必填欄位'
    }

    if (lecturer.lecturer_expertise.length > 15) {
      newErrors.lecturer_expertise ||= '密碼至多15個字元'
    }

    if (
      validator.isEmpty(lecturer.lecturer_honor, { ignore_whitespace: true })
    ) {
      newErrors.lecturer_honor ||= '請輸入專業證照'
    }

    if (
      validator.isEmpty(lecturer.lecturer_experience, {
        ignore_whitespace: true,
      })
    ) {
      newErrors.lecturer_experience ||= '請輸入經歷'
    }

    return fieldname
      ? { ...errors, [fieldname]: newErrors[fieldname] }
      : newErrors
  }

  const handleBlur = (e) => {
    const newErrors = validateFields(lecturer, errors, e.target.name)
    setErrors(newErrors)
  }

  const hasError = (errors, fieldname) => {
    return !!errors[fieldname]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    if (lecturer.lecturer_img) {
      formData.append('lecturer_img', lecturer.lecturer_img)
    }
    formData.append('lecturer_name', lecturer.lecturer_name)
    formData.append('lecturer_expertise', lecturer.lecturer_expertise)
    formData.append('lecturer_honor', lecturer.lecturer_honor)
    formData.append('lecturer_experience', lecturer.lecturer_experience)

    let exclusiveCode = lecturer.exclusive_code
    try {
      const { data, error } = await updateLecturerInfo(exclusiveCode, formData)

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
            router.push('/member/lecturer-info')
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
      setLecturer({
        ...lecturer,
        lecturer_img: '',
        lecturer_name: '豆豆先生',
        lecturer_expertise: '義式咖啡、拉花、手沖式咖啡',
        lecturer_honor:
          'SCA 義式咖啡師專業級證照、SCA 咖啡萃取中級證照、澳大利亞國際咖啡烘焙賽 總冠軍&三冠王（台灣第一人）',
        lecturer_experience:
          '2018 年 WCE 世界盃拉花大賽 (WLAC) 亞軍、2020 年 WCE 世界盃拉花大賽 (WLAC) 冠軍、歐洲精品咖啡協會 萃取與研磨三級認證｜SCAE Grinding&Brewing Professional、歐洲精品咖啡協會 感官三級認證｜SCAE Sensory Professional',
      })
    } else {
      setLecturer({
        ...lecturer,
        lecturer_img: '',
        lecturer_name: '',
        lecturer_expertise: '',
        lecturer_honor: '',
        lecturer_experience: '',
      })
    }
  }
  // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  return (
    <div className={`${styles['content']} container`}>
      <div className={`${styles['main-title']}`} onClick={handleClick}>
        講師資料
      </div>
      <form
        className={`${styles['main-content']}`}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div>
          <label className={`${styles['tabbar']}`}>
            <div className={`${styles['label-name']}`}>講師照片</div>
            <input
              className={`${styles['form-control']}`}
              type="file"
              placeholder="請選擇檔案"
              name="lecturer_img"
              onChange={handleImageChange}
              onBlur={handleBlur}
            />
          </label>
          <div className={`${styles['error']}`}></div>
        </div>
        <div>
          <label className={`${styles['tabbar']}`}>
            <div className={`${styles['label-name']}`}>姓名</div>
            <input
              className={`${styles['form-control']}`}
              type="text"
              name="lecturer_name"
              placeholder="請輸入姓名 (必填)"
              value={lecturer.lecturer_name}
              onChange={handleFieldChange}
              onBlur={handleBlur}
            />
          </label>
          <div className={`${styles['error']}`}>{errors.lecturer_name}</div>
        </div>
        <div>
          <label className={`${styles['tabbar']}`}>
            <div className={`${styles['label-name']}`}>專業領域</div>
            <input
              className={`${styles['form-control']}`}
              type="text"
              name="lecturer_expertise"
              placeholder="請輸入專業領域 (必填)"
              value={lecturer.lecturer_expertise}
              onChange={handleFieldChange}
              onBlur={handleBlur}
            />
          </label>
          <div className={`${styles['error']}`}>
            {errors.lecturer_expertise}
          </div>
        </div>
        <div>
          <label className={`${styles['tabbar']} `}>
            <div className={`${styles['label-name']}`}>專業證照</div>
            <textarea
              className={`${styles['form-control']} ${styles['form-textarea']}`}
              type="text"
              name="lecturer_honor"
              placeholder="請輸入專業證照 (必填)"
              value={lecturer.lecturer_honor}
              onChange={handleFieldChange}
              onBlur={handleBlur}
            ></textarea>
          </label>
          <div className={`${styles['error']}`}>{errors.lecturer_honor}</div>
        </div>
        <div>
          <label className={`${styles['tabbar']} `}>
            <div
              className={`${styles['label-name']}${
                errors.password ? styles['invalid'] : ''
              }`}
            >
              經歷
            </div>
            <textarea
              className={`${styles['form-control']} ${styles['form-textarea']}`}
              type="text"
              name="lecturer_experience"
              placeholder="請輸入經歷 (必填)"
              value={lecturer.lecturer_experience}
              onChange={handleFieldChange}
              onBlur={handleBlur}
            ></textarea>
          </label>
          <div className={`${styles['error']}`}>
            {errors.lecturer_experience}
          </div>
        </div>

        <div className={`${styles['btn-group']}`}>
          <Link
            type="button"
            href="/member/lecturer-info"
            className={`${styles['cancel']}`}
          >
            取消
          </Link>
          <button type="submit" className={`${styles['submit']}`}>
            送出
          </button>
        </div>
      </form>
    </div>
  )
}
