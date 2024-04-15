import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Detail from '@/components/course/detail'
import Footer from '@/components/layout/public-version/footer'
import { useRouter } from 'next/router';

// 會員鉤子
import { useAuth } from '@/hooks/use-auth'

// loading
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'


export default function Index() {
  const { auth } = useAuth();
  const router = useRouter();
  const { category, cid } = router.query
  // 資料庫的東西
  const [courseDetailData, setCourseDetailData] = useState([])
  const [breadData, setBreadData] = useState("")
  const [commentData, setCommentData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [userLikeArr, setUserLikeArr] = useState([])

  //講師的code
  const [lecturer, setLecturer] = useState({});

  useEffect(() => {
    setIsLoading(true)

    // token
    const token = localStorage.getItem('accessToken')

    // 如果有登入，就取得那個頁面有被收藏商品的id陣列
    if (auth.isAuth) {
      console.log(123)
      fetch(`http://localhost:3005/course/user-like`, {
        method: 'POST',
        body: JSON.stringify({
          category: category,
          user_id: auth.userData.user_id
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result)
          // userLikeArr = result.map(v=>v.item)
          setUserLikeArr(result.map(v => v.item_id))
          // console.log(userLikeArr)

        })
        .catch((error) => {
          console.log(error)
        })
    }

    fetch(`http://localhost:3005/course/${category}/${cid}?category=${category}&cid=${cid}`, {
      method: 'get',
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result.courseDetail)
        setCourseDetailData(result.courseDetail)
        setBreadData(result.bread)
        setCommentData(result.comment)
        console.log(result)
      })
      .catch((error) => {
        console.log(error)
      })

    setTimeout(() => {
      setIsLoading(false)
    }, 2000)

  }, [category && cid,auth])
  console.log(courseDetailData)

  // useEffect(() => {
  //   if (lecturer) {
  //     fetch(`http://localhost:3005/course/lecturer/${courseDetailData.exclusive_code}`, {
  //       method: 'get',
  //     })
  //       .then((res) => res.json())
  //       .then((result) => {
  //         setLecturer(result); // 直接將 result 設定為 code 狀態
  //         console.log(result)
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }

  // }, [lecturer.exclusive_code]); // 指定 exclusive_code 為 useEffect 的依賴項

  const Detailloader = (
    <>
      <SkeletonTheme
        duration={2}
        baseColor="#eaeaea" 
        highlightColor="#fff"
        borderRadius={0}

        >
        <div className='container mt-4'>
          <div className='row'>
            <div className='col-2 d-md-block d-none'>
               <Skeleton 
                count={1} 
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 20,
                  width: '100%',
                }}
              />
              <Skeleton 
                count={5} 
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 50,
                  width: '100%',
                }}
              />

              

            </div>

            <div className='col-md-10 col-12'>
              <div className='row'>
                <div className='col-md-5 col-12'>
                  <Skeleton 
                    count={1} 
                    style={{
                      background: '#eaeaea',
                      display: 'block',
                      height: 400,
                      width: '100%',
                    }}
                  
                  />

                </div>
                <div className='col-md-7 col-12'>
                  {/* 電腦版 */}
                  <Skeleton 
                      count={1} 
                      style={{
                        background: '#eaeaea',
                        display: 'block',
                        height: 400,
                        width: '100%',
                      }}
                      className='d-md-block d-none'
                    
                  />
                  {/* 手機版 */}
                  <Skeleton 
                      count={1} 
                      style={{
                        background: '#eaeaea',
                        display: 'block',
                        height: 200,
                        width: '100%',
                      }}
                      className='d-md-none d-block'
                    
                  />
                  
                </div>

              </div>

              <Skeleton 
                count={1} 
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 200,
                  width: '100%',
                }}
                  
              />

              <Skeleton 
                count={1} 
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 200,
                  width: '100%',
                }}
                className='d-md-block d-none'
                  
              />

              <Skeleton 
                count={1} 
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 200,
                  width: '100%',
                }}
                className='d-md-block d-none'
                  
              />
              

              
              
            </div>

          </div>
        </div>
        
        
          
          
       
      </SkeletonTheme>
    </>
  )
  //準備放loading圖示
  const Detaildisplay = (
    <>
    <Detail courseDetailData={courseDetailData} breadData={breadData} userLikeArr={userLikeArr} commentData={commentData}/>
    </>
  )

  return (
    <>
      <Head>
        <title>MR.BEAN 咖啡豆專賣店 - 課程細節</title>
      </Head>
      <Navbar />
      {isLoading ? Detailloader : Detaildisplay}
      <Footer />
    </>
  )
}