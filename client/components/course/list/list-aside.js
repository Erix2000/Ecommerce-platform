import React, { useEffect, useState, useRef } from 'react';
import styles from './course-list.module.scss';
import Link from 'next/link'; // 使用 Next.js 的 Link 而不是 React Router 的 Link

// import selects from '@/data/courseAside.json'
import { useRouter } from 'next/router'; // 導入 useRouter 鉤子
// import tags from '@/data/tagSelect.json'

import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import { getBreadcrumbsUtilityClass } from '@mui/material';

export default function listAside({
    // tagData = {},
    bread = {},
    courseData = {},
    priceFun = () => { },
    tagTitleRef,
    tagFun = () => { },
    asideBtn = () => { },
    selArrAllClear = () => { },
    asideBtnClear = () => { },
}) {

    //
    // const courseOption = ["烘豆", "手沖", "拉花", "證照", "台北教室", "台中教室", "高雄教室"]
    // const [option, setOption] = useState([])
    // useEffect(() => {

    //     setOption(localStorage.getItem("courseItem"))
    // }, [])
    // useEffect(() => {
    //     localStorage.setItem("courseItem", JSON.stringify(option))
    // }, [
    //     option
    // ])

    // 篩選器標題選項const
    const router = useRouter();
    const [category, setCategory] = useState(router.query.category)
    // let category;

    let localtag = localStorage.getItem('tag')
    //loading
    const [isLoading, setIsLoading] = useState(true)
    // 篩選
    let tagRef = useRef(null)
    // 價格const
    // const [price, setPrice] = useState([0, 10000]);
    // 價錢
    let priceRef = useRef(null)
    // 篩選標題(用來計算有幾個種類)
    // let tagTitleRef = useRef(null)
    // const [courseData, setCourseData] = useState([]);

    // 篩選器標題選項const 
    const [tagTitleArr, setTagTitleArr] = useState([])
    const [tagSel, setTagSel] = useState([])
    const [breadName, setBreadName] = useState("")

    // 抓取 price 屬性的最大值和最小值
    let maxPrice, minPrice
    console.log(courseData)
    if (courseData.length === 0) {
        maxPrice = 0
        minPrice = 0
    } else {
        maxPrice = Math.max(...courseData.map(course_list => course_list.course_price));
        minPrice = Math.min(...courseData.map(course_list => course_list.course_price));

    }


    // 價格range
    const [price, setPrice] = useState([minPrice, maxPrice]);
    console.log(courseData)
    // console.log('最大價格:', maxPrice);
    // console.log('最小價格:', minPrice);

    useEffect(() => {
        priceFun(price)
    }, [price])





    useEffect(() => {
        setIsLoading(true)
        // 如果isReady是true，確保能得到query的值
        if (router.isReady || category) {
            // category = router.query.category
            console.log(category)

        }
        priceFun(price)



    }, [router.isReady, category, bread])

    console.log(breadName)


    return (
        <>
            <aside className={`aside ${styles['aside']}`}>
                <div>
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
                            <Link href="/course/category" className={`link ${styles['link']}`}  >

                                {bread[0].course_category}

                            </Link>
                        </span>
                    </div>
                    {/* 麵包屑導航結束 */}
                    {/* 區塊選單開始 */}
                    <div className={`block-menu ${styles['block-menu']}`}>
                        <label htmlFor="block-mainmenu" className={`form-label aside-title ${styles['form-label aside-title']}`}>
                            課程專區
                        </label>
                        <ul className={`block-menu mb-3 ${styles['block-menu']}`}>
                            <li>
                                <Link href="/course/list" className={`link ${styles['link']}`} onClick={selArrAllClear}>
                                    <div className={`aside-dot ${styles['aside-dot']}`} />
                                    全部課程
                                </Link>
                            </li>
                            <li>
                                <Link href="/course/2" className={`link ${styles['link']}`} onClick={selArrAllClear}>
                                    <div className={`aside-dot ${styles['aside-dot']}`} />
                                    體驗課程
                                </Link>
                            </li>
                            <li>
                                <Link href="/course/1" className={`link ${styles['link']}`} onClick={selArrAllClear}>
                                    <div className={`aside-dot ${styles['aside-dot']}`} />
                                    一般課程
                                </Link>
                            </li>
                            <li>
                                <Link href="/course/3" className={`link ${styles['link']}`} onClick={selArrAllClear}>
                                    <div className={`aside-dot ${styles['aside-dot']}`} />
                                    SCA證照課程
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {/* 區塊選單結束 */}
                    <hr style={{ border: "1px solid #003e52" }} />

                    {/* 篩選區段開始 */}
                    <div className={`aside-sectitle ${styles['aside-sectitle']}`}>篩選</div>
                    <div className={`block-menu ${styles['block-menu']}`}>
                        <div className={`aside-thrtitle ${styles['aside-thrtitle']}`}>價格</div>
                        {/* 價錢範圍 */}
                        <Slider
                            range
                            draggableTrack
                            min={minPrice}
                            max={maxPrice}
                            value={price}
                            onChange={setPrice}
                            // className={styles.slider}
                            styles={{
                                handle: {
                                    backgroundColor: "#bc955c",
                                    border: "none",
                                    opacity: 1,
                                    boxShadow: "none"

                                },
                                track: {
                                    backgroundColor: "#bc955c",
                                    borderRadius: 0,
                                    height: 5,
                                },
                                rail: {
                                    backgroundColor: "#b2acac",
                                    borderRadius: 5,
                                    height: 5,
                                }

                            }}
                        />
                        <div className='justify-content-between d-flex mt-2'>
                            <div className={`min-value numberVal ${styles['numberVal']} ${styles['min-value']}`}>{price[0]}元</div>
                            <div className={`max-value numberVal ${styles['numberVal']} ${styles['max-value']}`}>{price[1]}元</div>
                        </div>
                    </div>
                    {/* 篩選區段結束 */}
                    {/* 第一選單區塊開始 */}
                    <div className={`block-firstmenu block-menu ${styles['block-firstmenu']} ${styles['block-menu']}`}>
                        <div className={`aside-thrtitle ${styles['block-firstmenu']}`}>課程種類</div>
                    
                        <div className={`form-check ${styles['form-check']}`}>
                            <input
                                className={`form-check-input ${styles['form-check-input']}`}
                                type="checkbox"
                                value={1}
                                id={1}
                                defaultChecked=""
                                onChange={(e)=>{
                                    tagFun(e)
                                    
                                }}
                                checked = {localtag.includes(1)}
                            />
                            <label className={`form-check-label link ${styles['form-check-label']} ${styles['link']}`} htmlFor={1}>
                                烘豆
                            </label>
                        </div>
                        <div className={`form-check ${styles['form-check']}`}>
                            <input
                                className={`form-check-input ${styles['form-check-input']}`}
                                type="checkbox"
                                value={2}
                                id={2}
                                defaultChecked=""
                                onChange={(e)=>{tagFun(e)}}
                                checked = {localtag.includes(2)}
                            />
                            <label className={`form-check-label link ${styles['form-check-label']} ${styles['link']}`} htmlFor={2}>
                                手沖
                            </label>
                        </div>
                        <div className={`form-check ${styles['form-check']}`}>
                            <input
                                className={`form-check-input ${styles['form-check-input']}`}
                                type="checkbox"
                                value={3}
                                id={3}
                                defaultChecked=""
                                onChange={(e)=>{tagFun(e)}}
                                checked = {localtag.includes(3)}
                            />
                            <label className={`form-check-label link ${styles['form-check-label']} ${styles['link']}`} htmlFor={3}>
                                拉花
                            </label>
                        </div>
                        <div className={`form-check ${styles['form-check']}`}>
                            <input
                                className={`form-check-input ${styles['form-check-input']}`}
                                type="checkbox"
                                value={4}
                                id={4}
                                onChange={(e)=>{tagFun(e)}}
                                checked = {localtag.includes(4)}
                            />
                            <label className={`form-check-label link ${styles['form-check-label']} ${styles['link']}`} htmlFor={4}>
                                證照
                            </label>
                        </div> 
                        </div>
                        <div className={`block-submenu block-menu ${styles['block-submenu']} ${styles['block-menu']}`}>
                        <div className={`aside-thrtitle ${styles['aside-thrtitle']}`}>開課教室</div>
                        <div className={`form-check ${styles['form-check']}`}>
                            <input
                                className={`form-check-input ${styles['form-check-input']}`}
                                type="checkbox"
                                value={6}
                                id={6}
                                onChange={(e)=>{tagFun(e)}}
                                checked = {localtag.includes(6)}
                            />
                            <label className={`form-check-label link ${styles['form-check-label']} ${styles['link']}`} htmlFor={6}>
                                台北教室
                            </label>
                        </div>
                        {/* 第一選單區塊結束 */}
                        {/* 第二選單區塊開始 */}
                        <div className={`form-check ${styles['form-check']}`}>
                            <input
                                className={`form-check-input ${styles['form-check-input']}`}
                                type="checkbox"
                                value={7}
                                id={7}
                                defaultChecked=""
                                onChange={(e)=>{tagFun(e)}}
                                checked = {localtag.includes(7)}
                            />
                            <label className={`form-check-label link ${styles['form-check-label']} ${styles['link']}`} htmlFor={7}>
                                台中教室
                            </label>
                        </div>
                        <div className={`form-check ${styles['form-check']}`}>
                            <input
                                className={`form-check-input ${styles['form-check-input']}`}
                                type="checkbox"
                                value={8}
                                id={8}
                                defaultChecked=""
                                onChange={(e)=>{tagFun(e)}}
                                checked = {localtag.includes(8)}
                            />
                            <label className={`form-check-label link ${styles['form-check-label']} ${styles['link']}`} htmlFor={8}>
                                高雄教室
                            </label>
                        </div>
                    </div>
                    {/* 第二選單區塊結束 */}

                </div>
                {/* 按鈕群組開始 */}
                <div className="btn-group">
                    <a
                        type="button" className="text-center col-12 aside-button1"
                        onClick={() => {
                            console.log(123)
                            asideBtn(price)
                        }}
                    >
                        篩選
                    </a>
                    <a
                        type="button"
                        className="text-center col-12 aside-button2"
                        onClick={() => {
                            console.log(123)
                            asideBtnClear()
                        }}
                    >
                        清除篩選
                    </a>
                </div>
                {/* 按鈕群組結束 */}
                {/* 篩選階段結束 */}
            </aside>
        </>
    )
}
