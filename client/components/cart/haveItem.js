/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react'
import styles from '@/components/cart/cart-modules/step1.module.scss'
import { useCart } from '@/hooks/use-cart'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'

export default function HaveItem({ loader }) {
  const { auth } = useAuth()
  const {
    cart,
    plusQuan,
    minusQuan,
    removeItem,
    textNumSet,
    subTotalPrice,
    totalItems,
    productItems,
    productLength,
    courseItems,
    courseLength,
    handleThousand,
    chekboxToggle,
    Toaster,
    handleStock,
    // checkChecked, 修改
    checkedCart,
    setCart,
  } = useCart()
  const [user, setUser] = useState({
    status: '',
    user: {
      user_name: '',
      user_sex: '',
    },
  })
  const getUser = async (token) => {
    const userData = await fetch('http://localhost:3005/api/member/check', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((result) => {
        return result.json()
      })
      .then((response) => {
        return response
      })
      .catch((err) => {
        return err
      })

    setUser(userData)
  }

  let productCounter = 0
  const [checkedAllProduct, setCheckedAllProduct] = useState(false)
  const [checkedAllCourse, setCheckedAllCourse] = useState(false)
  const [checkedAllProduct2, setCheckedAllProduct2] = useState(false)
  const [checkedAllCourse2, setCheckedAllCourse2] = useState(false)

  useEffect(() => {
    if (checkedAllProduct) {
      const allTrue = cart.map((item) => {
        if (item.item_type === 'product') {
          return { ...item, checked: true }
        } else {
          return item
        }
      })
      setCart(allTrue)
    } else if (!checkedAllProduct && !checkedAllProduct2) {
      const allFalse = cart.map((item) => {
        if (item.item_type === 'product') {
          return { ...item, checked: false }
        } else {
          return item
        }
      })
      setCart(allFalse)
    }
  }, [checkedAllProduct, checkedAllProduct2])
  useEffect(() => {
    if (checkedAllCourse) {
      const allTrue = cart.map((item) => {
        if (item.item_type === 'course') {
          return { ...item, checked: true }
        } else {
          return item
        }
      })
      setCart(allTrue)
    } else if (!checkedAllCourse && !checkedAllCourse2) {
      const allFalse = cart.map((item) => {
        if (item.item_type === 'course') {
          return { ...item, checked: false }
        } else {
          return item
        }
      })
      setCart(allFalse)
    }
  }, [checkedAllCourse, checkedAllCourse2])

  useEffect(() => {
    const product = productItems(cart).filter((item) => {
      return item.checked === true
    })
    const course = courseItems(cart).filter((item) => {
      return item.checked === true
    })
    if (product.length === productLength) {
      setCheckedAllProduct(true)
    } else if (product.length < productLength) {
      setCheckedAllProduct(false)
    }
    if (course.length === courseLength) {
      setCheckedAllCourse(true)
    } else if (course.length < courseLength) {
      setCheckedAllCourse(false)
    }
  }, [cart])
  useEffect(() => {
    if (auth.isAuth) {
      const token = localStorage.getItem('accessToken')
      getUser(token)
    }
  }, [auth])

  return (
    <>
      {/* 打招呼開始 */}
      <section className={`${styles['greet']}`}>
        <p>
          您好&nbsp;&nbsp;
          <span>
            {user.user.user_name ? user.user.user_name : ''}{' '}
            {user.user.user_sex === '生理男'
              ? '先生'
              : user.user.user_sex === '生理女'
              ? '小姐'
              : '先生/小姐'}
          </span>
        </p>
        <p>以下是您購物車內的商品</p>
      </section>
      {/* 打招呼結束 */}
      {/* 購物車開始 */}

      <section className={`${styles['cart-product-container']}`}>
        <div className={`container ${styles['container']}`}>
          <div
            className={`${productLength < 1 ? 'd-none' : ''} ${
              styles['title-check-group']
            }`}
          >
            <label className={`${styles['custom-checkbox']}`}>
              <input
                type="checkbox"
                checked={checkedAllProduct}
                onChange={(e) => {
                  setCheckedAllProduct(e.currentTarget.checked)
                  setCheckedAllProduct2(e.currentTarget.checked)
                }}
              />
              <span className={`${styles['checkmark']}`} />
            </label>{' '}
            <p>MR.BEAN 商品 ({productLength})</p>
          </div>

          <div
            className={`${productLength < 1 ? 'd-none' : ''}${
              styles['cart-product-topline']
            }`}
          />
          {/* 商品開始 */}
          {productItems(cart).map((item) => {
            {
              /* const img = item.product_img.split(',')[0] */
            }
            const img = item.product_img.split(',')[0]
            const folderPosition = item.product_code.slice(0, 2)

            productCounter++

            return (
              <div key={item.item_id} className={`${styles['cart-product']}`}>
                <div className={`${styles['cart-product-info']}`}>
                  <label className={`${styles['custom-checkbox']}`}>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {
                        chekboxToggle(cart, item.item_id, item.item_type)
                      }}
                    />
                    <span className={`${styles['checkmark']}`} />
                  </label>
                  <Image
                    src={`/product-img/product/${folderPosition}/pro/${img}`}
                    width={151}
                    height={151}
                    alt={item.product_name}
                  />
                  <div className={`${styles['info-col']}`}>
                    <div className={`${styles['cart-product-title-group']}`}>
                      <Link
                        href={`/product/${folderPosition}/${item.product_code}`}
                        className={`${styles['cart-product-title']}`}
                      >
                        {item.product_name}
                      </Link>
                      <i
                        className={`bi bi-trash3 ${styles['bi-trash3']}`}
                        role="presentation"
                        onClick={() => {
                          removeItem(
                            cart,
                            item.item_id,
                            item.item_type,
                            item.product_name
                          )
                        }}
                      />
                    </div>
                    <p className={`${styles['specification']}`}>
                      {item.product_spec}
                    </p>
                    <p className={`${styles['specification-m']}`}>
                      {item.product_spec}
                    </p>
                    <div className={`${styles['cart-product-price-group']}`}>
                      <div className={`${styles['cart-product-amount']}`}>
                        <div
                          className={`${styles['operator']}`}
                          role="presentation"
                          onClick={() => {
                            minusQuan(
                              cart,
                              item.item_id,
                              item.item_type,
                              item.product_name
                            )
                          }}
                        >
                          -
                        </div>
                        <input
                          className={`${styles['amount']}`}
                          type="text"
                          value={item.quantity}
                          onChange={(e) => {
                            const modifiedNum = Number(e.target.value)
                            textNumSet(
                              cart,
                              item.item_id,
                              item.item_name,
                              item.item_type,
                              item.item_stock,
                              modifiedNum
                            )
                          }}
                        />
                        <div
                          className={`${styles['operator']}`}
                          role="presentation"
                          onClick={() => {
                            if (item.quantity >= item.item_stock) {
                              handleStock(item.item_name, item.item_stock)
                            } else {
                              plusQuan(cart, item.item_id, item.item_type)
                            }
                          }}
                        >
                          +
                        </div>
                      </div>
                      <div className={`${styles['cart-price-group']}`}>
                        <p className={`${styles['cart-prev-price']}`}>
                          NT$ {handleThousand(item.product_origin_price)}
                        </p>
                        <p className={`${styles['cart-price']}`}>
                          NT$ {handleThousand(item.product_price)}
                        </p>
                      </div>
                    </div>
                    <div className={`${styles['cart-price-group-m']}`}>
                      <p className={`${styles['cart-prev-price-m']}`}>
                        NT$ {handleThousand(item.product_origin_price)}
                      </p>
                      <p className={`${styles['cart-price-m']}`}>
                        NT$ {handleThousand(item.product_price)}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`${
                    productCounter == productLength && courseLength != 0
                      ? ''
                      : styles['cart-product-underline']
                  }`}
                />
              </div>
            )
          })}
          {/* 商品結束 */}
          {/* 課程開始 */}
          <div
            className={`${courseLength > 0 ? '' : 'd-none'} ${
              styles['title-check-group-course']
            }`}
          >
            <label className={`${styles['custom-checkbox']}`}>
              <input
                type="checkbox"
                checked={checkedAllCourse}
                onChange={(e) => {
                  setCheckedAllCourse(e.currentTarget.checked)
                  setCheckedAllCourse2(e.currentTarget.checked)
                }}
              />
              <span className={`${styles['checkmark']}`} />
            </label>{' '}
            <p className={`${styles['class-title']}`}>
              MR.BEAN 課程 ({courseLength})
            </p>
          </div>
          <div
            className={`${
              courseLength > 0 ? styles['cart-product-topline'] : 'd-none'
            }`}
          />
          {courseItems(cart).map((item) => {
            const dateStartRender = new Date(
              item.course_date_start.split('T')[0]
            )
            const dateStart = `${dateStartRender.getFullYear()}/${
              dateStartRender.getMonth() + 1
            }/${dateStartRender.getDate() + 1}`

            const dateEndRender = new Date(item.course_date_end.split('T')[0])
            const dateEnd = `${dateEndRender.getFullYear()}/${
              dateEndRender.getMonth() + 1
            }/${dateEndRender.getDate() + 1}`

            return (
              <div key={item.item_id} className={`${styles['cart-product']}`}>
                <div className={`${styles['cart-class-info']}`}>
                  <label className={`${styles['custom-checkbox']}`}>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {
                        chekboxToggle(cart, item.item_id, item.item_type)
                      }}
                    />
                    <span className={`${styles['checkmark']}`} />
                  </label>
                  <div>
                    <Image
                      src={`/course-img/${item.course_img}`}
                      width={151}
                      height={151}
                      alt={item.course_name}
                    />
                  </div>
                  <div className={`${styles['info-col']}`}>
                    <div className={`${styles['cart-product-title-group']}`}>
                      <Link
                        href={`/course/${item.course_category_id}/${item.course_id}`}
                        className={`${styles['cart-product-title']}`}
                      >
                        {item.course_name}
                      </Link>
                      <i
                        className={`bi bi-trash3 ${styles['bi-trash3']}`}
                        role="presentation"
                        onClick={() => {
                          removeItem(
                            cart,
                            item.item_id,
                            item.item_type,
                            item.course_name
                          )
                        }}
                      />
                    </div>
                    <p className={`${styles['specification']}`}>
                      {item.course_location}&nbsp; |&nbsp;{' '}
                      {`${dateStart}${
                        dateEnd == dateStart ? '' : ` ~ ${dateEnd}`
                      }`}
                    </p>
                    <p className={`${styles['specification-m']}`}>
                      {item.course_location}&nbsp; |&nbsp;
                      <br /> {`${dateStart} ~ ${dateEnd}`}
                    </p>
                    <div className={`${styles['cart-class-price-group']}`}>
                      <div className={`${styles['cart-price-group']}`}>
                        <p className={`${styles['cart-prev-price']}`}>
                          NT$ {handleThousand(item.course_origin_price)}
                        </p>
                        <p className={`${styles['cart-price']}`}>
                          NT$ {handleThousand(item.course_price)}
                        </p>
                      </div>
                    </div>
                    <div className={`${styles['cart-price-group-m']}`}>
                      <p className={`${styles['cart-prev-price-m']}`}>
                        NT$ {handleThousand(item.course_origin_price)}
                      </p>
                      <p className={`${styles['cart-price-m']}`}>
                        NT$ {handleThousand(item.course_price)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`${styles['cart-product-underline']}`} />
              </div>
            )
          })}
          {/* 課程結束 */}
          {/* 小計開始 */}
          <section className={`${styles['cart-total']}`}>
            <div className={`${styles['calc-group']}`}>
              <div className={`${styles['cart-count']}`}>
                <p>商品數量</p>
                {/* 修改 */}
                <p>{totalItems(checkedCart)}</p>
              </div>
              <div className={`${styles['line']}`} />
              <div className={`${styles['cart-price']}`}>
                <p>小計</p>
                <p className={`${styles['subtotal']}`}>
                  {/* 修改 */}
                  NT$
                  {subTotalPrice(checkedCart)}
                </p>
              </div>
            </div>
            {checkedCart.length > 0 ? (
              <a
                href="/cart/confirm"
                className={`${styles['cart-confirm']}`}
                onClick={() => {
                  loader.current.classList.remove('d-none')
                  document.body.style.overflow = 'hidden'
                }}
              >
                前往結帳
              </a>
            ) : (
              <div className={styles['cart-confirm-none']}>前往結帳</div>
            )}
            {/*  */}
          </section>
        </div>
      </section>

      {/* 購物車結束 */}
      <Toaster
        toastOptions={{
          iconTheme: {
            primary: '#003e52',
          },
          position: 'bottom-right',
          duration: 2000,
          success: {
            style: {
              border: '1.5px solid #003e52',
              borderRadius: '0',
            },
          },
        }}
      />
    </>
  )
}
