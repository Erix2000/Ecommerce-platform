import React, { useEffect, useState } from 'react'
import styles from './forum-page.module.scss'
import Image from 'next/image'
import Swal from 'sweetalert2'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { getUserInfo } from '@/services/user.js'
import { useAuth } from '@/hooks/use-auth'

export default function ForumPage({ forumDetailData = {} }) {
  const router = useRouter() // 從網址來就用 useRouter 查看老師講義 Rounter is Ready?
  const fid = router.query.fid
  const category = router.query.category
  const [articleDatas, setArticleDatas] = useState([])
  const [kind, setKind] = useState([])

  //獲取 exclusive_code -------------------------------
  const [lecturer, setLecturer] = useState([])
  const { auth } = useAuth()
  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.isAuth) return
      try {
        const res = await getUserInfo()
        setLecturer(res.data.user.exclusive_code)
        // 檢查是否有exclusive_code
        console.log(res.data.user.exclusive_code)
      } catch (error) {
        console.error('載入使用者資料失敗：', error)
      }
    }
    fetchUserData()
  }, [auth])
  //-----------------------------------------------------

  // 查看 forumDetailData 所有內容
  console.log(forumDetailData)
  console.log(forumDetailData[0].exclusive_code)

  // 删除文章的函数
  const handleDelete = async () => {
    const confirmDelete = await Swal.fire({
      title: '刪除後文章將消失',
      text: '確定要刪除文章嗎？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#d9d9d9',
      confirmButtonText: '刪除',
      cancelButtonText: '取消',
    })

    if (confirmDelete.isConfirmed) {
      try {
        const response = await fetch(
          'http://127.0.0.1:3005/member/lecturer-forum/forum-delete',
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ forum_id: forumDetailData[0].forum_id }),
          }
        )

        if (response.ok) {
          const data = await response.json()
          console.log('刪除成功', data)
          router.push('/member/forum-manage')
          Swal.fire({
            icon: 'success',
            title: '刪除成功',
            // text: data.message,
            text: '已成功刪除文章',
            confirmButtonColor: '#003e52',
          })
        } else {
          console.error('刪除文章失敗')
        }
      } catch (error) {
        console.error('刪除文章時發生錯誤', error)
      }
    }
  }

  // 內文開始
  return (
    <>
      {/*  關閉eslint偵測 */}
      {/* eslint-disable */}
      <div className={`container ${styles['content']}`}>
        <div className={`container py-5`}>
          <div className={`${styles['forum-content']}`}>
            <div className=" ">
              <h1 className="p-2">{forumDetailData[0].forum_title}</h1>
              <div className="py-2 lead ">
                <div className="lead text-info text-start fs-6 ">
                  {/* p-2 間距可在調整 */}
                  <div className={`${styles['forum-writer']}`}>
                    <span className={`${styles['forum-writer-name']}`}>
                      {forumDetailData[0].lecturer_name}
                    </span>
                    <span
                      className={`text-dark pl-2 ${styles['forum-publish']}`}
                    >
                      發表於&nbsp;
                    </span>
                    <span
                      className={`${styles['forum-category']}`}
                      onClick={() => {
                        // 頁面跳轉
                        router.push(
                          `/forum/${forumDetailData[0].forum_category_id}`
                        )
                      }}
                    >
                      {forumDetailData[0].forum_category_name}
                    </span>
                    <span className={`${styles['forum-time']}`}>
                      {forumDetailData[0].forum_modified_at}
                    </span>
                    {lecturer ===
                      forumDetailData[0].exclusive_code && (
                      <>
                        <Link
                          type="button"
                          href={`/forum/forum-revise/${category}/${fid}`}
                        >
                          <i
                            className={`bi bi-pencil-square ${styles['forum-edit']}`}
                          ></i>
                        </Link>
                        <Link
                          type="button"
                          href={`#`}
                          // 刪除文章
                          onClick={() => handleDelete()}
                        >
                          <i
                            className={`bi bi-trash3 ${styles['trash-icon']}`}
                          ></i>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={`pb-5 pt-5 lead ${styles['forum-introduce']}`}>
                <h3 className="lead ">{forumDetailData[0].forum_introduce}</h3>
              </div>
              <Image
                className=" mb-5 "
                // src={`/forum-img/${forumDetailData[0].forum_img}`}
                src={`http://localhost:3005/forum/${forumDetailData[0].forum_img}`}
                width={1070}
                height={600}
                alt=""
              />
              {/* 內文開始 */}
              <p className="">{forumDetailData[0].forum_article}</p>
              {/* 內文結束 */}
              <div className={`${styles['btn-group']}`}>
                <Link
                  type="button"
                  href={`/forum/list`}
                  // 導回forum列表

                  className={`${styles['back']}`}
                >
                  返回
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
//}
