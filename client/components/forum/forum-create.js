import React, { useEffect, useState } from 'react'
import styles from './forum-edit.module.scss'
import Image from 'next/image'
import validator from 'validator'
import Swal from 'sweetalert2'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Form from 'react-bootstrap/Form' //ReactBootstrap
import { getUserInfo } from '@/services/user.js'
import { useAuth } from '@/hooks/use-auth'

// 新增 -- (只會有一個post)

export default function ForumCreate() {
  const [lecturer, setLecturer] = useState([]) // 給予新的狀態
  const { auth } = useAuth()
  const [eq, setEq] = useState('') // 定義eq狀態

  // 選擇的檔案
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.isAuth) return
      try {
        const res = await getUserInfo()
        // console.log(res.data.user.exclusive_code) 檢查是否有exclusive_code
        setLecturer(res.data.user.exclusive_code)
        console.log(res.data.user.exclusive_code)
        setEq(res.data.user.exclusive_code)
      } catch (error) {
        console.error('載入使用者資料失敗：', error)
      }
    }
    fetchUserData()
  }, [auth])

  // 初始化值
  const forumData = {
    forum_title: '',
    forum_introduce: '',
    forum_article: '',
    forum_img: '',
    forum_hastag: '',
    forum_category_id: '',
    exclusive_code: '',
  }
  const router = useRouter()

  // // 表單填入的hook
  const [forum, setForum] = useState(forumData)

  // // 錯誤訊息的hook
  const [errors, setErrors] = useState(forumData)

  // 細節頁資訊
  const { category, fid } = router.query
  const [forumDetailData, setForumDetailData] = useState([])

  useEffect(() => {
    console.log(forum) // 檢查是否同步抓到表單輸入內容
  }, [forum])

  //formData內容 onChange隨時更新
  const handleFormDataChange = (fieldName) => (value) => {
    setForum({ ...forum, [fieldName]: value })
    console.log(forum)
  }
  const changeHandler = (e) => {
    //有檔案上傳時
    const file = e.target.files[0]
    // console.log(file)
    if (file) {
      setSelectedFile(file)
    } else {
      setSelectedFile(null)
    }
  }

  const createForum = () => {
    const token = localStorage.getItem('accessToken')
    // category為空且 fid 為空時
    if (!category && !fid) {
      const formData = new FormData()
      formData.append('forum_title', forum.forum_title)
      formData.append('forum_introduce', forum.forum_introduce)
      formData.append('forum_article', forum.forum_article)
      // formData.append('forum_img', forum.forum_img)
      formData.append('forum_img', selectedFile) //將文件添加到 FormData中
      formData.append('forum_hastag', forum.forum_hastag)
      formData.append('forum_category_id', forum.forum_category_id)
      formData.append('exclusive_code', eq)

      fetch(`http://127.0.0.1:3005/member/lecturer-forum/forum-create`, {
        method: 'post', // 新增
        // headers: {
        //   'Content-Type': 'application/json',
        //   Authorization: `Bearer ${token}`,
        // },
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  // 表單驗證規則
  const validateFields = (forum, errors, fieldname = '') => {
    const newErrors = {}
    Object.keys(errors).forEach((prop) => (newErrors[prop] = ''))

    if (validator.isEmpty(forum.forum_title, { ignore_whitespace: true })) {
      newErrors.forum_title ||= '標題為必填欄位'
    }

    if (
      validator.isEmpty(forum.forum_category_id, { ignore_whitespace: true })
    ) {
      newErrors.forum_category_id ||= '類別為必選欄位'
    }

    // if (validator.isEmpty(forumData.forum_img, { ignore_whitespace: true })) {
    //   newErrors.forum_img ||= '圖片為必選欄位'
    // }

    if (validator.isEmpty(forum.forum_introduce, { ignore_whitespace: true })) {
      newErrors.forum_introduce ||= '前言為必填欄位'
    }

    if (validator.isEmpty(forum.forum_article, { ignore_whitespace: true })) {
      newErrors.forum_article ||= '內文為必填欄位'
    }

    return fieldname
      ? { ...errors, [fieldname]: newErrors[fieldname] }
      : newErrors
  }

  // 判斷是否發生驗證問題
  const hasError = (errors, fieldname) => {
    return !!errors[fieldname]
  }
  //
  // 送出表單行為

  const handleSubmit = async (e) => {
    e.preventDefault()
    const inputs = e.target.elements
    const newErrors = validateFields(forum, errors)
    setErrors(newErrors)
    for (let i = 0; i < inputs.length; i++) {
      // if (
      //   inputs[i].nodeName === 'INPUT' &&
      //   hasError(newErrors, inputs[i].name)
      // ) {
      //   inputs[i].focus()
      //   return
      // }

      console.log('新增成功')
      Swal.fire({
        title: '確定要新增該文章嗎?',
        // text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#003e52',
        cancelButtonColor: '#d9d9d9',
        confirmButtonText: '確定送出',
        cancelButtonText: '返回修改',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: 'success',
            title: '新增成功',
            text: '已成功新增文章',
            confirmButtonColor: '#003e52',
          }).then((result) => {
            if (result.isConfirmed) {
              router.push('/member/forum-manage')
            }
          })
        }
      })
    }
    createForum()
  }

  // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  // 內文開始
  return (
    <>
      {/*  關閉eslint偵測 */}
      {/* eslint-disable */}
      <div className={`${styles['content']} container`}>
        <div
          className={`${styles['forum-title-list']} d-flex justify-content-between `}
        >
          <h3 className={`${styles['main-title']}`}>專欄資料</h3>
        </div>

        <form
          className={`${styles['main-content']}`}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div>
            <label className={`${styles['tabbar']}`}>
              <div className={`${styles['label-name']}`}>標題</div>
              <input
                className={`${styles['form-control']}`}
                type="text"
                name="forum_title"
                // placeholder="輸入文章標題"
                onBlur={(e) => {
                  setForum({ ...forum, forum_title: e.target.value })
                }}
              />
            </label>
            <div className={`${styles['error']}`}>{errors.forum_title}</div>
          </div>
          <div>
            <label className={`${styles['tabbar']}`}>
              <div className={`${styles['label-name']}`}>類別</div>

              <Form.Select
                size="sm"
                name="forum_category_id"
                onBlur={(e) => {
                  setForum({ ...forum, forum_category_id: e.target.value })
                }}
              >
                <option value="" disabled>
                  請選擇文章分類
                </option>
                <option value="1">基礎咖啡入門</option>
                <option value="2">手沖咖啡必讀</option>
                <option value="3">咖啡選豆指南</option>
                <option value="4">品味咖啡生活</option>
                <option value="5">咖啡器具相關</option>
              </Form.Select>
            </label>
            <div className={`${styles['error']}`}>
              {errors.forum_category_id}
            </div>
          </div>
          <div>
            <label className={`${styles['tabbar']}`}>
              <div className={`${styles['label-name']}`}>圖片</div>
              <input
                type="file"
                id="file"
                accept="image/*"
                className={`text-secondary ${styles['form-control']}`}
                name="forum_img"
                onChange={changeHandler}
                onBlur={(e) => {
                  setForum({ ...forum, forum_img: e.target.value })
                }}
              />
            </label>
            {/* <div className={`${styles['error']}`}>{errors.forum_img}</div> */}
          </div>

          <div>
            <label className={`${styles['tabbar']} tabbar-textarea`}>
              <div className={`${styles['label-name']}`}>標籤</div>
              <input
                className={`${styles['form-control']}`}
                type="text"
                name="forum_hastag"
                 style={{ height: 80 }}
                onBlur={(e) => {
                  setForum({ ...forum, forum_hastag: e.target.value })
                }}
              />
            </label>
            <div className={`${styles['error']}`} />
          </div>

          <div>
            <label className={`${styles['tabbar']} tabbar-textarea`}>
              <div className={`${styles['label-name']}`}>前言</div>
              <textarea
                className={`${styles['form-control']}`}
                type="text"
                name="forum_introduce"
                // placeholder="輸入內文前言"
                onBlur={(e) => {
                  setForum({ ...forum, forum_introduce: e.target.value })
                }}
                 style={{ height: 100 }}
              />
            </label>
            <div className={`${styles['error']}`}>{errors.forum_introduce}</div>

            <div>
              <label className={`${styles['tabbar']} tabbar-textarea`}>
                <div className={`${styles['label-name']}`}>內文</div>
                <textarea
                  className={`${styles['form-control']}`}
                  type="text"
                  name="forum_article"
                  // placeholder="輸入文章內容"
                   style={{ height: 300 }}

                  onBlur={(e) => {
                    setForum({ ...forum, forum_article: e.target.value })
                  }}
                />
              </label>
              <div className={`${styles['error']}`}>{errors.forum_article}</div>
            </div>
            {/*  */}
            <input
              type="hidden"
              name="exclusive_code"
              value={eq ? eq : ''} // 如果有值就顯示，否則留空字串
            />
            {/*  */}
            <div className={`${styles['btn-group']}`}>
              <Link
                type="button"
                href="/member/forum-manage"
                className={`${styles['cancel']}`}
              >
                取消
              </Link>
              <button type="submit" className={`${styles['submit']}`}>
                送出
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
