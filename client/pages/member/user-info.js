import React from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/member-main'
import Footer from '@/components/layout/public-version/footer'
import UserInfo from '@/components/member/user-info.js'

export default function UserInfoPage() {
  return (
    <>
      <Head>
        <title>MR.BEAN 會員資料</title>
      </Head>
      <Navbar />
      <Main>
        <UserInfo />
      </Main>
      <Footer />
    </>
  )
}
