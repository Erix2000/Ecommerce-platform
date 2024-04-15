import React from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Footer from '@/components/layout/public-version/footer'
import Login from '@/components/member/login.js'

export default function UserLogin() {
  return (
    <>
      <Head>
        <title>MR.BEAN 登入</title>
      </Head>
      <Navbar />
      <Login />
      <Footer />
    </>
  )
}
