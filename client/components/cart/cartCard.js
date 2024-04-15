import React, { useEffect, useState } from 'react'
import styles from '@/components/cart/cart-modules/cartCard.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/use-cart'

export default function CartCard({ visiable }) {
  const {
    cart,
    productItems,
    courseItems,
    handleThousand,
    productLength,
    courseLength,
  } = useCart()
  const [fiveItem, setFiveItem] = useState([])
  const totalLength = productLength + courseLength

  useEffect(() => {
    const sortCart = cart.sort((a, b) => {
      return new Date(b.addTime) - new Date(a.addTime)
    })
    setFiveItem(sortCart.slice(0, 5))
  }, [cart])
  return (
    <section className={`${visiable ? '' : 'd-none'} ${styles['cart-card']}`}>
      <div className={styles['card-container']}>
        <div className={styles['card-title']}>
          <p>最近加入商品</p>
        </div>
        {fiveItem.map((item) => {
          if (item.item_type == 'product') {
            const img = item.product_img.split(',')[0]
            const folderPosition = item.product_code.slice(0, 2)
            return (
              <div key={item.product_id} className={styles['info']}>
                <div className={styles['image-container']}>
                  <Image
                    src={`/product-img/product/${folderPosition}/pro/${img}`}
                    width={80}
                    height={80}
                    alt={`${item.product_name}`}
                  />
                </div>
                <div className={styles['info-group']}>
                  <h3 className={styles['product-name']}>{item.item_name}</h3>
                  <p className={styles['product-price']}>
                    $NT {handleThousand(item.item_price)}
                  </p>
                </div>
              </div>
            )
          } else if (item.item_type == 'course') {
            return (
              <div key={item.course_id} className={styles['info']}>
                <div className={styles['image-container']}>
                  <Image
                    src={`/course-img/${item.course_img}`}
                    width={80}
                    height={80}
                    alt={`${item.course_name}`}
                  />
                </div>
                <div className={styles['info-group']}>
                  <h3 className={styles['product-name']}>{item.course_name}</h3>
                  <p className={styles['product-price']}>
                    $NT {handleThousand(item.item_price)}
                  </p>
                </div>
              </div>
            )
          }
        })}

        <div className={styles['under-info-group']}>
          <p className={styles['under-info']}>
            {totalLength <= 5
              ? `購物車內共有${totalLength}件商品`
              : `尚有${totalLength ? totalLength - 5 : 0}件商品尚未展示`}
          </p>
          <Link className={styles['cart-link']} href={`/cart`}>
            查看購物車
          </Link>
        </div>
      </div>
    </section>
  )
}
