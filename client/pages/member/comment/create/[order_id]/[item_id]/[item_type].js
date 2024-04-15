import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/member-main'
import CommentBox from '@/components/member-calendar/create-comment'
import Footer from '@/components/layout/public-version/footer'
import React from 'react'
// import { useRouter } from 'next/router'

export default function Comment() {
  // const router = useRouter()
  // const [item] = router.query

  return (
    <>
      <Head>
        <title>MR.BEAN 撰寫評論</title>
      </Head>
      <Navbar />
      <Main>
        <CommentBox />
      </Main>
      <Footer />
    </>
  )
}
