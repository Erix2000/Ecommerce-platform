import React, { useRef } from 'react'

import Process from './process'
import EmptyCart from './empty-cart'
import HaveItem from './haveItem'
import { useCart } from '@/hooks/use-cart'
import styles from '@/components/cart/cart-modules/step1.module.scss'
export default function Step1() {
  const { cart } = useCart()
  const isEmpty = cart.length
  const loader = useRef(null)

  return (
    <>
      <div className={`${styles['loader-container']} d-none`} ref={loader}>
        <div className={`${styles['lds-ring']}`}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <main className="main-container container">
        <Process step={1} />

        {isEmpty > 0 ? <HaveItem loader={loader} /> : <EmptyCart />}
      </main>
    </>
  )
}
