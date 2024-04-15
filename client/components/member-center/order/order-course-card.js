import React, { useEffect, useState } from 'react'
import styles from '@/styles/member-center.module.scss'

export default function OrderCourseCard({
  orderCourse = {},
  finishedAt = {},
  returnedAt = {},
}) {
  const [btnColor, setBtnColor] = useState('indigo')

  useEffect(() => {
    if (orderCourse.comment_valid) {
      setBtnColor('gray')
    }
  }, [])

  const {
    order_id,
    item_price,
    item_qty,
    course_name,
    course_img,
    item_id,
    item_type,
  } = orderCourse
  return (
    <>
      <div className={styles['order-card']}>
        <img className="order-img" src={`/course-img/${course_img}`} alt="" />
        <div className={styles['order-detail']}>
          <div className={styles['product-info']}>
            <ul className="justify-content-start">
              <li>{course_name}</li>
              <li>${item_price}</li>
              <li>數量: {item_qty}</li>
            </ul>
            <div className="gap-3">
              <div className={`${styles['cost']} ${styles['single-cost']}`}>
                ${item_price * item_qty}
              </div>
              {finishedAt || returnedAt ? (
                <>
                  <button
                    className={`d-page-btn btn-${btnColor} d-md-flex d-none text-nowrap`}
                    onClick={() => {
                      if (btnColor === 'indigo') {
                        window.location.href = `/member/comment/create/${order_id}/${item_id}/${item_type}`
                      }
                    }}
                  >
                    評論
                  </button>
                  <button
                    className={`m-content-btn btn-${btnColor} d-md-none text-nowrap`}
                    onClick={() => {
                      if (btnColor === 'indigo') {
                        window.location.href = `/member/comment/create/${order_id}/${item_id}/${item_type}`
                      }
                    }}
                  >
                    評論
                  </button>
                </>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .order-img {
          width: 100px;
          height: 100px;
        }
        .btn-gray {
          cursor: default;
        }
        @media screen and (max-width: 922px) {
          .order-img {
            width: 55px;
            height: 55px;
          }
        }
      `}</style>
    </>
  )
}
