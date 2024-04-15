import { useEffect, useRef, useState } from 'react'
import styles from './total-forum.module.scss'
import ArticleFavorite from '../member-center/favorite/article-favorite'
import { useRouter } from 'next/router'

import Image from 'next/image'
import Link from 'next/link'
import { set } from 'lodash'

// 會員鉤子
import { useAuth } from '@/hooks/use-auth'

// 定義總論壇元件
export default function TotalForum({
  forumData = {},
  userLikeArr = [],
  sortFun = {},
  likeNotify = () => {},
  unlikeNotify = () => {},
}) {
  // ----------------
  // console.log(userLikeArr)
  const { auth } = useAuth()
  const router = useRouter()
  // ------------------------

  // 查看列表頁所有文章 (forumData所有內容)
  // console.log(forumData)
  // ----------------

  // 使用 useState Hook 管理論壇資料狀態
  const [forumDatas, setForumDatas] = useState([])
  // 管理當前頁面狀態
  const [currentPage, setCurrentPage] = useState(1)
  // 每頁顯示的資料數量
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // --------------------------------
  // 下拉選單出現
  const [selBoxToggle, setSelBoxToggle] = useState(false)

  // 下拉選單文字及值設定
  const [selBox, setSelBox] = useState('')
  const selboxTitle = useRef(null)
  const [isSort, setIsSort] = useState(false)
  // --------------------------------

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  //每一頁要顯示內容 (NEW)
  // const [currentItems, setCurrentItems] = useState('')
  // setCurrentItems(forumData.slice(indexOfFirstItem, indexOfLastItem))

  const currentItems = forumData.slice(indexOfFirstItem, indexOfLastItem)
  // 每一頁要顯示內容

  const totalPages = Math.ceil(forumData.length / itemsPerPage)
  let startPage = Math.max(currentPage - 1, 1)
  let endPage = Math.min(startPage + 2, totalPages)

  const renderPageNumbers = []
  let localSort = ''
  useEffect(() => {
    // console.log(productData)
    // setProductDataFin(productData)
    console.log(isSort)

    // 把點選的分類狀態塞回去
    localSort = localStorage.getItem('sort')
    // 如果有點選篩選，才把狀態塞回去，如果是重新整理就沒有
    // if(isSort){
    // console.log(isSort)
    if (localSort === '0') {
      setSelBox('無排序')
    } else if (localSort === '1') {
      setSelBox('日期最新')
    } else if (localSort === '2') {
      setSelBox('日期最舊')
    }

    // }
  }, [forumData, router.isReady, auth])

  // 如果不是在第一頁，則顯示向前翻頁的箭頭
  if (currentPage > 1) {
    renderPageNumbers.push(
      <li key="prev" className={styles.prev}>
        <a
          onClick={() => setCurrentPage(currentPage - 1)}
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
      <li key={number} className={number === currentPage ? styles.active : ''}>
        <a onClick={() => setCurrentPage(number)} href="#">
          {number}
        </a>
      </li>
    )
  }

  // 如果不是在最後一頁，則顯示向後翻頁的箭頭
  if (currentPage < totalPages) {
    renderPageNumbers.push(
      <li key="next" className={styles.next}>
        <a
          onClick={() => setCurrentPage(currentPage + 1)}
          href="#"
          aria-label="Next"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    )
  }

  return (
    <div className={`container ${styles['content']}`}>
      <div className={styles['forum-class']}>
        {/* 全部文章 或 文章分類 */}
        {forumData && forumData.length < 20
          ? forumData[0]?.forum_category_name
          : '全部文章'}
      </div>
      <div
        className={`d-flex justify-content-between pt-5 ${styles['writer']}`}
      >
        <div className={`${styles['total-page']}`}>
          共 {forumData.length} 篇文章
        </div>

        {/* 下拉式選單開始 */}
        {/*  關閉eslint偵測 */}
        {/* eslint-disable */}
        <div className={`${styles['input-box']}`}>
          <div className={`custom-select ${styles['custom-select']}`}>
            <input
              type="text"
              className="d-none"
              id="customSelectValue"
              value={selBox}
              // ref={sortRef}
            />
            <div
              className={`selected ${styles['selected']}`}
              onClick={(e) => {
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
                data-value="無排序"
                onClick={(e) => {
                  selboxTitle.current.nextElementSibling.style.display = 'none'
                  setSelBox(e.currentTarget.getAttribute('data-value'))
                  sortFun(0)
                  // setIsSort(false)
                }}
              >
                無排序
              </div>
              <div
                className={`custom-option ${styles['custom-option']}`}
                data-value="日期最新"
                onClick={(e) => {
                  selboxTitle.current.nextElementSibling.style.display = 'none'
                  setSelBox(e.currentTarget.getAttribute('data-value'))
                  sortFun(1)
                  // setIsSort(true)
                }}
              >
                日期最新
              </div>
              <div
                className={`custom-option ${styles['custom-option']}`}
                data-value="日期最舊"
                onClick={(e) => {
                  selboxTitle.current.nextElementSibling.style.display = 'none'
                  setSelBox(e.currentTarget.getAttribute('data-value'))
                  sortFun(2)
                  // setIsSort(true)
                }}
              >
                日期最舊
              </div>
            </div>
          </div>
        </div>
        {/* 下拉式選單結束 */}
        {/* eslint-disable */}
      </div>

      {currentItems.map((value, index) => (
        <ArticleFavorite
          key={index}
          forumData={value}
          userLikeArr={userLikeArr}
          currentPage={currentPage}
          unlikeNotify={unlikeNotify}
          likeNotify={likeNotify}
        />
      ))}

      <div className={styles['product-list-pag']}>
        <ul className={styles['product-list-ul']}>{renderPageNumbers}</ul>
      </div>
    </div>
  )
}
