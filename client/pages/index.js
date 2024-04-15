import React from 'react'
import styles from '@/styles/home.module.scss'
import Carousel from 'react-bootstrap/Carousel'
import { Image } from 'react-bootstrap'
import Navbar from '@/components/layout/public-version/navbar'
import Footer from '@/components/layout/public-version/footer'
import Head from 'next/head'

export default function Index() {
  return (
    <>
      <Head>
        <title>MR.BEAN 咖啡豆專賣店</title>
      </Head>
      <Navbar />
      <Carousel>
        <Carousel.Item interval={2000}>
          <Image src="/index-img/slide3.jpg" fluid />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={2000}>
          <Image src="/index-img/slide4.jpg" fluid />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={2000}>
          <Image src="/index-img/slide5.jpg" fluid />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* <!-- HOME PAGE START :輪播圖結束--> */}
      {/* <!-- HOME PAGE START :簡介圓圖開始--> */}
      <div className={`${styles['coffee-intro']} py-5`}>
        <div
          className={`${styles['coffee-circle']} d-flex flex-column flex-xl-row gap-md-0 gap-4 container`}
        >
          <div
            className={`beans col-xl-4 col-12 d-flex flex-xl-column flex-md-row flex-column
          align-items-center pb-4`}
          >
            <div className="px-5">
              <img
                src="/index-img/ellipse1.png"
                alt=""
                className={styles['circle-img']}
                onClick={() => {
                  window.location.href = `/product/00`
                }}
              />
            </div>

            <div className="mt-lg-3 mt-md-0 mt-2">
              <div className={styles['circle-title']}>精選咖啡豆</div>
              <div className={styles['circle-intro']}>
                透過仔細的挑選和精湛的烘焙技術，
                我們呈獻一系列源自世界各地的精品咖啡豆。從香濃的南美風味到芬芳的亞洲風情，每一口都是對風味極致追求的完美體現。
              </div>
            </div>
          </div>
          <div
            className={`${styles['article']}  col-xl-4 col-12 d-flex flex-xl-column flex-md-row flex-column
          align-items-center pb-4`}
          >
            <div className="px-5">
              <img
                src="/index-img/ellipse2.png"
                alt=""
                className={`${styles['circle-img']}`}
                onClick={() => {
                  window.location.href = `/forum/list`
                }}
              />
            </div>
            <div className="mt-lg-3 mt-md-0 mt-2">
              <div className={styles['circle-title']}>MR.BEAN專欄</div>
              <div className={styles['circle-intro']}>
                品味專業咖啡世界，由專業咖啡認證資格老師親自撰寫。專欄涵蓋咖啡風味、製程與品質，深入解析咖啡的多樣風貌，引領讀者輕鬆踏入咖啡的精彩世界，享受一場無盡的咖啡饗宴。
              </div>
            </div>
          </div>
          <div
            className={`class col-xl-4 col-12 d-flex flex-xl-column flex-md-row flex-column
          align-items-center pb-4`}
          >
            <div className="px-5">
              <img
                src="/index-img/ellipse3.png"
                alt=""
                className={styles['circle-img']}
                onClick={() => {
                  window.location.href = `/course/list`
                }}
              />
            </div>
            <div className="mt-lg-3 mt-md-0 mt-2">
              <div className={styles['circle-title']}>相關課程</div>
              <div className={styles['circle-intro']}>
                探索咖啡的奧秘，參加我們的咖啡課程！從拉花技巧到烘豆烹飪，我們提供全方位的一般課程。想更深入咖啡世界？不妨考慮我們的專業認證課程，成為一位真正的咖啡大師！
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- HOME PAGE START :簡介圓圖結束--> */}
      {/* <!-- HOME ABOUT US :關於我們開始--> */}
      <div className={`${styles['story']} d-flex align-items-center`}>
        <div className="col-6 d-none d-xl-flex flex-column align-items-center p-0 gap-lg-5 gap-2">
          <div className="story-img overflow-hidden text-center">
            <img src="/index-img/giphy.gif" alt="" />
          </div>

          <p className="display-4 text-white fw-semibold">
            我們是這樣開始的...
          </p>
          <button
            className="d-page-btn"
            onClick={() => {
              window.location.href = `/about`
            }}
          >
            ABOUT US
          </button>
        </div>
        <div className={`${styles['story-picture']} col-12 p-0`}>
          <div className="story-text col-6 d-flex d-xl-none flex-column justify-content-around align-items-center p-0 gap-md-5 gap-4">
            <div className="story-img overflow-hidden text-center">
              <img src="/index-img/giphy.gif" alt="" />
            </div>
            <p className="fs-3 text-white text-nowrap fw-semibold m-0">
              我們是這樣開始的...
            </p>
            <button
              className="m-content-btn"
              onClick={() => {
                window.location.href = `/about`
              }}
            >
              ABOUT US
            </button>
          </div>
        </div>
      </div>
      {/* <!-- HOME ABOUT US :關於我們結束--> */}
      {/* <!-- PRODUCT INTRO :產品介紹開始--> */}
      <div className={styles['product-intro']}>
        <div className={styles['product-intro-title']}>OUR PRODUCT</div>
        <div
          className={`${styles['product-picture']} container d-flex flex-column flex-xl-row justify-content-between`}
        >
          <div className="col-lg-4 col-12 px-5 py-3">
            <div
              className={`${styles['product-beans']} bean1 m-0`}
              onClick={() => {
                window.location.href = `/product/00`
              }}
            >
              <img src="/index-img/product1.jpg" alt="" />
              <div className={styles['bean-intro']}>
                精選咖啡豆 <i className="bi bi-arrow-right"></i>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-12 px-5 py-3">
            <div
              className={`${styles['product-beans']} bean2 m-0`}
              onClick={() => {
                window.location.href = `/product/00`
              }}
            >
              <img src="/index-img/product2.jpg" alt="" />
              <div className={styles['bean-intro']}>
                濾掛式咖啡 <i className="bi bi-arrow-right"></i>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-12 px-5 py-3">
            <div
              className={`${styles['product-beans']} bean3 m-0`}
              onClick={() => {
                window.location.href = `/product/00`
              }}
            >
              <img src="/index-img/product3.jpg" alt="" />
              <div className={styles['bean-intro']}>
                膠囊咖啡 <i className="bi bi-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style jsx>{`
        .story-img {
          width: 75%;
          height: 150px;
          & img {
            width: 100%;
            height: 150px;
            object-position: center;
            object-fit: cover;
          }
        }
        @media screen and (max-width: 992px) {
          .story-img {
            width: 90%;
            height: 50px;
            & img {
              width: 100%;
              height: 100%;
              margin: auto;
            }
          }
        }
      `}</style>
    </>
  )
}
