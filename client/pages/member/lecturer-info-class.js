import React from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/member-main'
import Footer from '@/components/layout/public-version/footer'
import LecturerInfoClasses from '@/components/member/lecturer-info-class.js'

export default function LecturerInfoClassPage() {
  return (
    <>
      <Head>
        <title>MR.BEAN 講師課程檢視</title>
      </Head>
      <Navbar />
      <Main>
        <LecturerInfoClasses />
      </Main>
      <Footer />
    </>
  )
}
