import React from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/member-main'
import Footer from '@/components/layout/public-version/footer'
import EditPassword from '@/components/member/edit-password.js'

export default function UserEditPassword() {
  return (
    <>
      <Head>
        <title>MR.BEAN 修改密碼</title>
      </Head>
      <Navbar />
      <Main>
        <EditPassword />
      </Main>
      <Footer />
    </>
  )
}
