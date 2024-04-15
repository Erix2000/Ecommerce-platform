import React, { useEffect, useState } from 'react'
import styles from '@/components/cart/cart-modules/step3.module.scss'
import Process from './process'
import Image from 'next/image'
import checkCircle from '@/assets/gif/icons8-check2.gif'
import { useCart } from '@/hooks/use-cart'
import Link from 'next/link'

export default function Step3() {
  const { handleThousand } = useCart()
  const [order, setOrder] = useState([])
  const [orderId, setOrderId] = useState('')

  const getOrder = async (orderId) => {
    const token = localStorage.getItem('accessToken')

    await fetch(
      `http://localhost:3005/cart/confirm/success?orderId=${orderId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        return response.json()
      })
      .then((result) => {
        return setOrder(result)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const orderId = queryParams.get('orderId')
    setOrderId(orderId)
    getOrder(orderId)
  }, [])

  return (
    <>
      <main className={`main-container container`}>
        <Process step={3} />
        {/* 打勾icon開始 */}
        <section className={`container ${styles['cart-success']}`}>
          <div className={`${styles['success-group']}`}>
            <div className={`${styles['icon']}`}>
              <Image
                src={checkCircle}
                width={80}
                height={80}
                alt="checkCircle gif"
              />
            </div>
            {order.map((order) => {
              const dataPaymentAt = order.payment_at
                ? order.payment_at.split('T')
                : ''
              const time = dataPaymentAt[1] ? dataPaymentAt[1].split(':') : ''
              const newPaymentAt = order.payment_at
                ? `${dataPaymentAt[0]} ${time[0]}:${time[1]}:${
                    time[2].split('.')[0]
                  }`
                : ''

              return (
                <div key={order.order_id}>
                  <p className={styles['success-info']}>
                    {order.payment_at ? `付款成功` : `訂單成立`}！感謝您的訂購～
                  </p>
                  <p
                    className={`${order.payment_at ? '' : 'd-none'} ${
                      styles['payment-success']
                    }`}
                  >
                    {newPaymentAt ? `已於 ${newPaymentAt} 付款` : ''}
                  </p>
                </div>
              )
            })}
          </div>
        </section>
        {/* 打勾icon結束 */}
        {/* 訂單概要開始 */}
        <section className={`container ${styles['summary-info']} `}>
          <p className={`${styles['title']}`}>訂購資料</p>

          {order.map((order) => {
            const orderCtreatedAt = order.created_at.split('-')
            const expectArrive = `${orderCtreatedAt[0]}-${orderCtreatedAt[1]}-${
              Number(orderCtreatedAt[2]) + 3
            }`
            return (
              <div key={order.order_id}>
                <div className={styles['information']}>
                  <div className={styles['information-title']}>訂單編號</div>
                  <div className={styles['information-content']}>
                    {order.order_id}
                  </div>
                </div>
                <div className={styles['information']}>
                  <div className={styles['information-title']}>支付方式</div>
                  <div className={styles['information-content']}>
                    {order.payment_method}
                  </div>
                </div>
                <div className={styles['information']}>
                  <div className={styles['information-title']}>付款狀態</div>
                  <div className={styles['information-content']}>
                    <span
                      className={
                        order.payment_at
                          ? styles['status-ok']
                          : styles['status-none']
                      }
                    >
                      {order.payment_at ? `已付款` : `未付款`}
                    </span>
                  </div>
                </div>
                <div className={styles['information']}>
                  <div className={styles['information-title']}>訂單金額</div>
                  <div className={styles['information-content']}>
                    NT$ {handleThousand(order.total_cost)}
                  </div>
                </div>
                <div className={styles['information']}>
                  <div className={styles['information-title']}>收件人</div>
                  <div className={styles['information-content']}>
                    {order.recipient_name}
                  </div>
                </div>
                <div className={styles['information']}>
                  <div className={styles['information-title']}>運送方式</div>
                  <div className={styles['information-content']}>
                    {order.post_method}
                  </div>
                </div>
                <div className={styles['information']}>
                  <div className={styles['information-title']}>取貨地址</div>
                  <div className={styles['information-content']}>
                    {order.post_address}
                  </div>
                </div>
                <div className={styles['information']}>
                  <div className={styles['information-title']}>預計送達</div>
                  <div className={styles['information-content']}>
                    {expectArrive}
                  </div>
                </div>
                <div className={styles['information']}>
                  <div className={styles['information-title']}>
                    備&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;註
                  </div>
                  <div className={styles['information-content']}>
                    {order.remark}
                  </div>
                </div>
              </div>
            )
          })}
        </section>
        {/* 兩顆button開始 */}
        <section className={`${styles['direct']}`}>
          <Link
            href={`http://localhost:3000/member/order/${orderId}`}
            className={`${styles['go-check']} ${styles['direct-button']}`}
          >
            查看詳細訂單
          </Link>
          <Link
            href="http://localhost:3000/product/00"
            className={`${styles['go-product']} ${styles['direct-button']}`}
          >
            繼續購物
          </Link>
        </section>
        {/* 兩顆button結束 */}
        {/* 訂單概要結束 */}
      </main>
    </>
  )
}
