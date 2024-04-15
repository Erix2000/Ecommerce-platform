import React from 'react'
import Image from 'next/image'
import footerLogo from '@/assets/img/logo/logo-white.svg'

export default function Footer() {
  return (
    <>
      {/* 頁尾開始 */}
      <footer className="footer">
        <div className="main-footer d-flex row">
          <div className="footer-logo col-4">
            <Image src={footerLogo} alt="footer-logo" />
          </div>
          {/* 頁尾商標結束 */}
          {/* 頁尾連結開始 */}
          <div className="footer-ul d-flex col-9 justify-content-center">
            <ul>
              關於我們
              <hr />
              <li>‧ 品牌故事</li>
              <li>‧ 商店簡介</li>
              <li>‧ 門市資訊</li>
              <li>‧ 隱私權及網站使用條例</li>
            </ul>
            <ul>
              客服資訊
              <hr />
              <li>‧ 常見問題</li>
              <li>‧ 客服留言</li>
              <li>‧ 聯絡我們</li>
            </ul>
            <ul>
              公司資訊
              <hr />
              <li>‧ E-mail：mrbeancoffee@gmail.com</li>
              <li>‧ service@mrbean.com</li>
              <li>‧ Tel :+886-2-3322-1888</li>
              <li>‧ Mr. Bean 豆豆先生有限公司</li>
              <li>‧ 26241567</li>
            </ul>
          </div>
          {/* 頁尾連結結束 */}
        </div>
        <p className="text-center">
          © 2024 MR.BEAN COFFEE INC., ALL RIGHTS RESERVED
        </p>
        <div className="contact-icons">
          <i className="bi bi-facebook" />
          <i className="bi bi-chat-dots" />
          <i className="bi bi-instagram" />
          <i className="bi bi-house-door-fill" />
        </div>
      </footer>
      {/* 頁尾結束 */}
    </>
  )
}
