import React from 'react'
import styles from './course-detail.module.scss'
import DetailRight from '@/components/course/detail/detail-right'
import DetailAside from '@/components/course/detail/detail-aside'
import { useCart } from '@/hooks/use-cart'

import Image from 'next/image'
import warning2 from '@/assets/gif/icons8-warning2.gif'

export default function Index({courseDetailData={}, breadData={}, userLikeArr={},commentData={}}) {
  const { addItem, Toaster } = useCart()

    return (
      <>
        <main className={`d-md-flex container main ${styles['main container']}`}>
            <DetailAside breadData={breadData}/>
            <DetailRight courseDetailData={courseDetailData} userLikeArr={userLikeArr} commentData={commentData} />
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
          icon:<Image src={warning2} width={25} height={25} alt="warning"/>,

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