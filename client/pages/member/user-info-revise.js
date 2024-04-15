import React from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/member-main'
import Footer from '@/components/layout/public-version/footer'
import UserInfoRevise from '@/components/member/user-info-revise.js'

export default function UserInfoRevisePage() {
  return (
    <>
      <Head>
        <title>MR.BEAN 修改會員資訊</title>
      </Head>
      <Navbar />
      <Main>
        <UserInfoRevise />
      </Main>
      <Footer />
    </>
  )
}
