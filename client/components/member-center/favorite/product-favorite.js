import Image from 'next/image'
import React, { useState, useEffect } from 'react'

import LikeFill from '@/assets/img/product/icon/like-fill.svg'
import LikeStroke from '@/assets/img/product/icon/like-stroke.svg'
import Link from 'next/link'

import { useCart } from '@/hooks/use-cart'
import { useRouter } from 'next/router'

// import toast, { Toaster } from 'react-hot-toast'

// 會員鉤子
import { useAuth } from '@/hooks/use-auth'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import CouponStatusSelector from '../coupon/coupon-status-selector'

export default function ProductFavorite({
  productItem = {},
  userLikeArr = [],
  productFavoriteList = [],
  setProductFavoriteList = () => {},
  nowPage = 1,
  likeNotify = () => {},
  unlikeNotify = () => {},
}) {
  const { auth } = useAuth()
  const MySwal = withReactContent(Swal)

  const router = useRouter()
  const { addItem, Toaster } = useCart()
  const [isLoading, setIsLoading] = useState(true)
  const [imgArr, setImgArr] = useState([])
  const [nnpage, setnnpage] = useState(nowPage)

  // 愛心hover功能
  const [likeHover, setLikeHover] = useState(false)
  // 愛心active功能
  const [likeActive, setLikeActive] = useState(false)

  const token = localStorage.getItem('accessToken')

  console.log(auth.userData.user_id)

  // 取消收藏
  let unlike = () => {
    // 刪除愛心
    fetch(`http://localhost:3005/product/plike`, {
      method: 'DELETE',
      body: JSON.stringify({
        user_id: auth.userData.user_id,
        item_id: productItem.product_id,
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
    const newProductFavoriteList = productFavoriteList.filter(
      (v) => v.product_id !== productItem.product_id
    )
    setProductFavoriteList(newProductFavoriteList)
  }

  // 加入收藏
  let like = () => {
    console.log(productItem.product_id)

    // 加入愛心
    fetch(`http://localhost:3005/product/plike`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: auth.userData.user_id,
        item_id: productItem.product_id,
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

  let Arr
  let category = router.query.category

  // if(auth.isAuth){

  //   if(userLikeArr.includes(productItem.product_id.toString())){
  //     setLikeHover(true)
  //     setLikeActive(true)
  //   }
  // }

  useEffect(() => {
    // console.log(userLikeArr)
    // console.log(productItem.product_id)
    setLikeHover(false)
    setLikeActive(false)

    if (auth.isAuth) {
      console.log(1111)
      console.log(userLikeArr)

      if (userLikeArr.includes(productItem.product_id.toString())) {
        setLikeHover(true)
        setLikeActive(true)
        console.log(11111)
      }
    }
    Arr = productItem.product_img.split(',')
    setIsLoading(true)
    setImgArr(Arr)
  }, [router.isReady, category, productItem.product_img, userLikeArr])

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
            href={`/product/${productItem.brand_id}/${productItem.product_code}`}
          >
            <img
              style={{ aspectRatio: '1/1' }}
              src={`/product-img/product/${productItem.brand_id}/pro/${imgArr[0]}`}
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
                    MySwal.fire({
                      title: <>{`尚未登入，無法收藏商品`}</>,

                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#003e52',
                      cancelButtonColor: '#808080',
                      confirmButtonText: '前往登入',
                      cancelButtonText: '繼續逛逛',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        router.push('/member/login')
                      }
                    })
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
                    MySwal.fire({
                      title: <>{`尚未登入，無法收藏商品`}</>,

                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#003e52',
                      cancelButtonColor: '#808080',
                      cancelButtonText: '繼續逛逛',
                      confirmButtonText: '前往登入',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        router.push('/member/login')
                      }
                    })
                  }
                }}
              />
            )}
          </Link>
          <div className="card-body">
            <div className="card-body-top">
              <div className="pcard-title">{productItem.product_name}</div>
              <div className="pcard-price">
                NT${productItem.product_price}&nbsp;
                <span className="discount">
                  NT${productItem.product_origin_price}
                </span>
              </div>
            </div>

            <button
              className="add-cart link"
              onClick={() => {
                if (auth.isAuth) {
                  addItem({ ...productItem, item_type: 'product' })
                } else {
                  MySwal.fire({
                    title: <>{`尚未登入，無法加入購物車`}</>,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#003e52',
                    cancelButtonColor: '#808080',
                    confirmButtonText: '前往登入',
                    cancelButtonText: '繼續逛逛',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      router.push('/member/login')
                    }
                  })
                }
              }}
            >
              加入購物車
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

            .card-body-top {
              height: 100px !important;
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
          letter-spacing: 0.18rem;

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
              height: 120px;
            }

            .pcard-title {
              margin-top: 10px !important;
            }

            .pcard-price {
              margin-bottom: 10px !important;
              text-align: end;
              color: #e82727;

              .discount {
                font-size: 14px;
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
