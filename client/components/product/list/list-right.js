import React, { useState, useRef, useEffect } from 'react'
import styles from './product-list.module.scss'
import ProductFavorite from '@/components/member-center/favorite/product-favorite'
import brand from '@/data/brand.json'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

// 可愛的輪播圖
import Carousel from 'react-bootstrap/Carousel';
import { Image } from 'react-bootstrap'

import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

// 會員鉤子
import { useAuth } from '@/hooks/use-auth'




export default function listRight({
  productData = {},
  brandData={}, 
  tagData={}, 
  slideData={}, 
  addItem={}, 
  userLikeArr={}, 
  onButtonClick=()=>{}, 
  sortFun=()=>{},
  searchFun=()=>{},
  tagFun=()=>{},
  priceFun=()=>{},
  asideBtn=()=>{},
  selArrAllClear=()=>{},
  asideBtnClear=()=>{},
  tagTitleFun=()=>{},
  likeNotify=()=>{},
  unlikeNotify=()=>{}
}) {
    console.log(tagData)

    // 測試用
    // const handleClick = () => {
    //   console.log(123)
    //   在按鈕被點擊時，調用父元件傳遞過來的函式，並傳遞訊息作為引數
    //   onButtonClick("Hello from child!");
    // };

    // console.log(userLikeArr)
    const { auth } = useAuth()

    const router = useRouter();
    let category

    let renderPageNumbers=[]
    // 分頁
    const [renderPageNumbersF,setRenderPageNumbersF] = useState([])
    const [nowPage, setNowPage] = useState(1)
    const [everyPageNum, setEveryPageNum] = useState(12)

    // 篩選過後的資料
    const [productDataFin,setProductDataFin] = useState([])
    // 要顯示在分頁的資料
    const [nowProductData,setNowProductData] = useState([])

    // 手機板的東西開始
    // 篩選器標題選項const 
    const [tagTitleArr, setTagTitleArr] = useState([])
    const [tagSel, setTagSel] = useState([])

    // 手機板篩選出現
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const data = [
      {id : '1'},
      {id : '2'},
      {id : '3'}
    ]
    const [visibleTab, setVisibleTab] = useState(data[0].id)

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
    // 手機板的東西結束

    // 下拉選單出現
    const [selBoxToggle, setSelBoxToggle] = useState(false);
    // 下拉選單文字及值設定
    const [selBox,setSelBox] = useState('')
    const selboxTitle = useRef(null)
    
    // 輪播圖陣列
    const [slideArr, setSlideArr] = useState([])

   

    // 搜尋
    let searchRef = useRef(null)
    // 排序
    let sortRef = useRef(null)
    const [isSort,setIsSort] = useState(false)
    // 篩選
    let tagRef = useRef(null)
    // 價錢
    let priceRef = useRef(null)
    

    // console.log(productData)
    // console.log(slideData)
    // console.log(productList);
    

    // 價格由低到高(測試用)
    let asce = ()=>{
      // console.log(123)
      // console.log(category)
      // fetch(`http://localhost:3005/product/${category}/?sort=asce`, {
      //   method:'GET',
      //   })
      //   .then((res) => res.json())
      //   .then((result) => {
      //       console.log(result)
      //       setProductDataFin(result.products)
      //   })
      //   .catch((error) => {
      //       console.log(error)
            
      //   })
    }
    

    // 篩選器標題選項fun(這個最後可以做調整?)
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
        // console.log(Arr,sels);
        setTagTitleArr(Arr);
        setTagSel(sels);

    }

    let getSlideFun = (c) => {
      return new Promise((resolve,reject)=>{
          
          if(slideData!==""){

              // console.log(slideData)
              
              let Arr = "";
              for (const { brand_img } of slideData) {
                  Arr += brand_img
              }
  
              resolve(Arr)
          }else{
              reject(e)
          }
      })
    }

    let getSlide = async(c) => {
        
        const Arr = await getSlideFun(c);
        // console.log(Arr);
        let arr = Arr.split(',')
        // console.log(arr);
        setSlideArr(arr);
        
    }
    
    useEffect(() => {
        // 如果isReady是true，確保能得到query的值
        if (router.isReady) {
            category = router.query.category
            // console.log(category)
            getSlide(category)
            getTagTitle(category)
        }
    }, [router.isReady])

    let localSort= ""
    // 一開始和篩選時變換(這要獨立出來寫因為當篩選的時候只有商品的資料要換掉)
    // 這裡應該只是一開始的狀態
    useEffect(()=>{
      console.log(productData)
      setProductDataFin(productData)
      console.log(isSort)

      // 把點選的分類狀態塞回去
      localSort = localStorage.getItem('sort');
      // 如果有點選篩選，才把狀態塞回去，如果是重新整理就沒有
      // if(isSort){
        // console.log(isSort)
        if (localSort === '0') {
          setSelBox("無排序")
        } else if (localSort === '1') {
          setSelBox("價格由低到高")
        } else if(localSort === '2'){
          setSelBox("價格由高到低")
        }

      // }
      
      
    },[productData,router.isReady])


    // 一開始的分頁，以及當商品篩選時的商品列表呈現、分頁呈現
    useEffect(()=>{
      console.log(productDataFin)
      if(Array.isArray(productDataFin)){
        console.log(productDataFin)
         // 分頁開始
        setNowProductData(productDataFin.slice(everyPageNum*(nowPage-1), everyPageNum*(nowPage)))
        let totalPage = Math.ceil(productDataFin.length/12)
        // console.log(totalPage)
        // console.log(everyPageNum*(nowPage-1))
        // console.log(nowProductData)
        // 分頁陣列
        let totalPageArr = []
        for(let i = 1; i<totalPage+1;i++){
          totalPageArr.push(i)
        }
        // console.log(totalPageArr)
        // 後來寫的分頁
        let startPage = Math.max(nowPage - 1, 1)
        let endPage = Math.min(startPage + 2, totalPage)

        const renderPageNumbers = []

        // 如果不是在第一頁，則顯示向前翻頁的箭頭
        if (nowPage > 1) {
          renderPageNumbers.push(
            <li key="prev" className={styles.prev}>
              <a
                onClick={() => setNowPage(nowPage - 1)}
                href="#"
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
          )
        }

        for (let number = startPage; number <= endPage; number++) {
          renderPageNumbers.push(
            <li key={number} className={number === nowPage ? styles.active : ''}>
              <a onClick={() => setNowPage(number)} href="#">
                {number}
              </a>
            </li>
          )
        }

        // 如果不是在最後一頁，則顯示向後翻頁的箭頭
        if (nowPage < totalPage) {
          renderPageNumbers.push(
            <li key="next" className={styles.next}>
              <a
                onClick={() => setNowPage(nowPage + 1)}
                href="#"
                aria-label="Next"
              >
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          )
        }
        setRenderPageNumbersF(renderPageNumbers)

        // 分頁結束
      }
      

    },[productDataFin, nowPage])
    
    return (
      <>
        {/* 手機板輪播圖 */}
        <Carousel pause={'hover'} style={{height:'250px'}} className={`carousel slide-m slide-pics ${styles['slide-m']} ${styles['carousel']} ${styles['slide']} ${styles['slide-pics']}`}>
              {slideArr.map((slide,i)=>{
                  category = router.query.category
                  
                  return (
                      <Carousel.Item interval={2000}>
                          <Image style={{height:'250px'}} src={`/product-img/product/${category}/slide/${slide}`} fluid className='w-100'/>
                          <Carousel.Caption></Carousel.Caption>
                      </Carousel.Item>
                  )
                  
              })}
      
        </Carousel>

      {/* 手機板篩選按鈕 */}
      <div className={`middle-content-m row ${styles['middle-content-m']}`}>
        <div
          type="button"
          className={`brand mbox col-4 ${styles['brand']} ${styles['mbox']}`}
          variant="primary" 
          // onClick={handleShowBrand}
          onClick={() => {handleShow(); setVisibleTab('1')}}
        >
          品牌&nbsp;
          <i className="bi bi-chevron-down" />
        </div>
        <div
          type="button"
          className={`select mbox col-4 ${styles['select']} ${styles['mbox']}`}
          variant="primary" 
          // onClick={handleShowSel}
          onClick={() => {handleShow(); setVisibleTab('2')}}
        >
          篩選&nbsp;
          <i className="bi bi-chevron-down" />
        </div>
        <div
          type="button"
          className={`order mbox col-4 ${styles['mbox']} ${styles['order']}`}
          variant="primary" 
          // onClick={handleShowOrder}
          onClick={() => {handleShow(); setVisibleTab('3')}}
        >
          排序&nbsp;
          <i className="bi bi-chevron-down" />
        </div>
        <Offcanvas style={{height:'80%'}} className={`d-md-none ${styles['offcanvas']}`} placement={'bottom'} show={show} onHide={handleClose}>
          <Offcanvas.Header  closeButton>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {/* 品牌 */}
            <div
              style={visibleTab === '1' ? {display: 'block'} : {display: 'none'}}
              className={`brand-menu mmenu ${styles['brand-menu']} ${styles['mmenu']}`}
            >
              <div className={`text-center menu-title ${styles['menu-title']}`}>分類</div>
                <ul className={`block-menu mb-5 ${styles['block-menu']}`}> 
                  {brandData?.map((brand,i)=>{
                      return (
                          <>
                          <li key={i} className='mb-2'>
                              <Link 
                              href={`/product/${brand.brand_id}`} className={`link ${styles['link']}`}
                              onClick={selArrAllClear}
                              >
                                  <div className={`aside-dot ${styles['aside-dot']}`} />
                                  <span style={{ fontSize: 18 }}>
                                  {brand.brand_name}
                                  
                                  <span style={{ fontSize: 14 }}>{brand.brand_name_en}</span>
                                  </span>
                              </Link>
                          </li>
                          
                          </>
                      )
                  })}
                </ul>
            </div>

            {/* 篩選器 */}
            <div
              className={`select-menu mmenu ps-4 pe-4 ${styles['select-menu']} ${styles['mmenu']}`}
              style={visibleTab === '2' ? {display: 'block'} : {display: 'none'}}
            >
              <div className={`text-center ${styles['menu-title']}`}>篩選</div>
                <div className="block-menu">
                  <div className={`aside-thrtitle ${styles['aside-thrtitle']}`}>價格</div>
                  {/* 價錢範圍 */}
                  <Slider 
                      range
                      draggableTrack
                      min={ minPrice }
                      max={ maxPrice }
                      value={ price }
                      onChange={ setPrice }
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
                {tagTitleArr.map((tagTitle,i)=>{
                    return (
                        <div key={i} className={`block-firstmenu block-menu ${styles['block-firstmenu block-menu']}`}>
                            <div 
                            key={i}
                            className={`aside-thrtitle ${styles['aside-thrtitle']}`}
                            data-value={tagTitle.tag_code}
                            >{tagTitle.tag_name}</div>

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
                                    <label className={`form-check-label ${styles['form-check-label']}`} htmlFor={sel.tag_code} >
                                    {sel.tag_name}
                                    </label>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
              
                <div className={`row mt-4 ${styles['btn-group']}`}>
                  <div 
                  type="button" 
                  className={`col-6 ${styles['aside-button2']}`}
                  onClick={()=>{
                    console.log(123)
                    asideBtnClear()
                  }}
                  >
                    清除篩選
                  </div>
                  <div 
                  type="button" 
                  className={`col-6 ${styles['aside-button1']}`}
                  onClick={()=>{
                    console.log(123)
                    asideBtn(price)
                  }}
                  >
                    篩選
                  </div>
                </div>
          
            </div>

            {/* 排序 */}
            <div
              className={`order-menu mmenu ${styles['order-menu']} ${styles['mmenu']}`}
              style={visibleTab === '3' ? {display: 'flex', flexDirection: 'column'} : {display: 'none'}}
            >
              <div className={`text-center mb-2 ${styles['menu-title']}`}>
                分類
              </div>

              <label htmlFor="order1" className='mb-2 ms-4'>
                <input 
                className='me-2' 
                id="order1" 
                type="radio" 
                name="order" 
                defaultValue={0} 
                onChange={()=>{
                  sortFun(0)
                  setIsSort(true)
                }}
                checked={selBox === '無排序'}
                />
                無排序
              </label>
              <label htmlFor="order1" className='mb-2 ms-4'>
                <input 
                className='me-2' 
                id="order1" 
                type="radio" 
                name="order" 
                defaultValue={1}
                onChange={()=>{
                  sortFun(1)
                  setIsSort(true)
                }} 
                checked={selBox === '價格由低到高'}
                />
                價格由低到高
              </label>
              <label htmlFor="order2" className='mb-2 ms-4'>
                <input 
                className='me-2' 
                id="order2" 
                type="radio" 
                name="order" 
                defaultValue={2} 
                onChange={()=>{
                  sortFun(2)
                  setIsSort(true)
                }}
                checked={selBox === '價格由高到低'}
                />
                價格由高到低
              </label>

              
            </div>

          </Offcanvas.Body>
        </Offcanvas>

      </div>

        {/* 頁面開始 */}
      <div className={`container ${styles['content']}`}>
          {/* 電腦版輪播圖 */}
          <Carousel pause={'hover'} className={`carousel slide slide-pics ${styles['carousel']} ${styles['slide']} ${styles['slide-pics']}`}>
              {slideArr.map((slide,i)=>{
                  category = router.query.category
                  
                  return (
                      <Carousel.Item interval={2000}>
                          <Image src={`/product-img/product/${category}/slide/${slide}`} fluid className='w-100'/>
                          <Carousel.Caption></Carousel.Caption>
                      </Carousel.Item>
                  )
                  
              })}
      
          </Carousel>


        {/* 電腦版中間內容 */}
        <div className={`middle-content ${styles['middle-content']}`}>
          <div className={`allnum ${styles['allnum']}`}>共{productData.length}樣商品</div>
          <div className={`${styles['input-box']}`}>
            <div className={`custom-select ${styles['custom-select']}`}>
              <input
                type="text"
                className="d-none"
                id="customSelectValue"
                value={selBox}
                ref={sortRef}
              />
              <div
                className={`selected ${styles['selected']}`}
                onClick={() => {
                  setSelBoxToggle((p) => !p)
                  
                }}
                ref={selboxTitle}
              >
                {selBox === '' ? '無排序' : selBox}&nbsp;
                <i className="bi bi-chevron-down" />
              </div>
              <div
                className={`custom-options ${styles['custom-options']}`}
                style={{ display: selBoxToggle ? 'block' : 'none' }}
              >
                <div
                  className={`custom-option ${styles['custom-option']}`}
                  // onClick={selBoxTitleFun(this)}
                  data-value="無排序"
                  onClick={(e) => {
                    selboxTitle.current.nextElementSibling.style.display =
                      'none'

                    setSelBox(e.currentTarget.getAttribute('data-value'))
                    sortFun(0)
                    setIsSort(true)
                    
                  }}
                >
                  無排序
                </div>
                <div
                  className={`custom-option ${styles['custom-option']}`}
                  data-value="價格由低到高"
                  onClick={(e) => {
                    selboxTitle.current.nextElementSibling.style.display =
                      'none'

                    setSelBox(e.currentTarget.getAttribute('data-value'))
                    // asce()
                    sortFun(1)
                    setIsSort(true)
                  }}
                >
                  價格由低到高
                </div>
                <div
                  className={`custom-option ${styles['custom-option']}`}
                  data-value="價格由高到低"
                  onClick={(e) => {
                    selboxTitle.current.nextElementSibling.style.display =
                      'none'

                    setSelBox(e.currentTarget.getAttribute('data-value'))
                    sortFun(2)
                    setIsSort(true)
                  }}
                >
                  價格由高到低
                </div>
              </div>
            </div>
            <div className={`search ${styles['search']}`}>
              <input 
                type="text" 
                placeholder="搜尋商品"
                // value={searchValue}
                // onChange={(e)=>{setSearchValue(e.target.value)}}
                ref={searchRef}
               />
              <div
                type="button"
                className={`search-btn ${styles['search-btn']}`}
                onClick={()=>{
                  searchFun(searchRef.current.value)
                }}
              >
                <i className="bi bi-search" />
              </div>
            </div>
          </div>
        </div>

        {/* 商品列表 */}
        <div className={`product-list row ${styles['product-list']}`}>
          {Array.isArray(productData) &&
            nowProductData.map((productItem, i) => {
              return (
                <ProductFavorite
                  key={i}
                  productItem={productItem}
                  userLikeArr={userLikeArr}
                  nowPage={nowPage}
                  likeNotify={likeNotify}
                  unlikeNotify={unlikeNotify}
                />
              )
            })}
        </div>

        
        <div className={styles['product-list-pag']}>
        <ul className={styles['product-list-ul']}>{renderPageNumbersF}</ul>
      </div>
      </div>
    </>
  )
}
