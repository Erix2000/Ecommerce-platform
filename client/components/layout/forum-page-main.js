import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Main({ children }) {
  const router = useRouter()
  const {category} =router.query
  // const { category, fid } = router.query
  let routeMap
  const getSidebarText = (path) => {
    if(category === "list"){
      routeMap = '全部文章'
    }else if(category === "1"){
      routeMap = '咖啡入門'
    }else if(category === "2"){
      routeMap = '手沖必讀'
    }else if(category === "3"){
      routeMap = '選豆指南'
    }else if(category === '4'){
      routeMap = '咖啡生活'
    }else if(category === '5'){
      routeMap = '器具相關'
    }
     return routeMap 
  }
  return (
    <>
      {/* 主要內容開始 */}
      <main className="main d-md-flex container ">
        {/* 側邊欄開始 */}
        <aside className="aside">
          <div>
            {/* 麵包屑導航開始 */}
            <div className="bread">
              <span>
                <Link href="" className="link">
                  首頁
                </Link>
              </span>
              /
              <span>
                <Link href="/forum/list" className="link">
                  咖啡專欄
                </Link>
              </span>
              /
              <span>
                <Link href="" className="link">
                  {getSidebarText(router.pathname)}
                </Link>
              </span>
            </div>
            {/* 麵包屑導航結束 */}
            {/* 區塊選單開始 */}
            <div className="block-menu">
              <label
                htmlFor="block-mainmenu"
                className="form-label aside-title"
              >
                專欄列表
              </label>
              <ul className="block-mainmenu mb-3">
                <li>
                  <Link href="/forum/list" className="link">
                    <div className="aside-dot" />
                    全部文章
                  </Link>
                </li>
                <li>
                  <Link href="/forum/1" className="link">
                    <div className="aside-dot" />
                    基礎咖啡入門
                  </Link>
                </li>
                <li>
                  <Link href="/forum/2" className="link">
                    <div className="aside-dot" />
                    手沖咖啡必讀
                  </Link>
                </li>
                <li>
                  <Link href="/forum/3" className="link">
                    <div className="aside-dot" />
                    咖啡選豆指南
                  </Link>
                </li>
                <li>
                  <Link href="/forum/4" className="link">
                    <div className="aside-dot" />
                    品味咖啡生活
                  </Link>
                </li>
                <li>
                  <Link href="/forum/5" className="link">
                    <div className="aside-dot" />
                    咖啡器具相關
                  </Link>
                </li>
              </ul>
            </div>
            {/* 區塊選單結束 */}
          </div>
        </aside>
        {/* 側邊欄結束 */}
        {/* 主要內容區段開始 */}
        <div className="main-content container">{children}</div>
        {/* 主要內容區段結束 */}
      </main>
      {/* 主要內容結束 */}
    </>
  )
}
