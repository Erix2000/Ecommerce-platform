import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/forum-main'
import Footer from '@/components/layout/public-version/footer'
import TotalForum from '@/components/forum/total-forum'
import { useRouter } from 'next/router'

// 會員鉤子
import { useAuth } from '@/hooks/use-auth'

// loading
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Image from 'next/image'
import warning2 from '@/assets/gif/icons8-warning2.gif'
import toast, { Toaster } from 'react-hot-toast'

export default function Index() {
  const { auth } = useAuth()
  const router = useRouter()
  const { category } = router.query

  // 資料庫的東西
  const [forumData, setForumData] = useState([])
  const [kind, setKind] = useState([])

  // 之後要放loading
  const [isLoading, setIsLoading] = useState(true)

  // 如果會員登入就要傳進來的資料
  const [userLikeArr, setUserLikeArr] = useState([])
  const showToastUnlike = () => {
    toast.success('已取消收藏')
  }
  const showToastLike = () => {
    toast.success('已加入收藏')
  }

  // 篩選全部設定開始
  // 在這裡取得字串、組合成要放在網址上的字串

  // 步驟一:取得個別字串
  // 排序
  // 初始值為0
  const [sortValue, setSortValue] = useState(0)
  const [sortStr, setSortStr] = useState('?sort=0')
  let sortFun = (e) => {
    console.log(e)
    setSortValue(e)
    setSortStr(`?sort=${e}`)
    localStorage.setItem('sort', `${e}`)
    // console.log(localStorage.getItem('sort'))
  }
  // 測試用步驟三:之後會放進下面(已經放入下面)
  useEffect(() => {
    console.log(sortStr)
  }, [sortStr])

  // console.log(localStorage)

  useEffect(() => {
    // token
    const token = localStorage.getItem('accessToken')
    console.log(localStorage)
    setIsLoading(true)

    if (router.isReady) {
      // 如果有登入，就取得那個頁面有被收藏商品的id陣列
      if (auth.isAuth) {
        // console.log(123)
        fetch(`http://localhost:3005/forum/user-like`, {
          method: 'POST',
          body: JSON.stringify({
            category: category,
            user_id: auth.userData.user_id,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((result) => {
            // 查看收藏文章id
            console.log(result)
            const results = result.map((v) => v.article_id.toString())
            setUserLikeArr(results)
            console.log(results)
            // console.log(result.map((v) => v.article_id));
          })
          .catch((error) => {
            console.log(error)
          })
      }

      // 取得商品資料
      fetch(`http://localhost:3005/forum/${category}${sortStr}`, {
        method: 'get',
      })
        .then((res) => res.json())
        .then((result) => {
          setForumData(result.forums)
          setKind(result.kind)
          // console.log(result)
          // console.log(result.forums)
          // console.log(result.forums[0].forum_category_id)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    console.log(router.isReady)
    console.log(category)
    console.log(isLoading)
  }, [router.isReady, category, auth, sortStr])

  const listloader = (
    <>
      <SkeletonTheme
        duration={2}
        baseColor="#eaeaea"
        highlightColor="#fff"
        borderRadius={0}
      >
        <div className="container">
          <div className="row ">
            <div className="d-md-block d-none"></div>

            <div className="col-md-12 col-12 mt-5">
              {/* 電腦版 */}
              <Skeleton
                count={5}
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 250,
                  width: '100%',
                }}
                className="d-md-block d-none mt-2"
              />
              {/* 手機板 */}
              <Skeleton
                count={5}
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 250,
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

  const listdisplay = (
    <>
      <TotalForum
        forumData={forumData}
        userLikeArr={userLikeArr}
        sortFun={sortFun}
        unlikeNotify={showToastUnlike}
        likeNotify={showToastLike}
      />
    </>
  )

  return (
    <>
      <Head>
        <title>MR.BEAN 咖啡專欄</title>
      </Head>
      <Navbar />
      <Main>{isLoading ? listloader : listdisplay}</Main>
      <Footer />
      <Toaster
        toastOptions={{
          iconTheme: {
            primary: '#003e52',
          },
          position: 'bottom-right',
          duration: 2000,
          success: {
            style: {
              border: '1.5px solid #003e52',
              borderRadius: '0',
            },
          },
          error: {
            icon: <Image src={warning2} width={25} height={25} alt="warning" />,
            style: {
              border: '1.5px solid #003e52',
              borderRadius: '0',
            },
          },
        }}
      />
    </>
  )
}
