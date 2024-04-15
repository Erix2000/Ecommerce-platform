import Main from '@/components/layout/member-main'
import Footer from '@/components/layout/public-version/footer'
import Navbar from '@/components/layout/public-version/navbar'
import MyCourseCard from '@/components/member-center/course/my-course-card'
import ContentTitle from '@/components/member-center/title'
import styles from '@/styles/member-center.module.scss'
import React, { useEffect, useState } from 'react'

import { useAuth } from '@/hooks/use-auth'
import Head from 'next/head'

export default function MyCourse() {
  const { auth } = useAuth()
  const [myCourse, setMyCourse] = useState([])

  useEffect(() => {
    if (!auth.isAuth) return

    const fetchMyCourse = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3005/member/course`, {
          method: 'get',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
        })
        const result = await response.json()
        setMyCourse(result)
      } catch (error) {
        console.log(error)
      }
    }

    fetchMyCourse()
  }, [auth.isAuth])
  return (
    <>
      <Head>
        <title>MR.BEAN 我的課程</title>
      </Head>
      <Navbar />
      <Main>
        <div className={styles['main-content']}>
          <ContentTitle content={'我的課程'} />
          <div className={styles['main-content-content']}>
            <div className="d-flex flex-column gap-4">
              {myCourse.map((courseData, index) => {
                return <MyCourseCard courseData={courseData} key={index} />
              })}
            </div>
          </div>
        </div>
      </Main>

      <Footer />
    </>
  )
}
