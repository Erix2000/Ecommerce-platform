import React,{ useEffect, useState, useRef } from 'react'
import styles from './product-list.module.scss'
import Link from 'next/link'
import selects from '@/data/productAside.json'
import { useRouter } from 'next/router';
import tags from '@/data/tagSelect.json'

import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";


export default function listAside({
    brandData={}, 
    tagData={}, 
    bread={},
    productData={},
    tagFun=()=>{},
    priceFun=()=>{},
    tagTitleFun=()=>{},
    tagTitleRef,
    asideBtn=()=>{},
    selArrAllClear=()=>{},
    asideBtnClear=()=>{}
}) {

    const router = useRouter();
    const [category,setCategory] = useState(router.query.category)
    // loading
    const [isLoading, setIsLoading] = useState(true)

    // 篩選
    let tagRef = useRef(null)
    // 價錢
    let priceRef = useRef(null)
    // 篩選標題(用來計算有幾個種類)
    // let tagTitleRef = useRef(null)

    // 篩選器標題選項const 
    const [tagTitleArr, setTagTitleArr] = useState([])
    const [tagSel, setTagSel] = useState([])
    const [breadName,setBreadName] = useState("")

    
    
    // 抓取 price 屬性的最大值和最小值
    let maxPrice, minPrice
    if(productData.length === 0){
        maxPrice = 0
        minPrice = 0
    }else{
        maxPrice = Math.max(...productData.map(product => product.product_price));
        minPrice = Math.min(...productData.map(product => product.product_price));
    }
    
    // 價格range
    const [ price, setPrice ] = useState( [ minPrice, maxPrice] );
    console.log(productData)
    // console.log('最大價格:', maxPrice);
    // console.log('最小價格:', minPrice);

    useEffect(()=>{
        priceFun(price)
    },[price])

    // link狀態(還沒寫)
    const [link, setLink] = useState("")
    const linkref = useRef()

    console.log(brandData)
    console.log(bread)

    // link狀態(還沒寫)
    let linkfun = (c) => {
        if(linkref.getAttribute('href').substring(href.length - 2) === c){
            setLink("${styles['link-dot-active']}`} ${styles['link-active']}")
        }
    }
    
    // 篩選器標題選項fun
    let getTagTitlefor = (c) => {
        return new Promise((resolve,reject)=>{
            // 分成兩個陣列，一個是title，一個是陣列陣列[[],[]]，到時候map的時候，title的index多少，就帶入第幾個陣列
            
            if(tagData){
                // title陣列
                let Arr = [];
                for (const { tag_code,tag_name } of tagData) {
                    if(tag_code.startsWith(`${c}`) && tag_code.endsWith("00")){
                        Arr.push({tag_code,tag_name})
                    }
                    
                }
                
                // 陣列陣列
                const sels = [];

                for (let i = 0; i < Arr.length; i++) {
                    sels.push([]);
                    for (const { tag_code,tag_name } of tagData) {
                        if(tag_code.startsWith(`${c}`) && !tag_code.endsWith("00") && tag_code[3] === `${i+1}`){
                            sels[i].push({tag_code,tag_name});
                        }
                    }
                }
                resolve({Arr,sels})
            }else{
                reject(e)
            }
        })
    }

    let getTagTitle = async(c) => {
        // 偵測目前所在路由ex:00，用00找出篩選器標題，並把code和name用成物件陣列
        const {Arr,sels} = await getTagTitlefor(c);
        console.log(Arr,sels);
        setTagTitleArr(Arr);
        setTagSel(sels);
        setBreadName(bread[0]? bread[0].brand_name:"")
        
    }

    
    useEffect(() => {
        setIsLoading(true)
        // 如果isReady是true，確保能得到query的值
        if (router.isReady || category) {
            // category = router.query.category
            console.log(category)
            getTagTitle(category)
        }
        priceFun(price)

        
        

    }, [router.isReady, category])

    console.log(breadName)

  

    return (
      <>
        <aside className={`aside ${styles['aside']}`}>
            <div>
                {/* 麵包屑導航開始 */}
                <div className={`bread ${styles['bread']}`}>
                <span>
                    {" "}
                    <Link href="" className={`link ${styles['link']}`}>
                    首頁
                    </Link>{" "}
                </span>
                /
                <span>
                    {" "}
                    <Link href="/product/00" className={`link ${styles['link']}`}>
                    品牌專區
                    </Link>{" "}
                </span>
                /
                <span>
                    <Link href={`/product/${category}`} className={`link ${styles['link']}`}>
                    {breadName}
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
                    {brandData?.map((brand,i)=>{
                        return (
                            <>
                            <li key={i}>
                                <Link 
                                    href={`/product/${brand.brand_id}`} 
                                    className={`link ${styles['link']} ${link}`} ref={linkref}
                                    onClick={selArrAllClear}
                                >
                                    <div className={`aside-dot ${styles['aside-dot']} ${link}`} />
                                    <span style={{ fontSize: 18 }}>
                                    {brand.brand_name}
                                    <br />
                                    <span style={{ fontSize: 14 }}>{brand.brand_name_en}</span>
                                    </span>
                                </Link>
                            </li>
                            
                            </>
                        )
                    })}
                    
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
                    min={ minPrice }
                    max={ maxPrice }
                    value={ price }
                    onChange={setPrice}
                    styles={{
                        handle:{ 
                            backgroundColor: "#bc955c",
                            border:"none",
                            opacity:1,
                            boxShadow:"none"

                        },
                        track:{ 
                            backgroundColor: "#bc955c",
                            borderRadius: 0,
                            height:5, 
                        },
                        rail:{ 
                            backgroundColor: "#b2acac",
                            borderRadius: 5,
                            height:5,
                        }
                    
                    }}
                />
                
                <div className='justify-content-between d-flex mt-2'>
                <div className={`min-value numberVal ${styles['numberVal']} ${styles['min-value']}`}>{ price[0] }元</div>
                <div className={`max-value numberVal ${styles['numberVal']} ${styles['max-value']}`}>{ price[1] }元</div>
                </div>
                </div>
                {/* 篩選區段結束 */}
                {/* 第一選單區塊開始 */}
                
                {tagTitleArr.map((tagTitle,i)=>{
                    return (
                        <div key={i} className={`block-firstmenu block-menu ${styles['block-firstmenu block-menu']}`}>
                            <div 
                            key={i}
                            className={`aside-thrtitle ${styles['aside-thrtitle']}`}
                            data-value={tagTitle.tag_code}
                            >
                                {tagTitle.tag_name}
                            </div>
                            
                            {tagSel[i].map((sel,index)=>{
                                let localTag = localStorage.getItem('tag')
                                let isChecked = localTag.includes(sel.tag_code)
                                return (
                                    <div className={`form-check ${styles['form-check']}`}>
                                    <input
                                    className={`form-check-input ${styles['form-check-input']}`}
                                    type="checkbox"
                                    //id="mainmenu-first"
                                    value={sel.tag_code}
                                    id={sel.tag_code}
                                    onChange={(e)=>{tagFun(e);tagTitleFun(e)}}
                                    checked={isChecked}
                                    />
                                    <label className={`form-check-label ${styles['form-check-label']}`} htmlFor={sel.tag_code}>
                                    {sel.tag_name}
                                    </label>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
                
                {/* 第二選單區塊結束 */}
            </div>
            {/* 按鈕群組開始 */}
            <div className="btn-group">
                <a 
                type="button" className="text-center col-12 aside-button1"
                onClick={()=>{
                    console.log(123)
                    asideBtn(price)
                }}
                >
                篩選
                </a>
                <a 
                type="button" 
                className="text-center col-12 aside-button2"
                onClick={()=>{
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

        <style jsx>{`
        

        `}</style>


      </>
    )
}