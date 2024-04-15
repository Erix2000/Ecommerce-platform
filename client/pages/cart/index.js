import React from 'react'
import Navbar from '@/components/layout/public-version/navbar'

import Footer from '@/components/layout/public-version/footer'
import Head from 'next/head'
import Step1 from '@/components/cart/step1'

export default function Index() {
  return (
    <>
      <Head>
        <title>MR.BEAN 購物車</title>
      </Head>
      <Navbar />
      <Step1 />
      <Footer />
    </>
  )
}
