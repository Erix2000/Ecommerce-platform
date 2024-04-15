import React from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/member-main'
import Footer from '@/components/layout/public-version/footer'
import UserInfoPoint from '@/components/member/user-info-point.js'

export default function UserInfoPointPage() {
  return (
    <>
      <Head>
        <title>MR.BEAN 點數紀錄</title>
      </Head>
      <Navbar />
      <Main>
        <UserInfoPoint />
      </Main>
      <Footer />
    </>
  )
}
