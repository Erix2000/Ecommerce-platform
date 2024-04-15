import React from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Footer from '@/components/layout/public-version/footer'
import Register from '@/components/member/register'

export default function UserRegister() {
  return (
    <>
      <Head>
        <title>MR.BEAN 註冊</title>
      </Head>
      <Navbar />
      <Register />
      <Footer />
    </>
  )
}
