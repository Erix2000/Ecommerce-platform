import React,{ useEffect, useState, useRef } from 'react'
import styles from './product-detail.module.scss'
import Link from 'next/link'
import selects from '@/data/productAside.json'
import { useRouter } from 'next/router';

export default function detailAside({brandData={}, breadData={}}) {
    const router = useRouter();
    const {category, pid} = router.query
    // const [category,setCategory] = useState(router.query.category)
    // const [pid,setPCode] = useState(router.query.pid)


    const [breadName,setBreadName] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        
        if (router.isReady && category && pid) {
            // category = router.query.category
            console.log(category)
            setBreadName(breadData[0]?.brand_name)
            console.log(brandData)
            console.log(breadData)
        }

        console.log(brandData)

    }, [router.isReady, pid])

    console.log(breadName)


    return (
      <>
        <aside className={`aside ${styles['aside']}`}>
            <div>
                {/* 麵包屑導航開始 */}
                <div className={`bread ${styles['bread']}`}>
                <span>
                    {" "}
                    <Link href="/index" className={`link ${styles['link']}`}>
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
                    {brandData.map((brand,i)=>{
                        return (
                            <>
                            <li key={i}>
                                <Link href={`/product/${brand.brand_id}`} className={`link ${styles['link']}`}>
                                    <div className={`aside-dot ${styles['aside-dot']}`} />
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
            </div>
        </aside>

      </>
    )
}