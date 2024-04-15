import React, { useEffect } from 'react'
import Link from 'next/link'
import { useLecturer } from '@/hooks/use-lecturer'
import { useRouter } from 'next/router'

export default function Main({ children }) {
  const { lecturer } = useLecturer()
  const router = useRouter()

  const getSidebarText = (path) => {
    const routeMap = {
      '/member/user-info': '會員資料',
      '/member/order': '歷史訂單',
      '/member/daily-game': '每日簽到',
      '/member/comment': '評論紀錄',
      '/member/coupon': '優惠券',
      '/member/favorite': '我的收藏',
      '/member/course': '我的課程',
      '/member/i-want-lecturer': '講師招募',
      '/member/lecturer-info': '講師資料',
      '/member/forum-manage': '文章管理',
      '/member/lecturer-info-class': '課程檢視',
      '/member/order/[oid]': '訂單詳細資料',
      '/member/user-info-revise': '修改會員資料',
      '/member/edit-password': '修改密碼',
      '/member/user-info-point': '點數紀錄',
      '/forum/forum-create': '專欄發佈',
      '/forum/forum-revise/[category]/[fid]': '專欄編輯',
    }
    // return routeMap[path] || '未知頁面'
    return routeMap[path] || '專欄編輯'
  }

  return (
    <>
      {/* 主要內容開始 */}
      <main className="main d-md-flex container ">
        {/* 側邊欄開始 */}
        {/* START: 手機版會員中心導覽列 */}
        <div className="member-center-nav d-md-none">
          <ul className="member-center-list">
            <li>
              <Link href="/member/user-info">會員資料</Link>
            </li>
            <li>
              <Link href="/member/order">歷史訂單</Link>
            </li>
            <li>
              <Link href="/member/daily-game">每日簽到</Link>
            </li>
            <li>
              <Link href="/member/comment">評論紀錄</Link>
            </li>
            <li>
              <Link href="/member/coupon">優惠券</Link>
            </li>
            <li>
              <Link href="/member/favorite">我的收藏</Link>
            </li>
            <li>
              <Link href="/member/course">我的課程</Link>
            </li>
            |
            {lecturer.isLecturer ? (
              <>
                <li className="active">
                  <Link href="/member/lecturer-info">講師資料</Link>
                </li>
                <li>
                  <Link href="/member/forum-manage">文章管理</Link>
                </li>
                <li>
                  <Link href="/member/lecturer-info-class">課程檢視</Link>
                </li>
              </>
            ) : (
              <li>
                <Link href="/member/i-want-lecturer">成為講師</Link>
              </li>
            )}
          </ul>
        </div>
        {/* END: 手機版會員中心導覽列 */}
        <aside className="aside">
          <div>
            {/* 麵包屑導航開始 */}
            <div className="bread">
              <span>
                <Link href="/" className="link">
                  首頁
                </Link>
              </span>
              /
              <span>
                <Link href="/member/user-info" className="link">
                  會員中心
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
                會員中心
              </label>
              <ul className="block-mainmenu mb-3">
                <li>
                  <Link href="/member/user-info" className="link">
                    <div className="aside-dot" />
                    會員資料
                  </Link>
                </li>
                <li>
                  <Link href="/member/order" className="link">
                    <div className="aside-dot" />
                    歷史訂單
                  </Link>
                </li>
                <li>
                  <Link href="/member/daily-game" className="link">
                    <div className="aside-dot" />
                    每日簽到
                  </Link>
                </li>
                <li>
                  <Link href="/member/comment" className="link">
                    <div className="aside-dot" />
                    評論紀錄
                  </Link>
                </li>
                <li>
                  <Link href="/member/coupon" className="link">
                    <div className="aside-dot" />
                    優惠卷
                  </Link>
                </li>
                <li>
                  <Link href="/member/favorite" className="link">
                    <div className="aside-dot" />
                    我的收藏
                  </Link>
                </li>
                <li>
                  <Link href="/member/course" className="link">
                    <div className="aside-dot" />
                    我的課程
                  </Link>
                </li>
              </ul>

              <ul className="block-mainmenu mb-3">
                <hr style={{ border: '1px solid #003e52' }} />
                {lecturer.isLecturer ? (
                  <>
                    <li>
                      <Link href="/member/lecturer-info" className="link">
                        <div className="aside-dot" />
                        講師資料
                      </Link>
                    </li>
                    <li>
                      <Link href="/member/forum-manage" className="link">
                        <div className="aside-dot" />
                        文章管理
                      </Link>
                    </li>
                    <li>
                      <Link href="/member/lecturer-info-class" className="link">
                        <div className="aside-dot" />
                        課程檢視
                      </Link>
                    </li>
                  </>
                ) : (
                  <Link
                    type="button"
                    href="/member/i-want-lecturer"
                    className="to-become"
                  >
                    成為講師
                  </Link>
                )}
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
