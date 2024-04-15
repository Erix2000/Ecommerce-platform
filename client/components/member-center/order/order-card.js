import React, { useEffect } from 'react'
// import styles from '@/styles/member-center.module.scss'
import '@/styles/home.module.scss'

import Swal from 'sweetalert2'
import OrderStatusIndicator from './order-status-indicator'
import { padStart } from 'lodash'

export default function OrderCard({
  orderData = {},
  orderDatas = { orderDatas },
  setOrderDatas = { setOrderDatas },
}) {
  // 從 order-product 資料庫抓取成物件陣列 orderProducts(order_id === order_id)
  // 取出第一個物件並從 product 資料庫抓取成物件陣列 (product_id === product_id)
  let orderStatus, orderStatusCode
  let {
    order_id,
    post_method,
    post_address,
    total_cost,
    used_points,
    created_at,
    canceled_at,
    posted_at,
    arrived_at,
    finished_at,
    returned_at,
    payment_at,
    formatted_created_at,
    formatted_canceled_at,
    formatted_posted_at,
    formatted_arrived_at,
    formatted_finished_at,
    formatted_returned_at,
  } = orderData

  let today = new Date()
  const day = today.getDate()
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const year = today.getFullYear()
  const formatted_today = `${year}-${month}-${day}`

  let expireDay = new Date()
  if (finished_at) {
    // expireDay.setDate(finished_at.getDate() + 7)
    const finishedAt = new Date(finished_at)
    expireDay = new Date(finishedAt.setDate(finishedAt.getDate() + 7))
  }

  if (returned_at) {
    orderStatus = '已退貨'
    orderStatusCode = 6
  } else if (finished_at) {
    orderStatus = '已完成'
    orderStatusCode = 4
  } else if (arrived_at) {
    orderStatus = '已送達'
    orderStatusCode = 3
  } else if (canceled_at) {
    orderStatus = '已取消'
    orderStatusCode = 5
  } else if (posted_at) {
    orderStatus = '已出貨'
    orderStatusCode = 2
  } else {
    orderStatus = '成立'
    orderStatusCode = 1
  }
  const showConfirmReturn = () => {
    Swal.fire({
      title: '確定要退貨嗎?',
      text: '該訂單使用過的優惠券將不會退還！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確定',
      confirmButtonColor: '#003e52',
      cancelButtonText: '取消',
      cancelButtonColor: '#d9d9d9',
    }).then((result) => {
      if (result.isConfirmed) {
        const returnOrder = async () => {
          try {
            // 修改資料庫資料 (新增對應訂單的退貨日期)
            const result = await fetch(`http://127.0.0.1:3005/member/order`, {
              method: 'delete',
              headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${localStorage.accessToken}`,
              },
              body: JSON.stringify({
                order_id: order_id,
                used_points: used_points,
                total_cost: total_cost,
              }),
            })
            const newOrderDatas = orderDatas.map((v, i) => {
              if (v.order_id === order_id) {
                return {
                  ...v,
                  returned_at: today,
                  formatted_returned_at: formatted_today,
                }
              } else {
                return { ...v }
              }
            })
            setOrderDatas(newOrderDatas)
            // 跳出退貨成功的 sweet alert 視窗
            Swal.fire({
              title: '退貨成功',
              text: `您已成功退貨，退貨的訂單編號為 ${order_id}`,
              icon: 'success',
              confirmButtonColor: '#003e52',
              confirmButtonText: '返回列表頁',
            })
          } catch (error) {
            console.log(error)
          }
        }
        returnOrder()
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: '取消',
          text: '訂單未退貨！',
          icon: 'info',
          confirmButtonColor: '#003e52',
          confirmButtonText: '返回列表頁',
        })
      }
    })
  }
  const showConfirmCancel = () => {
    const confirmCancel = Swal.fire({
      title: '確定要取消嗎?',
      text: '該訂單使用過的優惠券將不會退還！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確定',
      confirmButtonColor: '#003e52',
      cancelButtonText: '取消',
      cancelButtonColor: '#d9d9d9',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '取消訂單成功',
          text: `您已成功退貨，退貨的訂單編號為 ${order_id}`,
          icon: 'success',
          confirmButtonColor: '#003e52',
          confirmButtonText: '返回列表頁',
        })
        const newOrderDatas = orderDatas.map((v, i) => {
          if (v.order_id === order_id) {
            return {
              ...v,
              canceled_at: today,
              formatted_canceled_at: formatted_today,
            }
          } else {
            return { ...v }
          }
        })
        setOrderDatas(newOrderDatas)
        // setOrderDatas(newOrderDatas)
        const cancelOrder = async () => {
          try {
            const result = await fetch(`http://127.0.0.1:3005/member/order`, {
              method: 'put',
              headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${localStorage.accessToken}`,
              },
              body: JSON.stringify({
                order_id: order_id,
                used_points: used_points,
                total_cost: total_cost,
              }),
            })
            console.log(result)
          } catch (error) {
            console.log(error)
          }
        }
        cancelOrder()
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: '取消',
          text: '訂單未取消！',
          icon: 'info',
          confirmButtonColor: '#003e52',
          confirmButtonText: '返回列表頁',
        })
      }
    })
  }
  return (
    <>
      <div
        className="order-card border-bottom py-2"
        onClick={() => {
          if (window.innerWidth < 992) {
            window.location.href = `/member/order/${order_id}`
          }
        }}
      >
        <div className="order-detail d-flex">
          <ul className="order-info d-flex flex-column gap-3 col-lg-2 col-3">
            <li>{order_id}</li>
            {payment_at ? (
              <li>已付款</li>
            ) : (
              <li style={{ color: 'red' }}>未付款</li>
            )}
            <li>${total_cost}</li>
          </ul>
          <div className="product-info d-flex flex-lg-row flex-column col-lg-10 col-9">
            <div className="col-lg-9 flex-grow-1">
              <OrderStatusIndicator dateData={orderData} />
            </div>
            <div className="order-options h-100 col-ld-3 d-lg-none d-flex justify-content-end align-items-end me-3">
              {(1 < orderStatusCode && orderStatusCode < 4) ||
              (orderStatusCode === 4 && today < expireDay) ? (
                <button
                  className="m-content-btn btn-indigo"
                  onClick={(e) => {
                    showConfirmReturn()
                    e.stopPropagation()
                  }}
                >
                  訂單退貨
                </button>
              ) : (
                ''
              )}
              {orderStatusCode === 1 && (
                <button
                  className="m-content-btn btn-indigo"
                  onClick={(e) => {
                    showConfirmCancel()
                    e.stopPropagation()
                  }}
                >
                  取消訂單
                </button>
              )}
            </div>
            <div className="order-options col-2 d-flex flex-column gap-3 align-items-end d-none d-lg-flex">
              <button
                className="d-page-btn btn-gray"
                onClick={() => {
                  window.location.href = `/member/order/${order_id}`
                }}
              >
                詳細資訊
              </button>
              {(1 < orderStatusCode && orderStatusCode < 4) ||
              (orderStatusCode === 4 && today < expireDay) ? (
                <button
                  className="d-page-btn btn-indigo"
                  onClick={() => {
                    showConfirmReturn()
                  }}
                >
                  訂單退貨
                </button>
              ) : (
                ''
              )}

              {orderStatusCode === 1 && (
                <button
                  className="d-page-btn btn-indigo d-none d-lg-flex"
                  onClick={(e) => {
                    showConfirmCancel()
                    e.stopPropagation()
                  }}
                >
                  取消訂單
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          @media screen and (max-width: 992px) {
            .order-detail {
              font-size: 14px;
            }
          }
          .order-info {
            line-height: 20px;
            padding: 0;
            margin: 0;
          }
          .indigo {
            background: #003e52;
          }
          .gray {
            background: #d9d9d9;
          }
          .order-status-1 {
            color: #940606;
          }
          .order-status-2 {
            color: #003e52;
          }
          .order-status-3 {
            color: #d9d9d9;
          }
          .order-status-4 {
            color: #bc955c;
          }
          .order-status-5 {
            color: #000;
          }
        `}
      </style>
    </>
  )
}
