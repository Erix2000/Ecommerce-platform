import React, { useEffect, useState } from 'react'
import MemberCenterTitle from '@/components/member-center/title'
import OrderDetail from '@/components/member-center/order/order-detail'
import styles from '@/styles/member-center.module.scss'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/member-main'
import Footer from '@/components/layout/public-version/footer'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/use-auth'
import Head from 'next/head'

export default function OrderDetailPage() {
  const { auth } = useAuth()

  const [orderData, setOrderData] = useState({})
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  // 確定 router 已經準備好
  useEffect(() => {
    if (router.isReady) {
      setIsReady(true)
    }
  }, [router.isReady])

  // router 準備好後，獲取路由參數並查詢資料
  useEffect(() => {
    if (!auth.isAuth) return

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
          setOrderData(result.orderDetail[0])
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [isReady, auth.isAuth])

  // 此處應改為傳送進該筆訂單的ID或資料的物件陣列
  return (
    <>
      <Head>
        <title>MR.BEAN 訂單詳細資訊</title>
      </Head>
      <Navbar />
      <Main>
        <div className={styles['main-content']}>
          <MemberCenterTitle content={'訂單詳細資訊'} />
          <div className={styles['main-content-content']}>
            <OrderDetail orderData={orderData} />
          </div>
        </div>
      </Main>
      <Footer />
    </>
  )
}
