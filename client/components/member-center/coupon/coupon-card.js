import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import CouponCardLoader from './coupon-card-loader'
import { useRouter } from 'next/router'

// 優惠券狀態：1: 可使用  2: 未領取  3: 未兌換  4: 已失效

export default function CouponCard({
  couponData = {},
  couponStatus = undefined,
  showToast = () => {},
}) {
  const [buttonColor, setButtonColor] = useState('indigo')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  useEffect(() => {
    if (router.isReady) {
      setTimeout(() => {
        setLoading(true)
      }, 1000)
    }
  }, [router.isReady])
  const {
    coupon_id,
    coupon_img,
    coupon_name,
    coupon_point,
    coupon_threshold,
    coupon_discount,
    coupon_start,
    coupon_end,
    used_at,
    formatted_coupon_end,
    formatted_expire_at,
    formatted_used_at,
  } = couponData
  const exchangeCoupon = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3005/member/coupon`, {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${localStorage.accessToken}`,
        },
        body: JSON.stringify({
          coupon_id: coupon_id,
          coupon_point: coupon_point,
        }),
      })
      const result = await response.json()
      if (result.status === 'success') {
        Swal.fire({
          title: '兌換成功',
          text: `您已成功兌換${coupon_name}！`,
          icon: 'success',
          confirmButtonColor: '#003e52',
          confirmButtonText: '返回列表頁',
        })
      } else {
        Swal.fire({
          title: '兌換失敗',
          text: `${result.msg}`,
          icon: 'warning',
          confirmButtonColor: '#003e52',
          confirmButtonText: '返回列表頁',
        })
      }
    } catch (error) {
      throw new Error('兌換失敗')
    }
  }
  const showConfirmExchange = () => {
    Swal.fire({
      title: '確定要兌換嗎?',
      text: '兌換後，優惠券無法再次兌換成點數！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確定',
      confirmButtonColor: '#003e52',
      cancelButtonText: '取消',
      cancelButtonColor: '#d9d9d9',
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: 先檢查用戶點數是否足夠兌換

        // 對 "/" 發送 post 請求
        // 後端進行新增優惠券、扣除點數
        try {
          exchangeCoupon()
          Swal.fire({
            title: '兌換成功',
            text: `您已成功兌換${coupon_name}！`,
            icon: 'success',
            confirmButtonColor: '#003e52',
            confirmButtonText: '返回列表頁',
          })
        } catch (error) {
          console.log(error)
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: '取消兌換',
          text: '您已取消兌換',
          icon: 'info',
          confirmButtonColor: '#003e52',
          confirmButtonText: '返回列表頁',
        })
      }
    })
  }
  const getCoupon = () => {
    try {
      const insertData = async () => {
        const response = await fetch(`http://localhost:3005/member/coupon`, {
          method: 'post',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
          body: JSON.stringify({
            coupon_id: coupon_id,
            coupon_end: coupon_end,
            coupon_point: coupon_point,
          }),
        })
        const result = await response.json()
      }
      insertData()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="col-lg-6 col-12">
        <div
          className={
            couponStatus === 4
              ? 'd-flex coupon-card gray'
              : 'd-flex coupon-card'
          }
        >
          {!loading ? (
            <CouponCardLoader type={window.innerWidth > 576 ? true : false} />
          ) : (
            <>
              <div className="coupon-img">
                {coupon_img && <img src={`/coupon-img/${coupon_img}`} alt="" />}
              </div>
              <div className="coupon-group">
                {couponStatus !== 4 ? (
                  <>
                    <p className="coupon-title">{coupon_name}</p>
                    <p className="coupon-price">折價 ${coupon_discount}</p>
                    <p className="coupon-price">
                      消費滿 ${coupon_threshold} 可使用
                    </p>
                    <p className="coupon-intro">
                      有效期限：{formatted_coupon_end || '兌換後 7 日內'}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="coupon_title">{coupon_name}</div>
                    <p className="coupon-price">
                      {used_at
                        ? `已於 ${formatted_used_at} 使用`
                        : `已於 ${formatted_expire_at} 過期`}
                    </p>
                  </>
                )}

                {couponStatus === 2 || couponStatus === 3 ? (
                  <button
                    className={`redeemButton ${buttonColor}`}
                    onClick={() => {
                      if (buttonColor === 'indigo') {
                        // 如果是可兌換的優惠券，跳出 swal
                        // 確認後對 "/" 進行 put 請求
                        // 後端進行加入優惠券以及扣除點數
                        if (couponStatus === 3) {
                          showConfirmExchange()
                          // 如果是可領取的優惠券
                          // 對"/" 進行 put 請求
                          // 後端進行加入優惠券
                        } else {
                          try {
                            getCoupon()
                            showToast('領取成功')
                            setButtonColor('gray')
                          } catch (error) {
                            console.error(error)
                          }
                        }
                      }
                    }}
                  >
                    {couponStatus === 2 && '領取'}
                    {couponStatus === 3 && '兌換'}
                  </button>
                ) : (
                  ''
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>
        {`
          /* 按鈕顏色模組 */
          .indigo {
            background: #003e52;
          }
          .gray {
            background: #d9d9d9;
          }

          p {
            margin-block: 5px;
          }
          .coupon-card {
            position: relative;
            height: 150px;
            box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.25);
            padding: 0;
          }

          .coupon-card img {
            width: 148px;
            height: 100%;
          }

          .coupon-group {
            display: flex;
            flex-direction: column;
            margin-left: 1rem;
            justify-content: center;
          }

          .coupon-group .coupon-title {
            color: #bc955c;
            font-size: 20px;
            font-weight: 500;
            line-height: 20px;
            margin-block: 5px;
          }

          .coupon-group .coupon-price {
            color: #003e52;
            font-size: 16px;
            line-height: 15px;
            margin-block: 5px;
          }

          .coupon-group .coupon-intro {
            color: #d9d9d9;
            font-size: 14px;
            line-height: 15px;
            margin-block: 5px;
          }

          .redeemButton {
            border: 0;
            color: #f2f2f2;
            font-size: 14px;
            position: absolute;
            display: flex;
            width: 65px;
            padding: 5px 12px;
            justify-content: center;
            align-items: center;
            top: 10px;
            right: 10px;
            text-decoration: none;
          }
          @media screen and (max-width: 576px) {
            .coupon-card img {
              width: 120px;
              height: 100%;
            }

            .coupon-group .coupon-title {
              font-size: 18px;
            }

            .coupon-group .coupon-price {
              font-size: 14px;
            }

            .coupon-group .coupon-intro {
              font-size: 12px;
            }

            .redeemButton {
              width: 50px;
              height: 25px;
              font-size: 12px;
            }
          }
        `}
      </style>
    </>
  )
}
