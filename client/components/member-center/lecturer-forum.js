import { useEffect, useRef, useState } from 'react'
import styles from '../forum/total-forum.module.scss'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function LecturerForum() {
  return (
    <div className={`container ${styles['content']}`}>
      <div className={styles['forum-class']}>文章管理</div>
      <div
        className={`d-flex justify-content-between pt-5 ${styles['writer']}`}
      >
        <div className={`${styles['total-page']}`}>
          {/* 共 {forumData.length} 篇文章 */}共 20 篇文章
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
              defaultValue={selBox}
            />
            <div
              className={`selected ${styles['selected']}`}
              onClick={(e) => {
                // setSelBoxToggle((p) => !p)
                // setForumDate(selBox)
              }}
              ref={selboxTitle}
            >
              {selBox === '' ? '日期最新' : selBox}&nbsp;
              <i className="bi bi-chevron-down" />
            </div>
            <div
              className={`custom-options ${styles['custom-options']}`}
              style={{ display: selBoxToggle ? 'block' : 'none' }}
            >
              <div
                className={`custom-option ${styles['custom-option']}`}
                // onClick={selBoxTitleFun(this)}
                data-value="日期最新"
                onClick={(e) => {
                  selboxTitle.current.nextElementSibling.style.display = 'none'

                  setSelBox(e.currentTarget.getAttribute('data-value'))
                }}
              >
                日期最新
              </div>
              <div
                className={`custom-option ${styles['custom-option']}`}
                data-value="日期最早"
                onClick={(e) => {
                  selboxTitle.current.nextElementSibling.style.display = 'none'

                  setSelBox(e.currentTarget.getAttribute('data-value'))
                }}
              >
                日期最早
              </div>
              <div
                className={`custom-option ${styles['custom-option']}`}
                data-value="最受歡迎"
                onClick={(e) => {
                  selboxTitle.current.nextElementSibling.style.display = 'none'

                  setSelBox(e.currentTarget.getAttribute('data-value'))
                }}
              >
                最受歡迎
              </div>
            </div>
          </div>
        </div>
        {/* 下拉式選單結束 */}
        {/* eslint-disable */}
      </div>

      {currentItems.map((value, index) => (
        <ArticleFavorite key={index} forumData={value} />
      ))}

      <div className={styles['product-list-pag']}>
        <ul className={styles['product-list-ul']}>{renderPageNumbers}</ul>
      </div>
    </div>
  )
}
