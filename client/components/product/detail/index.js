import React from 'react'
import styles from './product-detail.module.scss'
import DetailRight from '@/components/product/detail/detail-right'
import DetailAside from '@/components/product/detail/detail-aside'


export default function Index({productDetailData={}, brandData={}, breadData={}, userLikeArr={},commentData={}}) {

  

    return (
      <>
        <main className={`d-md-flex container main ${styles['main container']}`}>
            <DetailAside brandData={brandData} breadData={breadData} />
            <DetailRight productDetailData={productDetailData} userLikeArr={userLikeArr} commentData={commentData} />
        </main>

      </>
    )
}