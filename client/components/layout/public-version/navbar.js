import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import navLogo from '@/assets/img/logo/logo-indigo.svg'
import { useCart } from '@/hooks/use-cart'
import UserInfoCard from '@/components/layout/userInfo-card'
import CartCard from '@/components/cart/cartCard'

export default function Navbar({ selArrAllClear = () => {} }) {
  const { productLength, courseLength, cart } = useCart()
  const [showUserInfo, setShowUserInfo] = useState(false)
  const [persistUserInfoCard, setPersistUserInfoCard] = useState(false) // 通过点击控制持续显示
  const [visiable, setVisiable] = useState(false)

  // 控制鼠标悬停显示用户信息卡片
  const handleMouseEnter = () => {
    if (!persistUserInfoCard) {
      setShowUserInfo(true)
    }
  }

  // 控制鼠标离开隐藏用户信息卡片
  const handleMouseLeave = () => {
    if (!persistUserInfoCard) {
      setShowUserInfo(false)
    }
  }
  //cart card
  const handleCartCardEnter = () => {
    setVisiable(true)
  }
  const handleCartCardLeave = () => {
    setVisiable(false)
  }

  // 控制点击切换用户信息卡片的持续显示
  const handleUserIconClick = () => {
    const currentPersistState = !persistUserInfoCard
    setPersistUserInfoCard(currentPersistState)
    setShowUserInfo(currentPersistState)
  }
  return (
    <>
      <div
        className="nav-m-bgc "
        role="presentation"
        onClick={() => {
          document.querySelector('.nav-m').classList.remove('nav-active')
          document
            .querySelector('.nav-m-bgc')
            .classList.remove('nav-m-bgc-active')
        }}
      ></div>
      {/* 手機點掉的機制 */}
      {/* START: 手機側邊欄 */}
      <nav className="nav-m">
        <ul className="main-options">
          <li className="product-category">
            <span className="product-category-title">商品分類</span>
            <ul className="sub-options product-category-list">
              {/* className="now"下面的li加上這個class就會亮 */}

              <Link href="/product/00" onClick={selArrAllClear}>
                <li>全部商品</li>
              </Link>
              <Link href="/product/01" onClick={selArrAllClear}>
                <li>星巴克 STARBUCKS</li>
              </Link>
              <Link href="/product/02" onClick={selArrAllClear}>
                <li>藍瓶咖啡 BLUE BOTTLE COFFEE</li>
              </Link>
              <Link href="/product/03" onClick={selArrAllClear}>
                <li>皮爺咖啡 PEET'S COFFEE</li>
              </Link>
              <Link href="/product/04" onClick={selArrAllClear}>
                <li>嘉里咖啡 ILLYCAFFE</li>
              </Link>
              <Link href="/product/05" onClick={selArrAllClear}>
                <li>阿拉比卡 ％ARABICA</li>
              </Link>
              <Link href="/product/06" onClick={selArrAllClear}>
                <li>優仕咖啡 UCC</li>
              </Link>
              <Link href="/product/07" onClick={selArrAllClear}>
                <li>伯朗咖啡 MR. BROWN</li>
              </Link>
              <Link href="/product/08" onClick={selArrAllClear}>
                <li>路易莎 LOUISA COFFEE</li>
              </Link>
              <Link href="/product/09" onClick={selArrAllClear}>
                <li>咖碼咖啡 CAMA</li>
              </Link>
              <Link href="/product/10" onClick={selArrAllClear}>
                <li>熙舍精品咖啡 CICILIANO COFFEE</li>
              </Link>
            </ul>
          </li>
          <li className="course-category">
            <span className="product-category-title">課程專區</span>
            <ul className="sub-options course-category-list">
              <Link href="/course/list" onClick={selArrAllClear}>
              <li>全部課程</li>
              </Link>
              <Link href="/course/2" onClick={selArrAllClear}>
                <li>體驗課程</li>
              </Link>
              <Link href="/course/1" onClick={selArrAllClear}>
                <li>一般課程</li>
              </Link>
              <Link href="/course/3" onClick={selArrAllClear}>
                <li>證照課程</li>
              </Link>
            </ul>
          </li>
          <li className="coffee-forem">
            <span className="product-category-title">咖啡專欄</span>
            <ul className="sub-options coffee-forem-list">
              <Link href="/forum/list" onClick={selArrAllClear}>
              <li>全部文章</li></Link>
              <Link href="/forum/1" onClick={selArrAllClear}>
              <li>基礎咖啡入門</li></Link>
              <Link href="/forum/2" onClick={selArrAllClear}>
              <li>手沖咖啡必讀</li></Link>
              <Link href="/forum/3" onClick={selArrAllClear}>
              <li>咖啡選豆指南</li></Link>
              <Link href="/forum/4" onClick={selArrAllClear}>
              <li>品味咖啡生活</li></Link>
              <Link href="/forum/5" onClick={selArrAllClear}>
              <li>咖啡器具相關</li></Link>
            </ul>
          </li>
          <li>
            <Link href="/about">關於我們</Link>
          </li>
          <li>常見問題</li>
        </ul>
      </nav>
      {/* END: 手機側邊欄 */}
      {/* 頁首開始 */}
      <header className="header text-center">
        {/* nav開始 */}
        <div className="nav row">
          {/* 商標開始 */}
          <div className="header-logo col-2">
            <Link href="/">
              <Image src={navLogo} width={130} height={61.05} alt="nav-logo" />
            </Link>
          </div>
          {/* 商標結束 */}
          {/* nav連結開始 */}
          <div className="header-ul col-8">
            <ul className="nav-links">
              <li className="product-link nav-li">
                <Link href="/product/00" className="text-center nav-link link">
                  品牌專區
                  <div className="nav-dot" />
                </Link>
                <div className="brand-menu header-mainmenu">
                  <ul>
                    <li>
                      <Link href="/product/00" className="menu-link link">
                        <div className="menu-dot" />
                        全部品牌
                      </Link>
                    </li>
                    <li>
                      <Link href="/product/01" className="menu-link link">
                        <div className="menu-dot" />
                        星巴克 STARBUCKS
                      </Link>
                    </li>
                    <li>
                      <Link href="/product/02" className="menu-link link">
                        <div className="menu-dot" />
                        藍瓶咖啡 BLUE BOTTLE COFFEE
                      </Link>
                    </li>
                    <li>
                      <Link href="/product/03" className="menu-link link">
                        <div className="menu-dot" />
                        皮爺咖啡 PEET'S COFFEE
                      </Link>
                    </li>
                    <li>
                      <Link href="/product/04" className="menu-link link">
                        <div className="menu-dot" />
                        嘉里咖啡 ILLYCAFFE
                      </Link>
                    </li>
                    <li>
                      <Link href="/product/05" className="menu-link link">
                        <div className="menu-dot" />
                        阿拉比卡 ％ARABICA
                      </Link>
                    </li>
                    <li>
                      <Link href="/product/06" className="menu-link link">
                        <div className="menu-dot" />
                        優仕咖啡 UCC
                      </Link>
                    </li>
                    <li>
                      <Link href="/product/07" className="menu-link link">
                        <div className="menu-dot" />
                        伯朗咖啡 MR. BROWN
                      </Link>
                    </li>
                    <li>
                      <Link href="/product/08" className="menu-link link">
                        <div className="menu-dot" />
                        路易莎 LOUISA COFFEE
                      </Link>
                    </li>
                    <li>
                      <Link href="/product/09" className="menu-link link">
                        <div className="menu-dot" />
                        咖碼咖啡 CAMA
                      </Link>
                    </li>
                    <li>
                      <Link href="/product/10" className="menu-link link">
                        <div className="menu-dot" />
                        熙舍精品咖啡 CICILIANO COFFEE
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="class-link nav-li">
                <Link
                  href="/course/list"
                  onClick={selArrAllClear}
                  className="text-center nav-link link"
                >
                  課程專區
                  <div className="nav-dot" />
                </Link>
                <div className="class-menu header-mainmenu">
                  <ul>
                    <li>
                      <Link
                        href="/course/list"
                        onClick={selArrAllClear}
                        className="menu-link link"
                      >
                        <div className="menu-dot" />
                        全部課程
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/course/2"
                        onClick={selArrAllClear}
                        className="menu-link link"
                      >
                        <div className="menu-dot" />
                        體驗課程
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/course/1"
                        onClick={selArrAllClear}
                        className="menu-link link"
                      >
                        <div className="menu-dot" />
                        一般課程
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/course/3"
                        onClick={selArrAllClear}
                        className="menu-link link"
                      >
                        <div className="menu-dot" />
                        SCA證照課程
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="article-link nav-li">
                <Link href="/forum/list" className="nav-link link">
                  咖啡專欄
                  <div className="nav-dot" />
                </Link>
                <div className="article-menu header-mainmenu">
                  <ul>
                    <li>
                      <Link href="/forum/list" className="menu-link link">
                        <div className="menu-dot" />
                        全部文章
                      </Link>
                    </li>
                    <li>
                      <Link href="/forum/1" className="menu-link link">
                        <div className="menu-dot" />
                        基礎咖啡入門
                      </Link>
                    </li>
                    <li>
                      <Link href="/forum/2" className="menu-link link">
                        <div className="menu-dot" />
                        手沖咖啡必讀
                      </Link>
                    </li>
                    <li>
                      <Link href="/forum/3" className="menu-link link">
                        <div className="menu-dot" />
                        咖啡選豆指南
                      </Link>
                    </li>
                    <li>
                      <Link href="/forum/4" className="menu-link link">
                        <div className="menu-dot" />
                        品味咖啡生活
                      </Link>
                    </li>
                    <li>
                      <Link href="/forum/5" className="menu-link link">
                        <div className="menu-dot" />
                        咖啡器具相關
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="about-link nav-li">
                <Link href="/about" className="nav-link link">
                  關於我們
                  <div className="nav-dot" />
                </Link>
              </li>
              <li className="faq-link nav-li">
                <a href="/fqna" className="nav-link link">
                  常見問題
                  <div className="nav-dot" />
                </a>
              </li>
            </ul>
            {/* <div class="dot"></div> */}
          </div>
          {/* nav連結結束 */}
          {/* 導航圖示開始 */}
          <div className="header-icon text-center col-2">
            <div
              className="user-icon-wrapper my-auth-box"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                href="/member/login"
                className="link my-auth"
                onClick={handleUserIconClick}
              >
                <i className="bi bi-person-fill" />
              </button>
              <UserInfoCard isVisible={showUserInfo} />
            </div>
            <span>｜</span>
            <div
              // style={{ paddingBlock: '30px' }}
              className="cart-card"
              onMouseEnter={() => {
                setVisiable(true)
              }}
              onMouseLeave={() => {
                setVisiable(false)
              }}
            >
              <Link href="/cart" className="link">
                <i className="cart-icon bi bi-cart-fill" />
              </Link>

              <div className="cart-num">{productLength + courseLength}</div>
              <CartCard visiable={visiable} />
            </div>
            {/* '為了讓沒有滑鼠的人無障礙可以使用，所以react建議寫上，但這是手機版所以不用寫功能' */}
            <i
              className="list-icon bi bi-list"
              role="presentation"
              onClick={() => {
                document.querySelector('.nav-m').classList.toggle('nav-active')
                document
                  .querySelector('.nav-m-bgc')
                  .classList.toggle('nav-m-bgc-active')
              }}
            />
          </div>

          {/* 導航圖示結束 */}
        </div>
        {/* 導航結束 */}
      </header>
      {/* 頁首結束 */}
    </>
  )
}
