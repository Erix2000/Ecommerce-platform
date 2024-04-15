import React from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/member-main'
import Footer from '@/components/layout/public-version/footer'
import LecturerInfoRevise from '@/components/member/lecturer-info-revise.js'

export default function LecturerInfoRevisePage() {
  return (
    <>
      <Head>
        <title>MR.BEAN 修改講師資料</title>
      </Head>
      <Navbar />
      <Main>
        <LecturerInfoRevise />
      </Main>
      <Footer />
    </>
  )
}
