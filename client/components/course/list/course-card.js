import Image from 'next/image'
import React, { useState, useEffect } from 'react'

import LikeFill from '@/assets/img/product/icon/like-fill.svg'
import LikeStroke from '@/assets/img/product/icon/like-stroke.svg'
import Link from 'next/link'

import { useCart } from '@/hooks/use-cart'
import { useRouter } from 'next/router'

// 會員鉤子
import { useAuth } from '@/hooks/use-auth'

import Swal from 'sweetalert2'

export default function CourseFavorite({
  courseItem = {},
  userLikeArr = [],
  courseFavoriteList = [],
  setCourseFavoriteList = () => {},
  likeNotify = () => {},
  unlikeNotify = () => {},
}) {
  const { auth } = useAuth()

  const router = useRouter()
  const { addItem, Toaster } = useCart()
  const [isLoading, setIsLoading] = useState(true)
  const [imgArr, setImgArr] = useState([])

  // 愛心hover功能
  const [likeHover, setLikeHover] = useState(false)
  // 愛心active功能
  const [likeActive, setLikeActive] = useState(false)

  const token = localStorage.getItem('accessToken')

  // console.log(auth.userData.user_id)

  // 取消收藏
  let unlike = () => {
    // 刪除愛心
    fetch(`http://localhost:3005/course/clike`, {
      method: 'DELETE',
      body: JSON.stringify({
        user_id: auth.userData.user_id,
        item_id: courseItem.course_id,
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
    const newCourseFavoriteList = courseFavoriteList.filter(
      (v) => v.course_id !== courseItem.course_id
    )
    setCourseFavoriteList(newCourseFavoriteList)
  }

  // 加入收藏
  let like = () => {
    console.log(courseItem.course_id)

    // 加入愛心
    fetch(`http://localhost:3005/course/clike`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: auth.userData.user_id,
        item_id: courseItem.course_id,
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
    console.log(123)
  }

  const { category } = router.query

  let Arr
  useEffect(() => {
    // console.log(userLikeArr)
    // console.log(productItem.product_id)
    setLikeHover(false)
    setLikeActive(false)

    if (auth.isAuth) {
      if (userLikeArr.includes(courseItem.course_id.toString())) {
        setLikeHover(true)
        setLikeActive(true)
      }
    }

    setIsLoading(true)
    // setImgArr(Arr)
  }, [router.isReady, category, courseItem.course_img, userLikeArr])
  // let Arr

  // useEffect(() => {
  //   setIsLoading(true)ｚ
  //   Arr = courseItem.course_img.split(",")
  //   console.log(courseItem)
  //   setImgArr(Arr)

  // }, [router.isReady])

  const dateStartRender = new Date(courseItem.course_date_start.split('T')[0])
  const dateStart = `${dateStartRender.getFullYear()}/${
    dateStartRender.getMonth() + 1
  }/${dateStartRender.getDate() + 1}`

  return (
    <>
      <div className="col-lg-3 col-6">
        <div className="pcard">
          <Link
            style={{
              aspectRatio: '1/1',
              position: 'relative',
              display: 'block',
            }}
            className="cardImg w-100 ratio-1x1"
            href={`/course/${courseItem.course_category_id}/${courseItem.course_id}`}
          >
            <img
              style={{ aspectRatio: '1/1', objectFit: 'cover' }}
              src={`/course-img/${courseItem.course_img}`}
              className="product-img w-100 h-100"
              alt="..."
            />
            {likeHover ? (
              <Image
                // 照片二
                className="like"
                style={{
                  position: 'absolute',
                  width: '30px',
                  height: '30px',
                  bottom: '5% !important',
                  right: '5% !important',
                }}
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
                className="like"
                style={{
                  position: 'absolute',
                  width: '30px',
                  height: '30px',
                  bottom: '5%',
                  right: '5%',
                  backgroundColor: 'fff',
                }}
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
          </Link>
          <div className="card-body">
            <div className="card-body-top">
              {/* 課程標題 */}
              <div className="pcard-title">{courseItem.course_name}</div>
              <div className="pcard-intro">
                {/* 課程教室 */}
                <div>{courseItem.course_location}|</div>
                {/* 開課日期 */}
                <div>{dateStart}</div>
              </div>
              {/* 課程定價 */}
              <div className="discount">
                NT${courseItem.course_price}&nbsp;
                {/* 課程折扣價 */}
                <span className="pcard-price">
                  NT${courseItem.course_origin_price}
                </span>
              </div>
            </div>

            <button
              className="add-cart link"
              onClick={() => {
                if (auth.isAuth) {
                  addItem({ ...courseItem, item_type: 'course' })
                } else {
                  Swal.fire({
                    icon: 'info',
                    color: '#003e52',
                    title: '尚未登入，無法加入購物車',
                    // text: '已成功登入',
                    buttonsStyling: true,
                    confirmButtonColor: '#003e52',
                    confirmButtonText: '我已了解',
                  })
                  // router.push("/member/login")
                }
              }}
            >
              預約課程
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media screen and (max-width: 1200px) {
          .card-body {
            font-size: 16px !important;
            .discount {
              font-size: 12px !important;
            }
          }

          .like {
            width: 23px !important;
          }

          .add-cart {
            height: 37px !important;
            font-size: 14px !important;
          }
        }
        .pcard {
          font-size: 16px;
          margin-block: 10px;

          .cardImg {
            display: inline-block;
            display: flex;
            position: relative;
            aspect-ratio: 1/1 !important;

            .like {
              position: absolute;
              width: 30px;
              bottom: 5% !important;
              right: 5% !important;
            }
            .product-img {
              width: 100%;
              aspect-ratio: 1/1 !important;
            }
          }

          .card-body {
            font-size: 20px;

            .card-body-top {
              display: flex;
              justify-content: space-between;
              flex-direction: column;
              height: 150px;
            }

            .pcard-title {
              margin-top: 10px !important;
              font-size: 18px;
            }

            .pcard-intro {
              font-size: 16px;
              display: flex;
              letter-spacing: 0.15rem;
            }

            .discount {
              margin-top: 5px;
              margin-bottom: 10px !important;
              text-align: end;
              color: #e82727;

              .pcard-price {
                font-size: 12px;
                color: #003e52;
                text-decoration: line-through;
              }
            }
            .add-cart {
              font-size: 20px;
              width: 100%;
              height: 55px;
              color: #ffffff;
              background-color: #003e52;
              display: flex;
              align-items: center;
              justify-content: center;
              letter-spacing: 0.18rem;
              margin-top: 10px;

              &:hover {
                color: #003e52;
                background-color: #ffffff;
                border: 2px solid #003e52;
              }
            }
          }
        }
      `}</style>
    </>
  )
}
