import React from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/member-main'
import Footer from '@/components/layout/public-version/footer'
import LecturerInfo from '@/components/member/lecturer-info'
import { useAuth } from '@/hooks/use-auth'

export default function LecturerInfoPage() {
  const { auth } = useAuth()
  if (!auth.isAuth) return <></>

  return (
    <>
      <Head>
        <title>MR.BEAN 講師資料</title>
      </Head>
      <Navbar />
      <Main>
        <LecturerInfo />
      </Main>
      <Footer />
    </>
  )
}
