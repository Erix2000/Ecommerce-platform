import React, { useEffect } from 'react'

export default function Main() {
  // let aaa
  // useEffect(() => {
  //   aaa = document.querySelector('.main')
  // }, [])

  return (
    <>
      <>
        {/* 主要內容開始 */}
        <main className="main d-md-flex container">
          {/* 側邊欄開始 */}
          {/* START: 手機版會員中心導覽列 */}
          <div className="member-center-nav d-md-none">
            <ul className="member-center-list">
              <li>會員資料</li>
              <li>歷史訂單</li>
              <li>每日簽到</li>
              <li>評論紀錄</li>
              <li>優惠券</li>
              <li>收藏商品</li>|<li className="active">講師資料</li>
              <li>文章管理</li>
              <li>課程檢視</li>
            </ul>
          </div>
          {/* END: 手機版會員中心導覽列 */}
          <aside className="aside">
            <div>
              {/* 麵包屑導航開始 */}
              <div className="bread">
                <span>
                  {' '}
                  <a href="" className="link">
                    首頁
                  </a>{' '}
                </span>
                /
                <span>
                  {' '}
                  <a href="" className="link">
                    課程專區
                  </a>{' '}
                </span>
                /
                <span>
                  <a href="" className="link">
                    全部課程
                  </a>
                </span>
              </div>
              {/* 麵包屑導航結束 */}
              {/* 區塊選單開始 */}
              <div className="block-menu">
                <label
                  htmlFor="block-mainmenu"
                  className="form-label aside-title"
                >
                  課程專區
                </label>
                <ul className="block-mainmenu mb-3">
                  <li>
                    <a href="#" className="link">
                      <div className="aside-dot" />
                      全部課程
                    </a>
                  </li>
                  <li>
                    <a href="#" className="link">
                      <div className="aside-dot" />
                      體驗課程
                    </a>
                  </li>
                  <li>
                    <a href="#" className="link">
                      <div className="aside-dot" />
                      一般課程
                    </a>
                  </li>
                  <li>
                    <a href="#" className="link">
                      <div className="aside-dot" />
                      SCA證照課程
                    </a>
                  </li>
                </ul>
              </div>
              {/* 區塊選單結束 */}
              <hr style={{ border: '1px solid #003e52' }} />
              {/* 篩選區段開始 */}
              <div className="aside-sectitle">篩選</div>
              <div className="block-menu">
                <label
                  htmlFor="customRange1"
                  className="aside-thrtitle form-label"
                >
                  價格
                </label>
                <input
                  type="range"
                  className="form-range"
                  id="price-range"
                  min={100}
                  max={200}
                />
              </div>
              {/* 篩選區段結束 */}
              {/* 第一選單區塊開始 */}
              <div className="block-firstmenu block-menu">
                <div className="aside-thrtitle">課程總類</div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue=""
                    id="mainmenu-first"
                  />
                  <label
                    className="form-check-label link"
                    htmlFor="mainmenu-first"
                  >
                    烘豆
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue=""
                    id="mainmenu-second"
                    defaultChecked=""
                  />
                  <label
                    className="form-check-label link"
                    htmlFor="mainmenu-second"
                  >
                    手沖
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue=""
                    id="mainmenu-third"
                    defaultChecked=""
                  />
                  <label
                    className="form-check-label link"
                    htmlFor="mainmenu-third"
                  >
                    拉花
                  </label>
                </div>
              </div>
              <div className="block-submenu block-menu">
                <div className="aside-thrtitle">開課教室</div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue=""
                    id="secmenu-first"
                  />
                  <label
                    className="form-check-label link"
                    htmlFor="secmenu-first"
                  >
                    台北教室
                  </label>
                </div>
                {/* 第一選單區塊結束 */}
                {/* 第二選單區塊開始 */}
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue=""
                    id="secmenu-second"
                    defaultChecked=""
                  />
                  <label
                    className="form-check-label link"
                    htmlFor="secmenu-second"
                  >
                    台中教室
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue=""
                    id="secmenu-third"
                    defaultChecked=""
                  />
                  <label
                    className="form-check-label link"
                    htmlFor="secmenu-third"
                  >
                    台南教室
                  </label>
                </div>
              </div>
              {/* 第二選單區塊結束 */}
              {/* 第三選單區塊開始 */}
              <div className="block-thirdmenu block-menu">
                {/* 表單選項開始 */}
                <div className="aside-thrtitle">開課日期</div>
                {/* <select
                  className="form-select"
                  aria-label="Default select example"
                >
                  <option selected="">全部</option>
                  <option value={1}>近一週</option>
                  <option value={2}>近一個月</option>
                </select> */}
                {/* 表單選項結束 */}
              </div>
              {/* 第三選單區塊結束 */}
            </div>
            {/* 按鈕群組開始 */}
            <div className="btn-group">
              <a type="button" className="text-center col-12 aside-button1">
                篩選
              </a>
              <a type="button" className="text-center col-12 aside-button2">
                重新篩選
              </a>
            </div>
            {/* 按鈕群組結束 */}
          </aside>
          {/* 側邊欄結束 */}
          {/* 主要內容區段開始 */}
          <div className="content container">
            我是內文我是內文我是內文我是內文我是內文我是內文我是內文我是內文我是內文我是內文我是內文我是內文我是內文我是內文我是內文我是內文我是內文我是內文我是內文我是內文我是內文我是內文
          </div>
          {/* 主要內容區段結束 */}
        </main>
        {/* 主要內容結束 */}
      </>
    </>
  )
}
