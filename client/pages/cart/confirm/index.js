import React from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Step2 from '@/components/cart/step2'
import Footer from '@/components/layout/public-version/footer'
export default function CartConfirm() {
  return (
    <>
      <Head>
        <title>MR.BEAN 商品確認及資料填寫</title>
      </Head>
      <Navbar />
      <Step2 />
      <Footer />
    </>
  )
}
