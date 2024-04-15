import React from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Footer from '@/components/layout/public-version/footer'
import ForgetPassword from '@/components/member/forget-password.js'

export default function Index() {
  return (
    <>
      <Head>
        <title>MR.BEAN 忘記密碼</title>
      </Head>
      <Navbar />
      <ForgetPassword />
      <Footer />
    </>
  )
}
