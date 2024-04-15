import React, { useEffect, useState } from 'react'
import styles from '@/components/member-center/favorite/favorite.module.scss'
import Image from 'next/image'

import LikeFill from '@/assets/img/product/icon/like-fill.svg'
import LikeStroke from '@/assets/img/product/icon/like-stroke.svg'
import Link from 'next/link'

// import { useCart } from '@/hooks/use-cart'
import { useRouter } from 'next/router'

// 會員鉤子
import { useAuth } from '@/hooks/use-auth'

import Swal from 'sweetalert2'
//function ArticleFavorite({ forumData = {}, userLikeArr = {} })

//--------------
export default function ArticleFavorite({
  forumData = {},
  userLikeArr = [],
  currentPage = {},
  articleFavoriteList = [],
  setArticleFavoriteList = () => {},
  likeNotify = () => {},
  unlikeNotify = () => {},

  nowPage = 1,
  // -----------------
}) {
  const router = useRouter() // 從網址來就用 useRouter 查看老師講義 Rounter is Ready?
  const fid = router.query.fid
  const category = router.query.category
  const { auth } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [imgArr, setImgArr] = useState([])
  // const [page,setpage] = useState(nowPage)
  // 查看 forumData 所有內容
  // console.log(forumData)
  // 查看 收藏功能有無成功
   //console.log(userLikeArr);
  // -------------------------------
  // 愛心hover功能
  const [likeHover, setLikeHover] = useState(false)
  // 愛心active功能
  const [likeActive, setLikeActive] = useState(false)

  const token = localStorage.getItem('accessToken')

  // 取消收藏
  let unlike = () => {
    // 刪除愛心
    fetch(`http://localhost:3005/forum/flike`, {
      method: 'DELETE',
      body: JSON.stringify({
        user_id: auth.userData.user_id,
        forum_id: forumData.forum_id,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        const newArticleFavoriteList = articleFavoriteList.filter(
          (v) => v.forum_id !== forumData.forum_id
        )
        setArticleFavoriteList(newArticleFavoriteList)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // 加入收藏
  let like = () => {
    // console.log(forumData.forum_id)

    // 加入愛心
    fetch(`http://localhost:3005/forum/flike`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: auth.userData.user_id,
        forum_id: forumData.forum_id,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    // console.log(userLikeArr)
    //console.log(forumData.forum_id)
    setLikeHover(false)
    setLikeActive(false)

    if (auth.isAuth) {
      if (userLikeArr.includes(forumData.forum_id.toString())) {
        setLikeHover(true)
        setLikeActive(true)
      }
    }

  }, [router.isReady, category, userLikeArr, auth, currentPage])
  // -------------------------------
  return (
    <>
      {/*  關閉eslint偵測 */}
      {/* eslint-disable */}
      <div className={`card mb-5 ${styles['card']}`}>
        <div className="row g-0">
          <div
            className="col-md-4"
            onClick={() => {
              // 頁面跳轉
              router.push(
                `/forum/${forumData.forum_category_id}/${forumData.forum_id}`
              )
            }}
          >
            <Image
              className=" mb-5 "
              // src={`/forum-img/${forumData.forum_img}`}
              src={`http://localhost:3005/forum/${forumData.forum_img}`}
              width={350}
              height={250}
              style={{ width: '350px', height: '250px' }}
              // priority 屬性的圖片會被瀏覽器優先加載
              alt=""
            />
          </div>
          <div className={`col-md-8 ${styles['forum']}`}>
            <div className="card-body">
              <div
                className={`card-title ${styles['card-title']}`}
                onClick={() => {
                  // 頁面跳轉
                  router.push(
                    `/forum/${forumData.forum_category_id}/${forumData.forum_id}`
                  )
                }}
              >
                {/* 標題 */}
                <h4>{forumData.forum_title}</h4>
              </div>
              <p
                className={`card-text ${styles['card-text']}`}
                onClick={() => {
                  // 頁面跳轉
                  router.push(
                    `/forum/${forumData.forum_category_id}/${forumData.forum_id}`
                  )
                }}
              >
                {/* 前言 */}
                {forumData.forum_introduce}
              </p>
              <div className="d-flex justify-content-between align-items-end">
                <div
                  className={`card-text d-flex flex-column ${styles['card-info']}`}
                >
                  <div>
                    {/* 作者 */}
                    <span className={`${styles['forum-writer']}`}>
                      {forumData.lecturer_name}
                    </span>
                    {/* 專欄分類 */}
                    發布於{' '}
                    <span
                      className={`${styles['forum-category']}`}
                      onClick={() => {
                        // 頁面跳轉
                        router.push(`/forum/${forumData.forum_category_id}`)
                      }}
                    >
                      {forumData.forum_category_name}
                    </span>
                  </div>
                  {/* 日期 */}
                  <div className={`${styles['forum-time']}`}>
                    {forumData.forum_modified_at}
                  </div>
                  <div className={`d-flex gap-3 ${styles['forum-tag']}`}>

                    <div className={styles['tag1']}>
                      #{forumData.forum_hastag.slice(0, 2)}
                    </div>

                    <div className={styles['tag2']}>
                      #{forumData.forum_hastag.slice(3, 6)}
                    </div>

                    <div className={styles['tag3']}>
                      #{forumData.forum_hastag.slice(6)}
                    </div>
                  </div>
                </div>
                <div className={styles['favorite-button']}>

                  {likeHover ? (
                    <Image
                      // 照片二
                      className={styles['favorite-button']}
                      src={LikeFill}
                      alt="Hover Image"
                      onMouseOut={() => {
                        if (likeActive) {
                          setLikeHover(true)
                        } else {
                          setLikeHover(false)
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        if (auth.isAuth) {
                          if (likeActive) {
                            setLikeHover(false)
                            setLikeActive(false)
                            unlikeNotify()
                            unlike()
                          } else {
                            setLikeHover(true)
                            setLikeActive(true)
                            likeNotify()
                            like()
                          }
                        } else {
                          router.push('/member/login')
                        }
                      }}
                    />
                  ) : (
                    <Image
                      // 照片一
                      className={styles['favorite-button']}

                      src={LikeStroke}
                      alt="Normal Image"
                      onMouseOver={() => {
                        setLikeHover(true)
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        if (auth.isAuth) {
                          setLikeHover(true)
                          setLikeActive(true)
                          likeNotify()
                          like()
                        } else {
                          router.push('/member/login')
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
//}
