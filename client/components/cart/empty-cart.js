import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import navLogo from '@/assets/img/logo/logo-indigo.svg'
import styles from '@/components/cart/cart-modules/step0.module.scss'

export default function EmptyCart() {
  return (
    <>
      <section className={`container ${styles['empty-cart-logo-group']}`}>
        <div className={styles['image']}>
          <Image src={navLogo} alt="logo" width={250} height={250} />
        </div>
        <div className={styles['illustrate']}>您的購物車目前無任何商品</div>
        <Link href="/product/00" className={styles['direct-button']}>
          回商品首頁
        </Link>
      </section>
    </>
  )
}
