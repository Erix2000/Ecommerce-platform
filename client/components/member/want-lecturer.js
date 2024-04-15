import React from 'react'
// import styles from './member.module.scss'
import Image from 'next/image'
// import lecturer from '@/public/lecturer-img/lecturer2.png'
import img from '@/public/lecturer-img/LecturerRecruitment.svg'

export default function UserInfoConfirm() {
  // const style = {
  //   container: {
  //     maxWidth: '100%',
  //     margin: '20px auto',
  //     padding: '20px',
  //     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  //     borderRadius: '8px',
  //     backgroundColor: '#003e52',
  //   },
  //   header: {
  //     fontSize: '18px',
  //     color: '#b2acac',
  //     marginBottom: '10px',
  //   },
  //   wantImg: {
  //     margin: 'auto',
  //     width: '100%',
  //     height: '60vh',
  //   },
  //   text: {
  //     fontSize: '16px',
  //     color: '#bc955c',
  //     textAlign: 'justify',
  //     lineHeight: '1.6',
  //   },
  //   highlight: {
  //     color: '#cdad80',
  //     fontWeight: 'bold',
  //   },
  //   footer: {
  //     marginTop: '20px',
  //     fontSize: '16px',
  //     color: '#cdad80',
  //     textAlign: 'right',
  //   },
  // }
  return (
    <>
      <Image src={img} alt="logo" width={1000} height={1000} />
    </>
    // <div style={style.container}>
    //   <div>
    //     <div>
    //       <Image
    //         src={lecturer}
    //         style={style.wantImg}
    //         alt="logo"
    //         width={1000}
    //         height={500}
    //       />
    //     </div>
    //     <div style={style.container}>
    //       <h6 style={style.header}>
    //         我們正在尋找充滿熱情、經驗豐富的咖啡講師，加入我們的團隊，共同探索和分享咖啡的無限可能
    //       </h6>
    //       <p style={style.text}>
    //         如果你對咖啡有深厚的了解，善於與人交流，並願意將你的知識和熱情傳遞給他人，那麼請不要猶豫，立即聯繫我們。
    //       </p>
    //       <p style={style.text}>
    //         我們提供優厚的待遇，靈活的工作時間，以及一個充滿活力和創意的工作環境。
    //       </p>
    //       <p style={style.text}>
    //         無論你是專業的咖啡師、咖啡愛好者，還是有志於咖啡教育領域的朋友，只要你有心，這裡都有你的舞台。
    //       </p>
    //       <p style={{ ...style.text, ...style.highlight }}>
    //         讓我們一起，用咖啡連接每一個瞬間，激發更多人對咖啡文化的熱愛和探索。期待你的加入！<br/>
    //         若有需要，請至門市填寫申請書。
    //       </p>
    //       <div style={style.footer}>— MR.Bean 豆豆先生</div>
    //     </div>
    //   </div>
    // </div>
  )
}
