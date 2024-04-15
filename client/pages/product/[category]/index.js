import React, { useState,useEffect,useRef } from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import List from '@/components/product/list'
import Footer from '@/components/layout/public-version/footer'
import { useRouter } from 'next/router'

// 會員鉤子
import { useAuth } from '@/hooks/use-auth'

// loading
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'



export default function Index() {
  const { auth } = useAuth()
  const router = useRouter();
  const { category } = router.query
  // 之後要放loading
  const [isLoading, setIsLoading] = useState(true)
  const MySwal = withReactContent(Swal)

  // 資料庫的東西
  const [productData, setProductData] = useState([])
  const [slideData, setSlideData] = useState([])
  const [brandData,setBrandData] = useState([])
  const [tagData,setTagData] = useState([])
  const [bread,setBread] = useState([])
  // 如果會員登入就要傳進來的資料
  const [userLikeArr,setUserLikeArr] = useState([])

  

  // 篩選全部設定開始
  // 因為要取得最終字串樣式如下
  // ?sort=0&tag=010101,020203&pricemax=300&pricemin=200&search=咖啡
  // 所以有三步驟；取得個別字串、當有任一字串被組合，就要形成新字串、將字串放進fetch url後面
  // 要能夠清除篩選

  // (重要)每次做篩選就要去改變篩選價錢的最大值與最小值

  // 步驟一:取得個別字串
  // 排序
  // 初始值為0
  const [sortValue,setSortValue] = useState(0)
  const [sortStr, setSortStr] = useState("sort=0")
  let sortFun = (e)=>{
    console.log(e)
    setSortValue(e)
    setSortStr(`sort=${e}`)
    localStorage.setItem('sort', `${e}`)
    console.log(localStorage.getItem('sort'))
  }

  // 搜尋
  // 初始值為空字串
  const [searchValue,setSearchValue] = useState("")
  const [searchStr, setSearchStr] = useState("")
  let searchFun = (e)=>{
    console.log(e)
    setSearchValue(e)
    setSearchStr(`search=${e}`)
    localStorage.setItem('search', `${e}`);
  }
  
  // 篩選
  // 小分類陣列
  const [tagValue, setTagValue] = useState([])
  // 大分類數量
  const [tagTitleNum, setTagTitleNum] = useState("")
  let tagTitle = [] ;
  const [tagStr, setTagStr] = useState("tag=")

  // 如果有勾選，就自動將選項加入陣列
  let tagFun = (e)=>{
    // console.log(e)
    // setTagValue(e)
    const { value, checked } = e.target;
    if (checked) {
      setTagValue(prevTags => [...prevTags, value]);
      
    } else {
      setTagValue(prevTags => prevTags.filter(tag => tag !== value));
    }
  }

  // 組成tag字串
  useEffect(()=>{
    console.log(tagValue)
    // 形成字串
    setTagStr(`tag=${tagValue.join(",")}`)
    localStorage.setItem('tag', `${tagValue.join(",")}`);
    tagTitle = tagValue.map(item => item[3]);
    console.log(tagTitle);
    const uniqueNumbers = [...new Set(tagTitle)];
    console.log(uniqueNumbers); 
    // 計算出總共選了幾個大分類
    setTagTitleNum(uniqueNumbers.length)
    localStorage.setItem('tagTitleNum', `${uniqueNumbers.length}`);
  },[tagValue])

  // 價錢
  const [priceValue,setPriceValue] = useState([ 0, 0 ])
  let setPriceStr
  // const [priceStr,setPriceStr] = useState([0,0])
  let priceFun = (e)=>{
    console.log(e)
    setPriceValue(e)
    // setPriceStr(`pricemin=${priceValue[0]}&pricemax=${priceValue[1]}`)
    setPriceStr = `pricemin=${e[0]}&pricemax=${e[1]}`
    console.log(setPriceStr)
    
  }

  const [asideBtnStr,setAsideBtnStr] = useState("")
  // 偵測如果有按下按鈕，就把上面那些資料做成字串set進去
  let asideBtn = (e)=>{
    // 如果tag沒有選到的話，就只呈現價格，因為一定會有價格
    console.log(e)
    if(tagStr === "tag="){
      // setAsideBtnStr(`${priceStr}`)
      // setAsideBtnStr(`${setPriceStr}`)
      setAsideBtnStr(`pricemin=${e[0]}&pricemax=${e[1]}`)
    }else{
      // setAsideBtnStr(`${priceStr}&${tagStr}&titlenum=${tagTitleNum}`)
      setAsideBtnStr(`pricemin=${e[0]}&pricemax=${e[1]}&${tagStr}&titlenum=${tagTitleNum}`)
    }
    
  }


  // 步驟二:當有組合成任一字串，立即組成新字串
  // 按下按鈕才把價錢跟tag的字串set到某個字串裡面，當監聽到字串有所變動，就在下面執行
  // 放組成新字串的地方
  const [selArr, setSelArr] = useState("")
  
  useEffect(()=>{
    
    // 以下是成功的
    let queryString = "";
    if (sortStr !== "sort=0") {
        queryString += `?${sortStr}`;
    }

    if (searchStr !== "") {
        if (sortStr === "sort=0") {
            queryString += `?${searchStr}`;
        } else {
            queryString += `&${searchStr}`;
        }
    }

    if (asideBtnStr !== "") {
        if (sortStr === "sort=0" && searchStr === "") {
            queryString += `?${asideBtnStr}`;
        } else {
            queryString += `&${asideBtnStr}`;
        }
    }
    
    setSelArr(queryString);
    console.log(queryString)
  },[sortStr, searchStr, asideBtnStr])

  
  // link清除篩選
  let selArrAllClear=(e)=>{
    
    // final字串變成空字串
    setSelArr("")
    
    // sort變成初始直
    setSortValue(0)
    setSortStr(`sort=0`)
    localStorage.setItem('sort', `0`)
    
    // 不要有搜尋值
    setSearchValue("")
    setSearchStr(``)
    localStorage.setItem('search', ``);

    // tag清空
    setTagValue([]);
    setTagTitleNum("")
    setTagStr("")
    setTagTitleNum(0)

    // price清空字串
    setPriceStr = ``
    setAsideBtnStr("")

  }

  // 側邊攔清除篩選
  let asideBtnClear = ()=>{
    console.log("asideBtnClear")

    // tag清空
    setTagValue([]);
    setTagTitleNum("")
    setTagStr("")
    setTagTitleNum(0)

    // price清空字串(做到這裡，要怎麼取得最初的最大值跟最小值，或是重新去取得資料庫?)
    // 成功!!
    setPriceStr = ``
    setAsideBtnStr("")

  }

  // 測試用步驟三:之後會放進下面(已經放入下面)
  useEffect(()=>{
    console.log(selArr)
  },[selArr])
  
  // console.log(localStorage)

  

  // 步驟三:當有新的篩選總字串形成就去重新要資料回來
  useEffect(() => {
      // token
      const token = localStorage.getItem('accessToken')
      console.log(localStorage)
      setIsLoading(true)
      
      if(router.isReady){

        // 如果有登入，就取得那個頁面有被收藏商品的id陣列
        if(auth.isAuth){
          console.log(123)
          fetch(`http://localhost:3005/product/user-like`, {
          method:'POST',
          body:JSON.stringify({
          category:category,
          user_id:auth.userData.user_id
          }),
          headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
          }
          })
          .then((res) => res.json())
          .then((result) => {
              console.log(result)
              // userLikeArr = result.map(v=>v.item)
              setUserLikeArr(result.map(v=>v.item_id))
              // console.log(userLikeArr)
              
          })
          .catch((error) => {
              console.log(error)
          })
        }

        // 取得商品資料
        fetch(`http://localhost:3005/product/${category}${selArr}`, {
          method: 'get',
        })
        .then((res) => res.json())
        .then((result) => {
          setProductData(result.products)
          setSlideData(result.slides)
          setBrandData(result.brands)
          setTagData(result.tags)
          setBread(result.bread)
          console.log(result.tags)
          console.log(result.products)
          console.log(result.products.product_id)
          // 如果篩選出來沒有東西的話就跳這個通知
          if(result.products.length === 0 && selArr !== ""){
            console.log(444)
            MySwal.fire({
              title: (
                <>{`無此商品，請重新篩選`}</>
              ),
              icon: 'warning',
              confirmButtonColor: '#003e52',
              cancelButtonColor: '#808080',
              confirmButtonText: '確認',
            }).then((result) => {
              if (result.isConfirmed) {
                selArrAllClear()
              }
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
      }
      

      setTimeout(() => {
        setIsLoading(false)
      }, 2000)

      console.log(router.isReady)
      console.log(category)
      console.log(isLoading)


  }, [router.isReady, category, selArr, auth])

  
  const listloader = (
    <>
      <SkeletonTheme
        duration={2}
        baseColor="#eaeaea" 
        highlightColor="#fff"
        borderRadius={0}

        >
        <div className='container mt-4'>
          <div className='row'>
            <div className='col-md-2 d-md-block d-none'>
               <Skeleton 
                count={1} 
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 20,
                  width: '100%',
                }}
              />
              <Skeleton 
                count={5} 
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 50,
                  width: '100%',
                }}
              />

              <hr className='mb-4' color='#003e52'/>

              <Skeleton 
                count={2} 
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 80,
                  width: '100%',
                }}
              />

            </div>

            <div className='col-md-10 col-12'>
              {/* 電腦版 */}
              <Skeleton 
                count={1} 
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 400,
                  // lineHeight: 2,
                  // padding: '1rem',
                  // marginBottom: '0.5rem',
                  width: '100%',
                }}
                className='d-md-block d-none'
                
              />
              {/* 手機板 */}
              <Skeleton 
                count={1} 
                style={{
                  background: '#eaeaea',
                  display: 'block',
                  height: 250,
                  width: '100%',
                }}
                className='d-md-none d-block'
                
              />
              

              <div className='row'>
                <div className='col-md-3 col-6'>
                  <Skeleton 
                  count={2} 
                  style={{
                    background: '#eaeaea',
                    display: 'block',
                    height: 400,
                    width: '100%',
                  }}
                  
                  />

                </div>

                <div className='col-md-3 col-6'>
                  <Skeleton 
                  count={2} 
                  style={{
                    background: '#eaeaea',
                    display: 'block',
                    height: 400,
                    width: '100%',
                  }}
                  
                  />

                </div>

                <div className='col-md-3 d-md-block d-none'>
                  <Skeleton 
                  count={2} 
                  style={{
                    background: '#eaeaea',
                    display: 'block',
                    height: 400,
                    width: '100%',
                  }}
                  
                  />

                </div>

                <div className='col-md-3 d-md-block d-none'>
                  <Skeleton 
                  count={2} 
                  style={{
                    background: '#eaeaea',
                    display: 'block',
                    height: 400,
                    width: '100%',
                  }}
                  
                  />

                </div>

              </div>
              
            </div>

          </div>
        </div>
        
        
          
          
       
      </SkeletonTheme>
    </>
  )

  const listdisplay = (
    <>
    <List 
    productData={productData} 
    slideData={slideData} 
    brandData={brandData} 
    tagData={tagData} 
    bread={bread} 
    userLikeArr={userLikeArr}
    sortFun={sortFun}
    searchFun={searchFun}
    tagFun={tagFun}
    priceFun={priceFun}
    asideBtn={asideBtn}
    selArrAllClear={selArrAllClear}
    asideBtnClear={asideBtnClear}
   
    />
    </>
  )

  return (
    <>
      <Head>
        <title>MR.BEAN 商品列表</title>
      </Head>
      <Navbar selArrAllClear={selArrAllClear}/>
      {isLoading ? listloader : listdisplay}

      <Footer />
      
    </>
  )
}