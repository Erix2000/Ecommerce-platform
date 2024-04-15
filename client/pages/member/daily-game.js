import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/member-main'
import CalenderGame from '@/components/member-calendar/daily-game'
import Footer from '@/components/layout/public-version/footer'
import React from 'react'

export default function Calender() {
  return (
    <>
      <Head>
        <title>MR.BEAN 每日簽到</title>
      </Head>
      <Navbar />
      <Main>
        <CalenderGame />
      </Main>
      <Footer />
    </>
  )
}
