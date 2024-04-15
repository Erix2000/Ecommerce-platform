import React from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import About from '@/components/layout/public-version/about'
import Footer from '@/components/layout/public-version/footer'

export default function Index() {
  return (
    <>
      <Head>
        <title>MR.BEAN - 關於我們</title>
      </Head>
      <Navbar />
      <About></About>
      <Footer />
    </>
  )
}
