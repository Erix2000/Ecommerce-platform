import React from 'react'
import styles from '@/components/layout/public-version/about.module.scss'
import Image from 'next/image'

export default function About() {
  return (
    <>
      <div className={styles['header-section']}>
        <div className={styles['header-image-wrapper']}>
          <Image
            src="/about/header.png"
            alt="頁首圖片"
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className={styles['header-group']}>
            <p className={styles['header-text']}>故事從這裡說起</p>
            <button type="button" className={styles['header-btn']}>
              MORE
            </button>
          </div>
        </div>
      </div>
      <div className={styles['main-section']}>
        <h5 className={styles['title']}>About Mr.Bean 豆豆先生</h5>
        <p className={styles['description']}>我們的故事</p>
        <div className={`${styles['section']} ${styles['first-section']}`}>
          <Image
            src="/about/1.png"
            alt="咖啡制作過程"
            className={styles['first-image']}
            width={500}
            height={500}
          />
          <div className={styles['first-text']}>
            <span>故事開始於一群對咖啡充滿熱情的年輕創業者</span>
            <br />
            我們一直以來都是咖啡的愛好者，無論是早晨的第一杯咖啡，或是下午茶的小憩，咖啡總是陪伴著我們走過每一天。
            <br />
            某天，我們在旅行中發現了一家小而古樸的咖啡豆店。這家店散發著濃濃的咖啡香，吸引著路人進去品味。店內陳列著各種世界各地的優質咖啡豆，每一袋都散發著不同的風味，仿佛能夠娓娓道來咖啡的故事。
          </div>
        </div>
        <div className={`${styles['section']} ${styles['second-section']}`}>
          <Image
            src="/about/2.png"
            alt="咖啡店內部"
            className={styles['second-image']}
            width={500}
            height={500}
          />
          <div className={styles['second-text']}>
            <span>受到啟發的我們決定回到家鄉開設一咖啡豆專賣店。</span>
            <br />
            夢想是將優質的咖啡豆帶給更多人，讓每個人都能夠享受到來自世界各地的精選咖啡。
            <br />
            在店內，每一款咖啡豆都經過精心挑選，以確保品質的一致性和獨特性。精選不同咖啡產區的專業烘豆師傅，精通各種烘豆技術，確保每一杯咖啡都能呈現出最佳風味。
          </div>
        </div>
      </div>
      <div className={styles['footer-section']}>
        <div className={styles['footer-image-wrapper']}>
          <Image
            src="/about/footer.png"
            alt="咖啡工具"
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className={styles['footer-group']}>
            <h3
              className={`${styles['footer-font']} ${styles['footer-title']} `}
            >
              「Mr. Bean 豆豆咖啡」不僅僅是一家咖啡豆專賣店，
              更是一個咖啡愛好者的聚會場所。
            </h3>
            <p className={`${styles['footer-font']} ${styles['footer-text']}`}>
              <br />
              希望這裡能夠成為一個交流咖啡文化的空間，讓人們在品味美味的同時，也能夠分享彼此對咖啡的熱愛和心得。
              <br />
              店內裝潢風格簡約舒適，牆上掛了世界各地咖啡豆的故事，每張照片都記錄著不同產區的農夫辛勤付出。
              <br />
              這些故事讓每一位光臨的客人感受到咖啡背後的故事，彷彿和遠方的咖啡農場建立起一種無形的聯繫。
              <br />
              咖啡不僅僅是一種飲料，更是一種文化和生活態度。我們期待著這個小小的咖啡豆專賣店，能夠成為每位咖啡愛好者的心靈樞紐，讓大家在這裡找到屬於自己的一杯完美咖啡，品味生活的美好。
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
