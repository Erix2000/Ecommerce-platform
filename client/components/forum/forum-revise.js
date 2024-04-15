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
// 修改 -- (先get 再put)

export default function ForumRevise({ forumDetailData = [] }) {
  const router = useRouter()
  const fid = router.query.fid
  const category = router.query.category
  const [lecturer, setLecturer] = useState([]) // 給予新的狀態
  const { auth } = useAuth()
  const [eq, setEq] = useState('') // 定義eq狀態

  // 表單填入的hook
  const [forum, setForum] = useState(forumDetailData[0])

  // 錯誤訊息的hook
  const [errors, setErrors] = useState(forumDetailData)

  // 標題
  const [forumTitle, setForumTitle] = useState('')
  // 類別
  // const [forumCategory, setForumCategory] = useState('')
  const [forumCategory, setForumCategory] = useState(
    forumDetailData[0]?.forum_category_id || ''
  )
  // 圖片
  const [forumImage, setForumImage] = useState('')
  // 標籤
  const [forumHastag, setForumHastag] = useState('')
  // 前言
  const [forumIntroduce, setForumIntroduce] = useState('')
  // 內文
  const [forumArticle, setForumArticle] = useState('')

  useEffect(() => {
    console.log(forum) // 檢查是否同步抓到表單輸入內容
    setForumTitle(forum?.forum_title)
    //console.log(forum?.forum_title);
    setForumCategory(forum?.forum_category_id)
    setForumImage(forum?.forum_img)
    setForumHastag(forum?.forum_hastag)
    setForumIntroduce(forum?.forum_introduce)
    setForumArticle(forum?.forum_article)
  }, [forum])

  useEffect(() => {
    //物件陣列[{}]
    setForum(forumDetailData[0])
  }, [forumDetailData])

  //   useEffect(() => {
  //     const fetchUserData = async () => {
  //       if (!auth.isAuth) return
  //       try {
  //         const res = await getUserInfo()
  //         setLecturer(res.data.user.exclusive_code)
  //         // 檢查是否有exclusive_code
  //         console.log(res.data.user.exclusive_code)
  //         setEq(res.data.user.exclusive_code)
  //       } catch (error) {
  //         console.error('載入使用者資料失敗：', error)
  //       }
  //     }
  //     fetchUserData()
  //   }, [auth])

  const reviseForum = () => {
    // category為空且 fid 為空時
    // if (!category && !fid) {
    fetch(`http://127.0.0.1:3005/member/lecturer-forum/forum-revise`, {
      method: 'put', // 新增
      headers: { 'Content-type': 'application/json' }, //必加!!!
      body: JSON.stringify(forum),
      // body: JSON.stringify({ ...forum, exclusive_code: eq }), // 包含exclusive_code
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
      })
      .catch((error) => {
        console.log(error)
      })
    //}
  }
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForum({ ...forum, forum_img: file })
    }
  }
  // -----------------
  // 表單驗證規則
  const validateFields = (forum, errors, fieldname = '') => {
    const newErrors = {}
    Object.keys(errors).forEach((prop) => (newErrors[prop] = ''))

    if (validator.isEmpty(forum[0]?.forum_title, { ignore_whitespace: true })) {
      newErrors.forum_title ||= '標題為必填欄位'
    }

    if (
      validator.isEmpty(forum[0]?.forum_category_id, {
        ignore_whitespace: true,
      })
    ) {
      newErrors.forum_category_id ||= '類別為必選欄位'
    }

    // if (validator.isEmpty(forumData.forum_img, { ignore_whitespace: true })) {
    //   newErrors.forum_img ||= '圖片為必選欄位'
    // }

    if (
      validator.isEmpty(forum[0]?.forum_introduce, { ignore_whitespace: true })
    ) {
      newErrors.forum_introduce ||= '前言為必填欄位'
    }

    if (
      validator.isEmpty(forum[0]?.forum_article, { ignore_whitespace: true })
    ) {
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

  // 送出表單行為

  const handleSubmit = async (e) => {
    e.preventDefault()
    const inputs = e.target.elements
    // const newErrors = validateFields(forum, errors)
    // setErrors(newErrors)
    for (let i = 0; i < inputs.length; i++) {
      //   if (
      //     inputs[i].nodeName === 'INPUT' &&
      //     hasError(newErrors, inputs[i].name)
      //   ) {
      //     inputs[i].focus()
      //     return
      //   }
      // }
      Swal.fire({
        title: '確定要修改文章嗎?',
        // text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#003e52',
        cancelButtonColor: '#d9d9d9',
        confirmButtonText: '確定',
        cancelButtonText: '返回',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: 'success',
            title: '修改完成',
            text: '已成功修改文章',
            confirmButtonColor: '#003e52',
          }).then((result) => {
            if (result.isConfirmed) {
              router.push('/member/forum-manage')
            }
          })
        }
      })
    }
    reviseForum()
    // 加入導頁
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
          method="post"
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
                placeholder="輸入文章標題"
                value={forumTitle}
                onChange={(e) => {
                  setForumTitle(e.target.value)
                }}
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
                value={forumCategory}
                onChange={(e) => {
                  setForumCategory(e.target.value)
                }}
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
                className={`text-secondary ${styles['form-control']}`}
                name="forum_img"
                onChange={(e) => {
                  const file = { forumImage } // 獲取選擇的文件
                  setForumImage(e.target.value) // 將文件設置為表單狀態中的圖片
                }}
                onBlur={(e) => {
                  // 不需要設置 'value' 屬性
                  setForum({ ...forum, forum_img: e.target.value })
                }}
              />
            </label>
            <div className={`${styles['error']}`}>
              {/* {errors.forum_img} */}
            </div>
          </div>

          <div>
            <label className={`${styles['tabbar']} tabbar-textarea`}>
              <div className={`${styles['label-name']}`}>標籤</div>
              <input
                className={`${styles['form-control']}`}
                type="text"
                name="forum_hastag"
                placeholder="至多輸入三樣..."
                style={{ height: 30 }}
                value={forumHastag}
                onChange={(e) => {
                  setForumHastag(e.target.value)
                }}
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
                placeholder="輸入內文前言"
                style={{ height: 80 }}
                value={forumIntroduce}
                onChange={(e) => {
                  setForumIntroduce(e.target.value)
                }}
                onBlur={(e) => {
                  setForum({ ...forum, forum_introduce: e.target.value })
                }}
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
                  placeholder="輸入文章內容"
                  style={{ height: 300 }}
                  value={forumArticle}
                  onChange={(e) => {
                    setForumArticle(e.target.value)
                  }}
                  onBlur={(e) => {
                    setForum({ ...forum, forum_article: e.target.value })
                  }}
                />
              </label>
              <div className={`${styles['error']}`}>{errors.forum_article}</div>
            </div>
            {/*  */}
            {/* <input
              type="hidden"
              name="exclusive_code"
              value={eq ? eq : ''} // 如果有值就顯示，否則留空字串
            /> */}
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
