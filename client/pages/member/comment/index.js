import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/member-main'
import CommentHistory from '@/components/member-calendar/comment-history'
import Footer from '@/components/layout/public-version/footer'
import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'

export default function Comment() {
  const { auth } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!auth.isAuth) return
  }, [router.isReady, auth.isAuth])
  return (
    <>
      <Head>
        <title>MR.BEAN 評論紀錄</title>
      </Head>
      <Navbar />
      <Main>
        <CommentHistory />
      </Main>
      <Footer />
    </>
  )
}
