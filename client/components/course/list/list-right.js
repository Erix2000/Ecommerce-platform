import React, { useState, useRef, useEffect } from 'react'
import styles from './course-list.module.scss'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Carousel from 'react-bootstrap/Carousel'
import CourseCard from './course-card'
import { Image } from 'react-bootstrap'

// 會員鉤子
import { useAuth } from '@/hooks/use-auth'

export default function listRight({
  courseData = {},
  addItem = {},
  userLikeArr = {},
  locations = {},
  onButtonClick = () => {},
  sortFun = () => {},
  searchFun = () => {},
  priceFun = () => {},
  asideBtn = () => {},
  selArrAllClear = () => {},
  asideBtnClear = () => {},
  likeNotify = () => {},
  unlikeNotify= () =>{}
}) {
  const { auth } = useAuth()
  const router = useRouter()
  let category

  let renderPageNumbers = []
  // 分頁
  const [renderPageNumbersF, setRenderPageNumbersF] = useState([])
  const [nowPage, setNowPage] = useState(1)
  const [everyPageNum, setEveryPageNum] = useState(12)

  // 輪播圖
  const [index, setIndex] = useState(0)
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex)
  }

  // 篩選過後的資料
  const [courseDataFin, setCourseDataFin] = useState([])
  // 要顯示在分頁的資料
  const [nowCourseData, setNowCourseData] = useState([])

  // 抓取 price 屬性的最大值和最小值
  let maxPrice, minPrice
  if (courseData.length === 0) {
    maxPrice = 0
    minPrice = 0
  } else {
    maxPrice = Math.max(
      ...courseData.map((course_list) => course_list.course_price)
    )
    minPrice = Math.min(
      ...courseData.map((course_list) => course_list.course_price)
    )
  }

  // 價格range
  const [price, setPrice] = useState([minPrice, maxPrice])
  //  console.log(courseData)
  // console.log('最大價格:', maxPrice);
  // console.log('最小價格:', minPrice);

  useEffect(() => {
    priceFun(price)
  }, [price])

  // 下拉選單出現
  const [selBoxToggle, setSelBoxToggle] = useState(false)
  // 下拉選單文字及值設定
  const [selBox, setSelBox] = useState('')
  const selboxTitle = useRef(null)

  // 搜尋
  let searchRef = useRef(null)
  // 排序
  let sortRef = useRef(null)
  const [isSort, setIsSort] = useState(false)
  // 篩選
  let tagRef = useRef(null)
  // 價錢
  let priceRef = useRef(null)

  // 一開始和篩選時變換(這要獨立出來寫因為當篩選的時候只有商品的資料要換掉)
  // 這裡應該只是一開始的狀態
  let localSort = ''
  // 一開始和篩選時變換(這要獨立出來寫因為當篩選的時候只有商品的資料要換掉)
  // 這裡應該只是一開始的狀態
  useEffect(() => {
    console.log(courseData)
    setCourseDataFin(courseData)
    console.log(isSort)

    // 把點選的分類狀態塞回去
    localSort = localStorage.getItem('sort')
    // 如果有點選篩選，才把狀態塞回去，如果是重新整理就沒有
    // if(isSort){
    // console.log(isSort)
    if (localSort === '0') {
      setSelBox('無排序')
    } else if (localSort === '1') {
      setSelBox('價格由低到高')
    } else if (localSort === '2') {
      setSelBox('價格由高到低')
    }

    // }
  }, [courseData, router.isReady])

  useEffect(() => {
    console.log(courseDataFin)
    if (Array.isArray(courseDataFin)) {
      console.log(courseDataFin)
      // 分頁開始
      setNowCourseData(
        courseDataFin.slice(
          everyPageNum * (nowPage - 1),
          everyPageNum * nowPage
        )
      )
      let totalPage = Math.ceil(courseDataFin.length / 12)
      // console.log(totalPage)
      // console.log(everyPageNum*(nowPage-1))
      // console.log(nowProductData)
      // 分頁陣列
      let totalPageArr = []
      for (let i = 1; i < totalPage + 1; i++) {
        totalPageArr.push(i)
      }
      // console.log(totalPageArr)
      // 後來寫的分頁
      let startPage = Math.max(nowPage - 1, 1)
      let endPage = Math.min(startPage + 2, totalPage)

      const renderPageNumbers = []

      // 如果不是在第一頁，則顯示向前翻頁的箭頭
      if (nowPage > 1) {
        renderPageNumbers.push(
          <li key="prev" className={styles.prev}>
            <a
              onClick={() => setNowPage(nowPage - 1)}
              href="#"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
        )
      }

      for (let number = startPage; number <= endPage; number++) {
        renderPageNumbers.push(
          <li key={number} className={number === nowPage ? styles.active : ''}>
            <a onClick={() => setNowPage(number)} href="#">
              {number}
            </a>
          </li>
        )
      }

      // 如果不是在最後一頁，則顯示向後翻頁的箭頭
      if (nowPage < totalPage) {
        renderPageNumbers.push(
          <li key="next" className={styles.next}>
            <a
              onClick={() => setNowPage(nowPage + 1)}
              href="#"
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        )
      }

      setRenderPageNumbersF(renderPageNumbers)

      // 分頁結束
    }
  }, [courseDataFin, nowPage])

  return (
    <>
      {/* 手機板輪播圖 */}
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        interval={2000}
        className={`carousel ${styles['carousel-m']}`}
      >
        <Carousel.Item>
          <img
            className={`d-block w-100 ${styles['carousel-img']}`}
            style={{ height: '250px', objectFit: 'cover' }}
            src="/course-img/slide2.jpg"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className={`d-block w-100 ${styles['carousel-img']}`}
            style={{ height: '250px', objectFit: 'cover' }}
            src="/course-img/slide1.jpg"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className={`d-block w-100 ${styles['carousel-img']}`}
            style={{ height: '250px', objectFit: 'cover' }}
            src="/course-img/slide3.jpg"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>

      {/* 手機板篩選按鈕 */}
      <div className={`middle-content-m row ${styles['middle-content-m']}`}>
        <div
          type="button"
          className={`brand mbox col-4 ${styles['brand']} ${styles['mbox']}`}
          variant="primary"
          // onClick={handleShowBrand}
          onClick={() => {
            handleShow()
            setVisibleTab('1')
          }}
        >
          品牌&nbsp;
          <i className="bi bi-chevron-down" />
        </div>
        <div
          type="button"
          className={`select mbox col-4 ${styles['select']} ${styles['mbox']}`}
          variant="primary"
          // onClick={handleShowSel}
          onClick={() => {
            handleShow()
            setVisibleTab('2')
          }}
        >
          篩選&nbsp;
          <i className="bi bi-chevron-down" />
        </div>
        <div
          type="button"
          className={`order mbox col-4 ${styles['mbox']} ${styles['order']}`}
          variant="primary"
          // onClick={handleShowOrder}
          onClick={() => {
            handleShow()
            setVisibleTab('3')
          }}
        >
          排序&nbsp;
          <i className="bi bi-chevron-down" />
        </div>

        <div
          className={`order-menu mmenu ${styles['order-menu']} ${styles['mmenu']}`}
        >
          <i className="bi bi-x-lg menu-close-btn" />
          <div className="menu-title">分類</div>
          <label htmlFor="order1">
            <input id="order1" type="radio" name="order" defaultValue={1} />
            由低到高
          </label>
          <label htmlFor="order2">
            <input id="order2" type="radio" name="order" defaultValue={2} />
            由高到低
          </label>
        </div>
      </div>

      {/* 頁面開始 */}
      <div className={`container ${styles['content']}`}>
        {/* 電腦版輪播圖 */}
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          interval={2000}
          className={`carousel ${styles['carousel']}`}
        >
          <Carousel.Item>
            <img
              className={`d-block w-100 ${styles['carousel-img']}`}
              style={{ height: '420px', objectFit: 'cover' }}
              src="/course-img/slide2.jpg"
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className={`d-block w-100 ${styles['carousel-img']}`}
              style={{ height: '420px', objectFit: 'cover' }}
              src="/course-img/slide1.jpg"
              alt="Second slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className={`d-block w-100 ${styles['carousel-img']}`}
              style={{ height: '420px', objectFit: 'cover' }}
              src="/course-img/slide3.jpg"
              alt="Third slide"
            />
          </Carousel.Item>
        </Carousel>

        {/* 電腦版中間內容 */}
        <div className={`middle-content ${styles['middle-content']}`}>
          <div className={`allnum ${styles['allnum']}`}>
            共 {courseData.length} 樣商品
          </div>
          <div className={`${styles['input-box']}`}>
            <div className={`custom-select ${styles['custom-select']}`}>
              <input
                type="text"
                className="d-none"
                id="customSelectValue"
                value={selBox}
                ref={sortRef}
              />
              <div
                className={`selected ${styles['selected']}`}
                onClick={() => {
                  setSelBoxToggle((p) => !p)
                }}
                ref={selboxTitle}
              >
                {selBox === '' ? '無排序' : selBox}&nbsp;
                <i className="bi bi-chevron-down" />
              </div>
              <div
                className={`custom-options ${styles['custom-options']}`}
                style={{ display: selBoxToggle ? 'block' : 'none' }}
              >
                <div
                  className={`custom-option ${styles['custom-option']}`}
                  // onClick={selBoxTitleFun(this)}
                  data-value="無排序"
                  onClick={(e) => {
                    selboxTitle.current.nextElementSibling.style.display =
                      'none'

                    setSelBox(e.currentTarget.getAttribute('data-value'))
                    sortFun(0)
                    setIsSort(true)
                  }}
                >
                  無排序
                </div>
                <div
                  className={`custom-option ${styles['custom-option']}`}
                  data-value="價格由低到高"
                  onClick={(e) => {
                    selboxTitle.current.nextElementSibling.style.display =
                      'none'

                    setSelBox(e.currentTarget.getAttribute('data-value'))
                    sortFun(1)
                    setIsSort(true)
                  }}
                >
                  價格由低到高
                </div>
                <div
                  className={`custom-option ${styles['custom-option']}`}
                  data-value="價格由高到低"
                  onClick={(e) => {
                    selboxTitle.current.nextElementSibling.style.display =
                      'none'

                    setSelBox(e.currentTarget.getAttribute('data-value'))
                    sortFun(2)
                    setIsSort(true)
                  }}
                >
                  價格由高到低
                </div>
                <div
                  className={`custom-option ${styles['custom-option']}`}
                  data-value="本週開課"
                  onClick={(e) => {
                    selboxTitle.current.nextElementSibling.style.display =
                      'none'

                    setSelBox(e.currentTarget.getAttribute('data-value'))
                    sortFun(3)
                    setIsSort(true)
                  }}
                >
                  近一週開課
                </div>
                <div
                  className={`custom-option ${styles['custom-option']}`}
                  data-value="本月開課"
                  onClick={(e) => {
                    selboxTitle.current.nextElementSibling.style.display =
                      'none'

                    setSelBox(e.currentTarget.getAttribute('data-value'))
                    sortFun(4)
                    setIsSort(true)
                  }}
                >
                  近一個月開課
                </div>
              </div>
            </div>
            <div className={`search ${styles['search']}`}>
              <input
                type="text"
                placeholder="搜尋商品"
                // value={searchValue}
                // onChange={(e) => setSearchValue(e.target.value)}
                ref={searchRef}
              />

              <div
                type="button"
                className={`search-btn ${styles['search-btn']}`}
                onClick={() => {
                  searchFun(searchRef.current.value)
                }}
              >
                <i className="bi bi-search" />
              </div>
            </div>
          </div>
        </div>

        {/* 商品列表 */}
        <div className={`course-list row ${styles['course-list']}`}>
          {Array.isArray(courseData) &&
            nowCourseData.map((courseItem, i) => {
              return (
                <CourseCard
                  key={i}
                  courseItem={courseItem}
                  userLikeArr={userLikeArr}
                  nowPage={nowPage}
                  likeNotify={likeNotify}
                  unlikeNotify={unlikeNotify}
                />
              )
            })}
        </div>

        {/* 分頁 */}
        <div className={styles['course-list-pag']}>
          <ul className={styles['course-list-ul']}>{renderPageNumbersF}</ul>
        </div>
      </div>
    </>
  )
}
