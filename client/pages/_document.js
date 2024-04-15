import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Bootstrap Icons CSS 引入 Bootstrap Icons 樣式表 */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
      {/* Google Fonts Preconnect Google 字體預連接 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      {/* Noto Serif SC Google Font 引入 Noto Serif TC Google 字體 */}
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@200;300;400;500;600;700;900&display=swap"
        rel="stylesheet"
      />

      <title>MR.BEAN 咖啡豆專賣店</title>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
