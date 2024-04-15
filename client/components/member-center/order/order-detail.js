import React, { useEffect, useState } from 'react'
import styles from '@/styles/member-center.module.scss'
import OrderProductCard from './order-product-card'
import OrderStatusIndicator from './order-status-indicator'
import { useRouter } from 'next/router'
import OrderCourseCard from './order-course-card'

export default function OrderDetail({ orderData = {} }) {
  // 從 order-item 資料庫中抓取物件陣列 orderItemDatas (order_id === :oid)
  const [orderProductList, setOrderProductList] = useState([])
  const [orderCourseList, setOrderCourseList] = useState([])

  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  // 確定 router 已經準備好
  useEffect(() => {
    if (router.isReady) {
      setIsReady(true)
    }
  }, [router.isReady])

  // router 準備好後，獲取路由參數
  // 並查詢該訂單購買的商品與課程
  useEffect(() => {
    if (isReady) {
      const { oid } = router.query
      fetch(`http://127.0.0.1:3005/member/order?oid=${oid}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setOrderProductList(result.orderProduct)
          setOrderCourseList(result.orderCourse)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [isReady])

  const {
    used_points,
    order_id,
    post_method,
    post_address,
    total_cost,
    recipient_name,
    recipient_phone,
    payment_method,
    remark,
    payment_at,
    created_at,
    canceled_at,
    posted_at,
    arrived_at,
    finished_at,
    returned_at,
    formatted_created_at,
    formatted_canceled_at,
    formatted_posted_at,
    formatted_arrived_at,
    formatted_finished_at,
    formatted_returned_at,
  } = orderData
  return (
    <>
      <div className={styles['details']}>
        <OrderStatusIndicator
          dateData={{
            created_at,
            canceled_at,
            posted_at,
            arrived_at,
            finished_at,
            returned_at,
            formatted_created_at,
            formatted_canceled_at,
            formatted_posted_at,
            formatted_arrived_at,
            formatted_finished_at,
            formatted_returned_at,
          }}
        />
        <div className={styles['detail']}>
          <div className={styles['detail-title']}>訂單編號</div>
          <div className={styles['detail-content']}>{order_id}</div>
        </div>
        <div className={styles['detail']}>
          <div className={styles['detail-title']}>寄送方式</div>
          <div className={styles['detail-content']}>{post_method}</div>
        </div>
        <div className={styles['detail']}>
          <div className={styles['detail-title']}>寄送地址</div>
          <div className={styles['detail-content']}>{post_address}</div>
        </div>
        <div className={styles['detail']}>
          <div className={styles['detail-title']}>收貨人</div>
          <div className={styles['detail-content']}>{recipient_name}</div>
        </div>
        <div className={styles['detail']}>
          <div className={styles['detail-title']}>連絡電話</div>
          <div className={styles['detail-content']}>{recipient_phone}</div>
        </div>
        <div className={styles['detail']}>
          <div className={styles['detail-title']}>付款方式</div>
          <div className={styles['detail-content']}>{payment_method}</div>
        </div>
        <div className={styles['detail']}>
          <div className={styles['detail-title']}>付款狀態</div>
          <div className={styles['detail-content']}>
            {payment_at ? `已付款 ${payment_at}` : '未付款'}
          </div>
        </div>
        <div className={styles['detail']}>
          <div className={styles['detail-title']}>訂單金額</div>
          <div className={styles['detail-content']}>${total_cost}</div>
        </div>
        <div className={styles['detail']}>
          <div className={styles['detail-title']}>使用點數</div>
          <div className={styles['detail-content']}>{-used_points}</div>
        </div>
        <div className={styles['detail']}>
          <div className={styles['detail-title']}>獲得點數</div>
          <div className={styles['detail-content']}>
            {Math.floor(total_cost / 100)}
          </div>
        </div>
        <div className={styles['detail']}>
          <div className={styles['detail-title']}>訂購商品</div>
          <div className={styles['detail-content']}></div>
        </div>
        <div>
          {orderProductList &&
            orderProductList.map((orderProduct, index) => {
              return (
                <OrderProductCard
                  key={index}
                  orderProduct={orderProduct}
                  finishedAt={finished_at}
                  returnedAt={returned_at}
                />
              )
            })}
          {orderCourseList &&
            orderCourseList.map((orderCourse, index) => {
              return (
                <OrderCourseCard
                  key={index}
                  orderCourse={orderCourse}
                  finishedAt={finished_at}
                  returnedAt={returned_at}
                />
              )
            })}
        </div>
        <div className={styles['detail']}>
          <div className={styles['detail-title']}>訂單備註</div>
          <div className={styles['detail-content']}>{remark}</div>
        </div>
      </div>
    </>
  )
}
