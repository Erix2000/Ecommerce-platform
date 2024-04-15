import { useEffect, useState } from 'react'
import styles from '@/styles/member-center.module.scss'

import MemberCenterTitle from '@/components/member-center/title'
import Main from '@/components/layout/member-main'
import Navbar from '@/components/layout/public-version/navbar'
import Footer from '@/components/layout/public-version/footer'
import OrderCard from '@/components/member-center/order/order-card'

import { useAuth } from '@/hooks/use-auth'
import Head from 'next/head'

export default function HistoryOrderList() {
  const { auth } = useAuth()

  const [orderDatas, setOrderDatas] = useState([])

  useEffect(() => {
    if (!auth.isAuth) return

    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3005/member/order', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
        })
        const result = await response.json()
        setOrderDatas(result)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [auth.isAuth])

  return (
    <>
      <Head>
        <title>MR.BEAN 歷史訂單</title>
      </Head>
      <Navbar />
      <Main>
        <div className={styles['main-content']}>
          <MemberCenterTitle content={'歷史訂單'} />
          <div className={styles['main-content-content']}>
            {orderDatas.map((orderData, index) => {
              return (
                <OrderCard
                  key={index}
                  orderData={orderData}
                  orderDatas={orderDatas}
                  setOrderDatas={setOrderDatas}
                />
              )
            })}
          </div>
        </div>
      </Main>
      <Footer />
    </>
  )
}
