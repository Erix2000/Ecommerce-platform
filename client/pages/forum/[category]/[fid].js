import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/forum-page-main'
import Footer from '@/components/layout/public-version/footer'
import ForumPage from '@/components/forum/forum-page'
import { useRouter } from 'next/router'

// loading
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Index() {
  const router = useRouter()
  const { category, fid } = router.query
  const [forumDetailData, setForumDetailData] = useState([])
  const [kind, setKind] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

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

    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [category && fid])

  // [router.isReady]

  const Detailloader = (
    <>
      <SkeletonTheme
        duration={2}
        baseColor="#eaeaea"
        highlightColor="#fff"
        borderRadius={0}
      >
        <div className="container ">
          <div className="row ">
            <div className=" d-md-block d-none"></div>

            <div className="col-md-12 col-12 mt-5">
              {/* 電腦版 */}
              <Skeleton
                count={1}
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 200,
                  width: '100%',
                }}
                className="d-md-block d-none"
              />
              <Skeleton
                count={1}
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 800,
                  width: '100%',
                }}
                className="d-md-block d-none"
              />
              <Skeleton
                count={1}
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 600,
                  width: '100%',
                }}
                className="d-md-block d-none"
              />
              {/* 手機板 */}
              <Skeleton
                count={1}
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 200,
                  width: '100%',
                }}
                className="d-md-none d-block"
              />
              <Skeleton
                count={1}
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 250,
                  width: '100%',
                }}
                className="d-md-none d-block"
              />
              <Skeleton
                count={1}
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 700,
                  width: '100%',
                }}
                className="d-md-none d-block"
              />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    </>
  )

  const Detaildisplay = (
    <>
      <ForumPage forumDetailData={forumDetailData} />
    </>
  )

  return (
    <>
      <Head>
        <title>MR.BEAN 專欄細節</title>
      </Head>
      <Navbar />
      <Main>{isLoading ? Detailloader : Detaildisplay}</Main>
      <Footer />
    </>
  )
}
