import '@/styles/style.scss'

import { CartProvider } from '@/hooks/use-cart'

import { AuthProvider } from '@/hooks/use-auth'

import { LecturerProvider } from '@/hooks/use-lecturer'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  // 使用在頁面層級定義的佈局（如果可用）
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          href="https://live.staticflickr.com/65535/53649622652_358ecdacf2_b.jpg"
        />
      </Head>
      <AuthProvider>
        <LecturerProvider>
          <CartProvider>{getLayout(<Component {...pageProps} />)}</CartProvider>
        </LecturerProvider>
      </AuthProvider>
    </>
  )
}
