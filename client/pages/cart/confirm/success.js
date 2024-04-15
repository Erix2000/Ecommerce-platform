import React from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Footer from '@/components/layout/public-version/footer'
import Step3 from '@/components/cart/step3'

export default function Success() {
  return (
    <>
      <Head>
        <title>MR.BEAN 訂單成立</title>
      </Head>
      <Navbar />
      <Step3 />
      <Footer />
    </>
  )
}
