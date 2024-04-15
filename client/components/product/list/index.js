import React, { useState, useRef, useEffect } from 'react'
import styles from './product-list.module.scss'
import ListRight from '@/components/product/list/list-right'
import ListAside from '@/components/product/list/list-aside'
import { useCart } from '@/hooks/use-cart'
import warning2 from '@/assets/gif/icons8-warning2.gif'
import toast from 'react-hot-toast'


export default function Index({
  productData = {}, 
  slideData = {}, 
  brandData={}, 
  tagData={}, 
  bread={}, 
  userLikeArr={},
  sortFun=()=>{},
  searchFun=()=>{},
  tagFun=()=>{},
  priceFun=()=>{},
  tagTitleFun=()=>{},
  tagTitleRef,
  asideBtn=()=>{},
  selArrAllClear=()=>{},
  asideBtnClear=()=>{}
}) {
    const { addItem, Toaster } = useCart()

    // 商品已加入收藏吐司
    let likeNotify = ()=>{
      toast.success('商品已加入收藏')
    }

    // 商品已取消收藏吐司
    let unlikeNotify = ()=>{
      toast.success('商品已取消收藏')
    }

    // 測試用
    const onButtonClick = (message) => {
      console.log("Message from child:", message);
    };

    return (
      <>
        <main class={`main d-md-flex container ${styles['main container']}`}>
            <ListAside 
            brandData={brandData} 
            tagData={tagData} 
            slideData={slideData} 
            bread={bread} 
            productData = {productData}
            tagFun={tagFun}
            priceFun={priceFun}
            tagTitleFun={tagTitleFun}
            tagTitleRef={tagTitleRef}
            asideBtn={asideBtn}
            selArrAllClear={selArrAllClear}
            asideBtnClear={asideBtnClear}
            />
            <ListRight 
            productData={productData} 
            tagData={tagData} 
            slideData={slideData} 
            brandData={brandData} 
            addItem={addItem} 
            userLikeArr={userLikeArr} onButtonClick={onButtonClick} 
            sortFun={sortFun} 
            searchFun={searchFun}
            tagFun={tagFun}
            priceFun={priceFun}
            tagTitleFun={tagTitleFun}
            asideBtn={asideBtn}
            selArrAllClear={selArrAllClear}
            asideBtnClear={asideBtnClear}
            likeNotify={likeNotify}
            unlikeNotify={unlikeNotify}
            />
           
        </main>
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
