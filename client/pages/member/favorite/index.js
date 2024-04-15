import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import Head from 'next/head'

import styles from '@/components/member-center/favorite/favorite.module.scss'

import Navbar from '@/components/layout/public-version/navbar'
import Main from '@/components/layout/member-main'
import ContentTitle from '@/components/member-center/title'
import ProductFavorite from '@/components/member-center/favorite/product-favorite'
import ArticleFavorite from '@/components/member-center/favorite/article-favorite'
import CourseFavorite from '@/components/course/list/course-card'
import Footer from '@/components/layout/public-version/footer'
import warning2 from '@/assets/gif/icons8-warning2.gif'

// react-bs component
import Accordion from 'react-bootstrap/Accordion'
import toast, { Toaster } from 'react-hot-toast'
import Image from 'next/image'

export default function Favorite() {
  const { auth } = useAuth()

  const [status, setStatus] = useState('所有收藏')
  const [showSelector, setShowSelector] = useState(false)

  const [favoriteList, setFavoriteList] = useState({})
  const [courseFavoriteList, setCourseFavoriteList] = useState([])
  const [productFavoriteList, setProductFavoriteList] = useState([])
  const [articleFavoriteList, setArticleFavoriteList] = useState([])

  const showToastUnlikeProduct = () => {
    toast.success('商品已取消收藏')
  }
  const showToastUnlikeCourse = () => {
    toast.success('課程已取消收藏')
  }
  const showToastUnlikeArticle = () => {
    toast.success('文章已取消收藏')
  }

  // 第一次渲染時
  // 發送 get 請求，取得該用戶喜愛的商品、課程、文章
  // 在後端，我將回傳的資料集合成物件
  useEffect(() => {
    if (!auth.isAuth) return

    // 以查詢參數方式傳送 user_id
    // res 為三個資料庫的資料合成的物件
    // 將三個資料庫取得的物件陣列分別設定進狀態中
    const fetchData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:3005/member/favorite`, {
          method: 'get',
          headers: {
            'Context-type': 'application-json',
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
        })
        const result = await res.json()
        setFavoriteList(result)
        setProductFavoriteList(result.product)
        setCourseFavoriteList(result.course)
        setArticleFavoriteList(result.article)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [auth.isAuth])
  // 當 favorite 或 status 進行變動時
  // 對應的進行狀態調整 (渲染內容的調整)
  useEffect(() => {
    if (favoriteList) {
      switch (status) {
        case '所有收藏':
          setProductFavoriteList(favoriteList.product)
          setCourseFavoriteList(favoriteList.course)
          setArticleFavoriteList(favoriteList.article)
          break
        case '商品收藏':
          setProductFavoriteList(favoriteList.product)
          setCourseFavoriteList([])
          setArticleFavoriteList([])
          break
        case '課程收藏':
          setProductFavoriteList([])
          setCourseFavoriteList(favoriteList.course)
          setArticleFavoriteList([])
          break
        case '文章收藏':
          setProductFavoriteList([])
          setCourseFavoriteList([])
          setArticleFavoriteList(favoriteList.article)
      }
    }
  }, [status, favoriteList])
  return (
    <>
      <Head>
        <title>MR.BEAN 我的收藏</title>
      </Head>
      <Navbar />
      <Main>
        <div className={styles['main-content']}>
          <ContentTitle content={'我的收藏'} />
          <div className={styles['main-content-content']}>
            <div className={`${styles['coupon-status-area']} ${'d-lg-none'}`}>
              <div
                className={styles['coupon-status']}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowSelector(!showSelector)
                  }
                }}
                onClick={() => {
                  setShowSelector(!showSelector)
                }}
              >
                <div className={styles['status-indicator']}>{status}</div>
                <div>
                  <i className="bi bi-caret-down-fill"></i>
                </div>
              </div>
              {showSelector && (
                <ul className={`${styles['status-options']}`}>
                  <option
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setShowSelector(!showSelector)
                      }
                    }}
                    onClick={() => {
                      setStatus('所有收藏')
                      setShowSelector(false)
                    }}
                  >
                    所有收藏
                  </option>
                  <option
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setShowSelector(!showSelector)
                      }
                    }}
                    onClick={() => {
                      setStatus('商品收藏')
                      setShowSelector(false)
                    }}
                  >
                    商品收藏
                  </option>
                  <option
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setShowSelector(!showSelector)
                      }
                    }}
                    onClick={() => {
                      setStatus('課程收藏')
                      setShowSelector(false)
                    }}
                  >
                    課程收藏
                  </option>
                  <option
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setShowSelector(!showSelector)
                      }
                    }}
                    onClick={() => {
                      setStatus('文章收藏')
                      setShowSelector(false)
                    }}
                  >
                    文章收藏
                  </option>
                </ul>
              )}
            </div>

            <Accordion defaultActiveKey="0" className="d-none d-lg-block">
              <Accordion.Item eventKey="0">
                <Accordion.Header className="border-bottom border-black">
                  商品收藏
                </Accordion.Header>
                <Accordion.Body className="row">
                  {/* TODO:傳入現有的收藏清單 */}
                  {productFavoriteList &&
                    productFavoriteList.map((productData, i) => {
                      return (
                        <ProductFavorite
                          key={i}
                          productItem={productData}
                          userLikeArr={[productData.product_id.toString()]}
                          productFavoriteList={productFavoriteList}
                          setProductFavoriteList={setProductFavoriteList}
                          unlikeNotify={showToastUnlikeProduct}
                        />
                      )
                    })}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header className="border-bottom border-black">
                  課程收藏
                </Accordion.Header>
                <Accordion.Body className="row">
                  {courseFavoriteList &&
                    courseFavoriteList.map((courseData, i) => {
                      return (
                        <CourseFavorite
                          key={i}
                          courseItem={courseData}
                          userLikeArr={[courseData.course_id.toString()]}
                          courseFavoriteList={courseFavoriteList}
                          setCourseFavoriteList={setCourseFavoriteList}
                          unlikeNotify={showToastUnlikeCourse}
                        />
                      )
                    })}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header className="border-bottom border-black">
                  文章收藏
                </Accordion.Header>
                <Accordion.Body className="row">
                  {articleFavoriteList &&
                    articleFavoriteList.map((articleDatas, i) => {
                      return (
                        <ArticleFavorite
                          key={i}
                          forumData={articleDatas}
                          userLikeArr={[articleDatas.forum_id.toString()]}
                          articleFavoriteList={articleFavoriteList}
                          setArticleFavoriteList={setArticleFavoriteList}
                          unlikeNotify={showToastUnlikeArticle}
                        />
                      )
                    })}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <div className="m-favorite-list row d-lg-none d-flex">
              {productFavoriteList &&
                productFavoriteList.map((productData, i) => {
                  return (
                    <ProductFavorite
                      key={i}
                      productItem={productData}
                      userLikeArr={[productData.product_id.toString()]}
                      productFavoriteList={productFavoriteList}
                      setProductFavoriteList={setProductFavoriteList}
                      unlikeNotify={showToastUnlikeProduct}
                    />
                  )
                })}
              {status === '所有收藏' ? (
                <hr className="border border-dark border-3" />
              ) : (
                ''
              )}{' '}
              {courseFavoriteList &&
                courseFavoriteList.map((courseData, i) => {
                  return (
                    <CourseFavorite
                      key={i}
                      courseItem={courseData}
                      userLikeArr={[courseData.course_id.toString()]}
                      courseFavoriteList={courseFavoriteList}
                      setCourseFavoriteList={setCourseFavoriteList}
                      unlikeNotify={showToastUnlikeCourse}
                    />
                  )
                })}
              {status === '所有收藏' ? (
                <hr className="border border-dark border-3" />
              ) : (
                ''
              )}
              {articleFavoriteList &&
                articleFavoriteList.map((articleDatas, i) => {
                  return (
                    <ArticleFavorite
                      key={i}
                      forumData={articleDatas}
                      userLikeArr={[articleDatas.forum_id.toString()]}
                      articleFavoriteList={articleFavoriteList}
                      setArticleFavoriteList={setArticleFavoriteList}
                      unlikeNotify={showToastUnlikeArticle}
                    />
                  )
                })}
            </div>
          </div>
        </div>
      </Main>
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
