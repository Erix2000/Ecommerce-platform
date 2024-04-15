import React,{ useEffect, useState, useRef } from 'react'
import styles from './product-detail.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router';

import LikeFill from '@/assets/img/product/icon/like-fill.svg'
import LikeStroke from '@/assets/img/product/icon/like-stroke.svg'

import Nmage from 'next/image'

// 可愛的輪播圖
import Carousel from 'react-bootstrap/Carousel';
import { Image } from 'react-bootstrap'
// 會員鉤子
import { useAuth } from '@/hooks/use-auth'

import { useCart } from '@/hooks/use-cart'
import warning2 from '@/assets/gif/icons8-warning2.gif'
import toast,{ Toaster } from 'react-hot-toast';

import CommentCard from './comment-card';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'





export default function detailRight({productDetailData={}, userLikeArr={}, commentData={}}) {
    const {addItemDetail,handleStock} =useCart()
    const { auth } = useAuth();
    const MySwal = withReactContent(Swal)

    const router = useRouter();
    const {category, pid} = router.query
    const [isLoading, setIsLoading] = useState(true)
    const [productDetail, setProductDetail] = useState([])

    const [isComment,setIsComment] = useState(false)

    // let averageStars
    const [averageStars,setAverageStars] = useState(0)

    const [hasComment,setHasComment] = useState()
    const [noComment,setNoComment] = useState()

    // if(有登入){
    //     就fetch資料
    //     比對資料
    //     有資料就將圖片換成fill，如果沒有就依然是stroke照片
    // }else{
    //     就把like狀態設定為link連結到會員中心的註冊頁面
    //     設定hover和active皆為true
    // }

    

    // 愛心hover功能
    const [likeHover, setLikeHover] = useState(false)
    // 愛心active功能
    const [likeActive,setLikeActive] = useState(false)

    const token = localStorage.getItem('accessToken')
    
    // 取消收藏
    let unlike = ()=>{
        // 刪除愛心
        fetch(`http://localhost:3005/product/plike`, {
        method:'DELETE',
        body:JSON.stringify({
            user_id:auth.userData.user_id,
            item_id:productDetailData[0].product_id
        }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
        })
        .then((res) => res.json())
        .then((result) => {
            console.log(result)
        })
        .catch((error) => {
            console.log(error)
            
        })
    }

    // 加入收藏
    let like = ()=>{
        console.log(
            productDetailData[0].product_id
        )
        // 加入愛心
        fetch(`http://localhost:3005/product/plike`, {
            method:'POST',
            body:JSON.stringify({
            user_id:auth.userData.user_id,
            item_id:productDetailData[0].product_id
            }),
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .then((result) => {
            console.log(result)
        })
        .catch((error) => {
            console.log(error)
        })
        console.log(123)
    }

    

    // 圖片變換
    const [imgSrc,setImgSrc] = useState("")
    const [imgArr, setImgArr] = useState([])
    let imgsrc;

    // tab
    const data = [
        {id : '1',
         tabTitle: "商品內容"
        },
        {id : '2',
         tabTitle: "商品規格"
        },
        {id : '3',
         tabTitle: "其他"
        }
      ]
    const [visibleTab, setVisibleTab] = React.useState(data[0].id)

    // 如果我按了選項，就就把id放在某個狀態，他自己的classname改變
    const listTitles = data.map((item) => 
        <li onClick={() => setVisibleTab(item.id)} className={visibleTab === item.id ? `${styles['tab-title']} ${styles['tab-title--active']}` : `${styles['tab-title']}`}>{item.tabTitle}</li>
    )       
                                    
    

    // 購物車旁邊的加減
    const [num, setNum] = useState(1)

    useEffect(()=>{
        setHasComment(
            <>
            {commentData.map((commentItem, i)=>{
                return (
                    <CommentCard key={i} commentItem={commentItem} />
                )
                
            })}
            </>
        )

        setNoComment(
            <>尚無評論</>
        )
    
        

    },[isComment])

        

    
    useEffect(() => {
        setIsLoading(true)
        
        
        
        if (router.isReady && category && pid) {
            
            console.log(category)
            
            console.log(productDetailData)
            setProductDetail(productDetailData[0])
            console.log(productDetailData[0])
            const { product_img } = productDetailData[0]
            let Arr = product_img?.split(",")
            setImgArr(Arr);
            setImgSrc(Arr?Arr[0]:[])

            
            
        }

        if(commentData.length>0){
            setIsComment(true)
            // 評論
            let totalStars = commentData.reduce((sum, item) => sum + item.comment_star, 0);
            // 計算平均值
            setAverageStars(Math.round((totalStars / commentData.length) * 10) / 10)
            // averageStars = Math.round((totalStars / commentData.length) * 10) / 10;
            console.log(averageStars); 
        }else{
            setIsComment(false)
            setAverageStars(0)
            // averageStars = 0
        }

        setTimeout(() => {
            setIsLoading(false)
        }, 2000)

    }, [router.isReady, pid,averageStars])

    useEffect(()=>{
        if(productDetail.length === 0){
            
        }else{
            if(auth.isAuth){
                if(category){
                    if(userLikeArr.includes(productDetail.product_id.toString())){
                    setLikeHover(true)
                    setLikeActive(true)
                    console.log(123)
                    }
                }
            
            }
        }
        
        console.log(productDetail)
    },[productDetail])

    
    // 如果按下按鈕就設定成那個圖片
    let getImgSrc = (e)=>{
        let img = e.target.src;
        imgsrc = img.split('/').pop();
        console.log(imgsrc)
        setImgSrc(imgsrc)
    }


    return (
      <>
        {/* 手機版slide */}
        <Carousel pause={'hover'} style={{aspectRatio: '1/1'}} className={`carousel slide-m slide-pics ${styles['slide-m']} ${styles['carousel']} ${styles['slide-pics']}`}>
              {imgArr?.map((v,i)=>{
                  return (
                      <Carousel.Item key={i}>
                          <Image style={{aspectRatio: '1/1'}} src={`/product-img/product/${productDetail.brand_id}/pro/${v}`} fluid className='w-100'/>
                      </Carousel.Item>
                  ) 
               })} 
      
        </Carousel>
        
        
        {/* 電腦版 */}
        <div className={`container ${styles['content']}`}>
            <div className={`${styles['product-main-content']} row`}>
                <div className={`${styles['product-pics']} col-5`}>
                    <div className={`${styles['product-main-pic']}`}>
                        <img
                        style={{aspectRatio: '1/1'}} 
                        src={`/product-img/product/${productDetail.brand_id}/pro/${imgSrc}`} 
                        alt="" />
                    </div>
                    <div className={`${styles['product-sub-pics']} d-flex`}>
                        {imgArr?.map((v,i)=>{
                            return (
                                <div 
                                    key={i}
                                    style={{ width:'23.2%', justifyContent:'start',
                                    aspectRatio: '1/1' }} 
                                    className={`${styles['product-sub-pic']}`}
                                    
                                >
                                    <label htmlFor="img1">
                                        <input type="radio" id="img1" name="img" />
                                        <img 
                                        style={{aspectRatio: '1/1'}}
                                        src={`/product-img/product/${productDetail.brand_id}/pro/${v}`}
                                        onClick={(e) => getImgSrc(e)}

                                        alt="" />
                                    </label>
                                </div>
                            )
                        })}
                        
                        
                        
                        
                    </div>
                </div>
                <div className={`${styles['product-main-right']} col-md-7 col-12`}>
                    <div className={`${styles['product-title']}`}>{productDetail.product_name}</div>
                    <div className={`${styles['product-p']}`}>
                        {productDetail.product_intro}<span className={`${styles['stock']}`}>*庫存{productDetail.product_stock}個</span>
                    </div>
                    <div className={`${styles['price-like']}`}>
                        <div className={`${styles['product-price']}`}>NT${productDetail.product_price}&nbsp;
                        <span className={`${styles['discount']}`} style={{ textDecoration: "line-through" }}>
                        NT${productDetail.product_origin_price}</span></div>

                        {likeHover ? (
                        <Nmage
                            // 照片二
                            className={`${styles['product-like']}`}
                            style={{
                            width: '30px',
                            height: '30px',
                            }}
                            
                            src={LikeFill}
                            alt="Hover Image"
                            onMouseOut={()=>{
                                if(likeActive){
                                    setLikeHover(true)
                                }else{
                                    setLikeHover(false)
                                }
                            }}
                            onClick={(e)=>{
                                e.stopPropagation()
                                e.preventDefault()
                                if (auth.isAuth) {
                                    if (likeActive) {
                                    setLikeHover(false)
                                    setLikeActive(false)
                                    toast.success('商品已取消收藏')
                                    unlike()
                                    } else {
                                    setLikeHover(true)
                                    setLikeActive(true)
                                    toast.success('商品已加入收藏')
                                    like()
                                    }
                                } else {
                                    MySwal.fire({
                                    title: (
                                        <>{`尚未登入，無法收藏商品`}</>
                                    ),
                                    
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#003e52',
                                    cancelButtonColor: '#808080',
                                    confirmButtonText: '前往登入',
                                    cancelButtonText: '繼續逛逛',
                                    }).then((result) => {
                                    if (result.isConfirmed) {
                                        router.push("/member/login")
                                    }
                                    })
                                }
                                
                            }}
                        />
                        ) : (
                        <Nmage
                            // 照片一
                            className={`${styles['product-like']}`}
                            style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: 'fff',
                            }}
                            src={LikeStroke}
                            alt="Normal Image"
                            onMouseOver={()=>{
                                setLikeHover(true)
                            }}
                            onClick={(e)=>{
                                e.stopPropagation()
                                e.preventDefault()
                                if (auth.isAuth) {
                                    setLikeHover(true)
                                    setLikeActive(true)
                                    like()
                                } else {
                                    MySwal.fire({
                                    title: (
                                        <>{`尚未登入，無法收藏商品`}</>
                                    ),
                                    
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#003e52',
                                    cancelButtonColor: '#808080',
                                    cancelButtonText: '繼續逛逛',
                                    confirmButtonText: '前往登入',
                                    
                                    }).then((result) => {
                                    if (result.isConfirmed) {
                                        router.push("/member/login")
                                    }
                                    })
                                }
                            }}
                        />
                        )}
                    </div>
                    <div className={`${styles['product-btn-group']}`}>
                        <div className={`${styles['product-qua-btn']}`}>
                            
                            <div 
                                type='button'
                                className={`minus ${styles['minus']} ${styles['qua-btn']}`} 
                                href=""
                                onClick={() => {
                                    if(num===1){
                                        setNum(1)
                                    }else{
                                        setNum(num - 1)
                                    }
                                    
                                }}
                                >
                                <i className="bi bi-dash-lg" />
                            </div>
                            {/* <div className={`${styles['qua']}`}>{num}</div> */}
                            <input
                                className={`${styles['qua']}`}
                                type="text"
                                value={num}
                                onChange={(e) => {
                                    const modifiedNum = Number(e.target.value)
                                    if(e.target.value < 0 || isNaN(e.target.value) || e.target.value === NaN){
                                        setNum(0)
                                    }else{
                                        setNum(modifiedNum)
                                    }
                                    
                                }}
                            />
                            <div 
                                type='button'
                                className={`plus ${styles['plus']} ${styles['qua-btn']}`} 
                                href=""
                                onClick={() => {
                                    if(num === productDetail.product_stock){
                                        setNum(productDetail.product_stock)
                                        handleStock(
                                            productDetail.product_name,
                                            productDetail.product_stock
                                          )
                                    }else{
                                        setNum(num + 1)
                                    }
                                    
                                }}
                                
                                >
                            <i class="bi bi-plus-lg"></i>
                            </div>
                        </div>
                        <div 
                            style={{ cursor: 'pointer' }}
                            className={`add-cart ${styles['add-cart']}`}
                            role="presentation"
                            onClick={() => {
                              if (auth.isAuth) {
                                addItemDetail({ ...productDetail, item_type: 'product' }, num)
                              } else {
                                MySwal.fire({
                                  title: (
                                    <>{`尚未登入，無法加入購物車`}</>
                                  ),
                                  
                                  icon: 'warning',
                                  showCancelButton: true,
                                  confirmButtonColor: '#003e52',
                                  cancelButtonColor: '#808080',
                                  confirmButtonText: '前往登入',
                                  cancelButtonText: '繼續逛逛',
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    router.push("/member/login")
                                  }
                                })
                              }
                            }}
                        >
                            加入購物車
                        </div>
                    </div>
                    <div className={`${styles['product-p-m']}`}>
                        簡介:
                        <br />
                        {productDetail.product_intro}<span className={`${styles['stock']}`}>*庫存{productDetail.product_stock}個</span>
                    </div>
                </div>
            </div>

            <div className={`${styles['product-sub-content']}`}>
                <div className={`${styles['tabs']}`}>
                    {/* 如果狀態等於1就顯示，不是1就不顯示 */}
                    <ul style={{padding:0, margin:0}} className={`${styles['tab-titles']}`}>
                    {listTitles}
                    </ul>
                    <div style={{padding:10}} className={`${styles['tab-content']}`}>
                    <p style={visibleTab === '1' ? {} : {display: 'none'}}>{productDetail.product_content}</p>
                    <p style={visibleTab === '2' ? {} : {display: 'none'}}>{productDetail.product_spec}</p>
                    <p style={visibleTab === '3' ? {} : {display: 'none'}}>{productDetail.product_other}</p>
                    </div>
                </div>
                

                
                
            </div>

            <div className={`${styles['product-comments']}`}>
                <div className={`${styles['product-comments-title']}`}>
                    評論
                    {` `}
                    <span className={`${styles['score']}`}>{averageStars}分</span>
                    {` `}
                    <i className={`bi bi-star-fill star ${styles['star']}`} />
                    {` `}
                    (共{commentData.length}則)
                </div>
                {/* <div className={`${styles['product-comment']} row`}>
                    <div className={`${styles['product-comment-header']} col-2`}>
                        <img src="/product-img/icon/header.jpg" alt="" />
                    </div>
                    <div className={`${styles['prodoct-comment-content']} col-10`}>
                        <div className={`${styles['prodoct-comment-content-top']}`}>
                            <div className={`${styles['client-name']}`}>
                                jason@gmail.com
                                <div className={`${styles['like']}`}>
                                    <i className="bi bi-star-fill star" />
                                    <i className="bi bi-star-fill star" />
                                    <i className="bi bi-star-fill star" />
                                    <i className="bi bi-star-fill star" />
                                    <i className="bi bi-star-fill star" />
                                </div>
                            </div>
                            <div className={`${styles['date']}`}>2024/01/25</div>
                        </div>
                        <div className={`${styles['date-m']}`}>2024/01/25</div>
                        <div className={`${styles['comment']}`}>
                            快速送達！包裝精美，價格便宜！冷冷的冬天很適合在家中來一杯，非常推薦～！
                        </div>
                    </div>
                </div>
                <div className={`${styles['product-comment']} row`}>
                    <div className={`${styles['product-comment-header']} col-2`}>
                        <img src="/product-img/icon/header.jpg" alt="" />
                    </div>
                    <div className={`${styles['prodoct-comment-content']} col-10`}>
                        <div className={`${styles['prodoct-comment-content-top']}`}>
                            <div className={`${styles['client-name']}`}>
                                jason@gmail.com
                                <div className={`${styles['like']}`}>
                                    <i className="bi bi-star-fill star" />
                                    <i className="bi bi-star-fill star" />
                                    <i className="bi bi-star-fill star" />
                                    <i className="bi bi-star-fill star" />
                                    <i className="bi bi-star-fill star" />
                                </div>
                            </div>
                            <div className={`${styles['date']}`}>2024/01/25</div>
                        </div>
                        <div className={`${styles['date-m']}`}>2024/01/25</div>
                        <div className={`${styles['comment']}`}>
                            快速送達！包裝精美，價格便宜！冷冷的冬天很適合在家中來一杯，非常推薦～！
                        </div>
                    </div>
                </div> */}
                {isComment? hasComment : noComment}
                
                {/* <div className={`${styles['more']}`}>
                    <a href="">
                        more
                        <i className="bi bi-chevron-double-down" />
                    </a>
                </div> */}
            </div>

        </div>

        <Toaster
        toastOptions={{
          iconTheme: {
            primary: '#003e52',
          },
          position: 'bottom-right',
          duration: 2000,
          success: {
            style: {
              border: '1.5px solid #003e52',
              borderRadius: '0',
            },
          },
          error: {
            icon: <Image src={warning2} width={25} height={25} alt="warning" />,
            style: {
              border: '1.5px solid #003e52',
              borderRadius: '0',
            },
          },
        }}
      />

      </>
    )
  }