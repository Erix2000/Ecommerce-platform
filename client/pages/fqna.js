import Footer from '@/components/layout/public-version/footer'
import Navbar from '@/components/layout/public-version/navbar'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Fqna() {
  return (
    <>
      <Navbar />

      <div className="fqna-hero d-flex align-items-center justify-content-center">
        {/* <img src="/fqna-hero.jpg" alt="" /> */}
        <div className="fqna-title display-lg-3 fs-4 text-center text-white fw-semibold">
          <div className="mb-lg-5 mb-3">常見問題</div>
          <div className="d-none d-lg-block">Frequency Asked Questions</div>
          <div className="d-block d-lg-none">F A Q s</div>
        </div>
      </div>
      <div className="container">
        <div className="qna">
          <div className="question">Q：精選合作品牌有哪些？</div>
          <div className="answer">
            目前我們有與 Starbucks 星巴克、Blue Bottle Coffee 藍瓶咖啡、Peets
            皮爺咖啡、illy 嘉里咖啡、％Arabica 阿拉比卡、UCC 優仕咖啡、Mr.Brown
            伯朗咖啡、Louisa 路易莎、CAMA 咖碼咖啡、熙舍精品咖啡等 10
            間知名品牌合作。
          </div>
        </div>
        <div className="qna">
          <div className="question">Q：咖啡豆產地來源？</div>
          <div className="answer">
            我們販售的咖啡豆來源非常廣，有來自非洲、亞洲、中南美洲...等，咖啡豆的產地都會標註產品的詳細頁唷
          </div>
        </div>
        <div className="qna">
          <div className="question">Q：門市課程如何預約？</div>
          <div className="answer">
            網站上的課程皆以購買課程的時間為限，若想要修改時間，請於完成訂單的 7
            日內進行退貨。
          </div>
        </div>
        <div className="qna">
          <div className="question">Q：門市在哪裡？</div>
          <div className="answer">
            我們的教室目前在<strong>台北、台中與高雄</strong>
            等三縣市設有教室，更多資訊不妨到
            <Link
              href="/classroom"
              style={{ textDecoration: 'none', color: '#bc955c' }}
            >
              咖啡教室介紹
            </Link>
            看看唷
          </div>
        </div>
        <div className="qna">
          <div className="question">Q：如何線上購買？</div>
          <div className="answer">
            只要到
            <Link
              href="/product/00"
              style={{ textDecoration: 'none', color: '#bc955c' }}
            >
              品牌專區
            </Link>
            與
            <Link
              href="/course/list"
              style={{ textDecoration: 'none', color: '#bc955c' }}
            >
              課程專區
            </Link>
            點選加入購物車，並且於購物車中勾選您本次想結帳的商品，購買完成會顯示訂單的詳細資訊！
          </div>
        </div>
        <div className="qna">
          <div className="question">Q：會員點數累積方式？</div>
          <div className="answer">
            Mr.Bean的會員點數可以透過購物與會員中心的
            <Link
              href="/member/daily-game"
              style={{ textDecoration: 'none', color: '#bc955c' }}
            >
              每日簽到
            </Link>
            來獲得，消費每滿 100 得 1 點，1 點折抵 1 元唷~
          </div>
        </div>
        <div className="qna">
          <div className="question">Q：付款方式有哪些？</div>
          <div className="answer">
            目前提供<strong>信用卡、貨到付款與 LINE PAY</strong>
            ，共有三種付款方式供會員做選擇！
          </div>
        </div>
        <div className="qna">
          <div className="question">Q：寄送方式有哪些？</div>
          <div className="answer">
            目前提供
            <strong>四大超商取貨 (7-11、全家、萊爾富、OK) 與宅配到府</strong>
            ，只要單筆訂單滿 1000 元就可以享受免運的優惠唷
          </div>
        </div>
      </div>

      <Footer />
      <style jsx>{`
        .fqna-hero {
          width: 100%;
          aspect-ratio: 4/1;
          overflow: hidden;
          background: url('/fqna-hero.jpg') no-repeat;
          background-size: cover;
        }
        .qna {
          padding-block: 20px;
          border-bottom: 1px solid #d9d9d9;
          &:hover .question {
            color: #bc955c;
          }
        }
        .question {
          margin-block: 20px;
          font-size: 22px;
          font-weight: 700;
          color: #003e52;
        }
        .answer {
          margin-block: 20px;
          font-size: 22px;
          color: #003e52;
          text-align: justify;
        }
        strong {
          font-weight: 600;
        }
        @media screen and (max-width: 922px) {
          .fqna-hero {
            aspect-ratio: 2/1;
          }
          .qna {
            padding-block: 16px;
            &:hover .question {
              color: #bc955c;
            }
          }
          .question {
            margin-block: 14px;
            font-size: 16px;
          }
          .answer {
            margin-block: 14px;
            font-size: 16px;
          }
        }
      `}</style>
    </>
  )
}
