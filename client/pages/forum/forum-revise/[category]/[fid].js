import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/member-main'
import Footer from '@/components/layout/public-version/footer'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/use-auth'
import ForumResive from '@/components/forum/forum-revise'

export default function Index() {
  const router = useRouter()
  //
  const [isReady, setIsReady] = useState(false)
  const { category, fid } = router.query
  const [forumDetailData, setForumDetailData] = useState([])
  const [kind, setKind] = useState([])

  // 確定 router 已經準備好
  useEffect(() => {
    if (router.isReady) {
      setIsReady(true)
    }
  }, [router.isReady])

  // router 準備好後，獲取路由參數並查詢資料

  useEffect(() => {
    if (isReady) {
      fetch(`http://localhost:3005/forum/${category}/${fid}`, {
        method: 'get',
      })
        .then((res) => res.json())
        .then((result) => {
          setForumDetailData(result.forumDetail)
          setKind(result.kind)
          console.log(result)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [isReady, category && fid])

  return (
    <>
      <Head>
        <title>MR.BEAN 專欄編輯</title>
      </Head>
      <Navbar />
      <Main>
        <ForumResive forumDetailData={forumDetailData} />
      </Main>
      <Footer />
    </>
  )
}
