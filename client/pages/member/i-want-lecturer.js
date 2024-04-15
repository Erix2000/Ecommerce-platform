import React from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/member-main'
import Footer from '@/components/layout/public-version/footer'
import WantLecturer from '@/components/member/want-lecturer'
import { useAuth } from '@/hooks/use-auth'
export default function WantLecturerPage() {
  const { auth } = useAuth()
  if (!auth.isAuth) return <></>

  return (
    <>
      <Head>
        <title>MR.BEAN 招募講師</title>
      </Head>
      <Navbar />
      <Main>
        <WantLecturer />
      </Main>
      <Footer />
    </>
  )
}
