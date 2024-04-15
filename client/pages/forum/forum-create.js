import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/member-main'
import Footer from '@/components/layout/public-version/footer'
import { useRouter } from 'next/router'

// import { getUserInfo } from '@/services/user.mjs'
import { useAuth } from '@/hooks/use-auth'
import ForumCreate from '@/components/forum/forum-create'

export default function Index() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>MR.BEAN 專欄發佈</title>
      </Head>
      <Navbar />
      <Main>
        <ForumCreate />
      </Main>
      <Footer />
    </>
  )
}
