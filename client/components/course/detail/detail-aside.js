import React from 'react'
import styles from './course-detail.module.scss'
import Link from 'next/link'; // 使用 Next.js 的 Link 而不是 React Router 的 Link


export default function detailAside({breadData={}}) {

    return (
        <>
            <aside className={`aside ${styles['aside']}`}>

                {/* 麵包屑導航開始 */}
                <div className={`bread ${styles['aside']}`}>
                    <span>
                        {" "}
                        <Link href="/" className={`link ${styles['link']}`}>
                            首頁
                        </Link>{" "}
                    </span>
                    /
                    <span>
                        {" "}
                        <Link href="/course/list" className={`link ${styles['link']}`}>
                            課程專區
                        </Link>{" "}
                    </span>
                    /
                    <span>
                        <Link href="/course/list" className={`link ${styles['link']}`}>
                        {breadData[0].course_category}
                        </Link>
                    </span>
                </div>
                {/* 麵包屑導航結束 */}
                {/* 區塊選單開始 */}
                <div className={`block-menu ${styles['block-menu']}`}>
                    <label htmlFor="block-mainmenu" className={`form-label aside-title ${styles['form-label aside-title']}`}>
                        品牌專區
                    </label>

                    <ul className={`block-menu mb-3 ${styles['block-menu']}`}>
                        <li>
                            <Link href="/course/list" className={`link ${styles['link']}`}>
                                <div className={`aside-dot ${styles['aside-dot']}`} />
                                全部課程
                            </Link>
                        </li>
                        <li>
                            <Link href="/course/2" className={`link ${styles['link']}`}>
                                <div className={`aside-dot ${styles['aside-dot']}`} />
                                體驗課程
                            </Link>
                        </li>
                        <li>
                            <Link href="/course/1" className={`link ${styles['link']}`}>
                                <div className={`aside-dot ${styles['aside-dot']}`} />
                                一般課程
                            </Link>
                        </li>
                        <li>
                            <Link href="/course/3" className={`link ${styles['link']}`}>
                                <div className={`aside-dot ${styles['aside-dot']}`} />
                                SCA證照課程
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    )
}