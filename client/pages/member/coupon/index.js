import { useEffect, useState } from 'react'
import styles from '@/styles/member-center.module.scss'

import CouponCard from '@/components/member-center/coupon/coupon-card'
import CouponStatusSelector from '@/components/member-center/coupon/coupon-status-selector'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/member-main'
import Footer from '@/components/layout/public-version/footer'
import ContentTitle from '@/components/member-center/title'
import warning2 from '@/assets/gif/icons8-warning2.gif'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '@/hooks/use-auth'
import Head from 'next/head'

export default function MyCoupon() {
  // 為了頁面渲染，我需要有 coupon_name, expire_at, coupon_discount, coupon_threshold
  // 抓 coupon_user_mapping 的全部欄位 JOIN coupon 抓 coupon_discount, coupon_threshold, coupon_name, coupon_id ，並且篩選 userID = {userID}
  const [couponListStatus, setCouponListStatus] = useState(0)
  const [couponHasList, setCouponHasList] = useState([])
  const [couponUntakenList, setCouponUntakenList] = useState([])
  const [couponUnexchangeList, setCouponUnexchangeList] = useState([])
  const [couponInvalidList, setCouponInvalidList] = useState([])
  const [couponUsedList, setCouponUsedList] = useState([])

  const { auth } = useAuth()

  // 觸發 toast 的方法
  const showToast = (toastContent) => {
    toast.success(toastContent)
  }

  useEffect(() => {
    if (!auth.isAuth) return

    const fetchData = async () => {
      try {
        let response = await fetch(`http://127.0.0.1:3005/member/coupon`, {
          method: 'get',
          headers: {
            'Content-type': 'application-json',
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
        })
        const result = await response.json()
        setCouponHasList(result.has)
        setCouponUntakenList(result.untaken)
        setCouponUnexchangeList(result.unexchange)
        const dealedInvalid = result.invalid.map((v, i) => {
          if (v.used_at) {
            const invalid_at = v.used_at
            return { ...v, invalid_at: invalid_at }
          } else {
            const invalid_at = v.expire_at
            return { ...v, invalid_at: invalid_at }
          }
        })
        const newDealedInvalid = dealedInvalid.sort(
          (a, b) => new Date(b.invalid_at) - new Date(a.invalid_at)
        )
        setCouponInvalidList(newDealedInvalid)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [couponListStatus, auth.isAuth])
  return (
    <>
      <Head>
        <title>MR.BEAN 優惠券</title>
      </Head>
      <Navbar />
      <Main>
        <div className={styles['main-content']}>
          <ContentTitle content={'優惠券'} />
          <div className={styles['main-content-content']}>
            <CouponStatusSelector
              couponListStatus={couponListStatus}
              setCouponListStatus={setCouponListStatus}
            />
            <div className="couponList row g-3 py-1">
              {/* 優惠券狀態：1: 可使用  2: 未領取  3: 未兌換  4: 已失效 */}
              {/* 印出該用戶擁有的優惠券 */}
              {couponHasList &&
              (couponListStatus === 0 || couponListStatus === 1)
                ? couponHasList.map((couponData, index) => {
                    return (
                      <CouponCard
                        key={index}
                        couponData={couponData}
                        couponStatus={1}
                        showToast={showToast}
                      />
                    )
                  })
                : ''}
              {/* 印出該用戶尚未領取的優惠券 */}
              {couponUntakenList &&
              (couponListStatus === 0 || couponListStatus === 2)
                ? couponUntakenList.map((couponData, index) => {
                    return (
                      <CouponCard
                        key={index}
                        couponData={couponData}
                        couponStatus={2}
                        showToast={showToast}
                      />
                    )
                  })
                : ''}
              {/* 未兌換 */}
              {couponUnexchangeList &&
              (couponListStatus === 0 || couponListStatus === 3)
                ? couponUnexchangeList.map((couponData, index) => {
                    return (
                      <CouponCard
                        key={index}
                        couponData={couponData}
                        couponStatus={3}
                        showToast={showToast}
                      />
                    )
                  })
                : ''}
              {/* 已失效 */}
              {couponInvalidList && couponListStatus === 4
                ? couponInvalidList.map((couponData, index) => {
                    return (
                      <CouponCard
                        key={index}
                        couponData={couponData}
                        couponStatus={4}
                        showToast={showToast}
                      />
                    )
                  })
                : ''}
            </div>
          </div>
        </div>
        <Toaster
          toastOptions={{
            iconTheme: {
              primary: '#003e52',
            },
            position: 'bottom-right',
            duration: 2000,
            success: {
              style: {
                border: '1.5px solid #003e52',
                borderRadius: '0',
              },
            },
            error: {
              icon: (
                <Image src={warning2} width={25} height={25} alt="warning" />
              ),
              style: {
                border: '1.5px solid #003e52',
                borderRadius: '0',
              },
            },
          }}
        />
      </Main>

      <Footer />
    </>
  )
}
