import React, { useState, useRef, useEffect } from 'react'
import styles from '@/components/cart/cart-modules/step2.module.scss'
import Process from './process'
import Image from 'next/image'
import { useCart } from '@/hooks/use-cart'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/use-auth'

export default function Step2() {
  //state
  const {
    productItems,
    courseItems,
    handleThousand,
    subTotalPrice,
    totalPrice,
    checkedCart,
    cart,
  } = useCart()
  const router = useRouter()
  const { auth } = useAuth()
  const [token, setToken] = useState('')
  const [userCoupon, setUserCoupon] = useState([])
  const [userPoints, setUserPoints] = useState(0)
  const [total, setTotal] = useState(0)
  const [usedPointValue, setusedPointValue] = useState(0)
  const [coupon, setCoupon] = useState({})
  const [driving, setDriving] = useState('')
  const [logisticsCVS, setCVS] = useState('')
  const [storageInfo, setStorageInfo] = useState({
    logisticsCVS: '',
    payment: '',
    driving: '',
    userInfo: '',
    address: '',
    remark: '',
  })
  const [csvAddress, setCsvAddress] = useState('')
  const [user, setUser] = useState({
    status: '',
    user: {
      user_name: '',
      user_tel: '',
      delivery_address: '',
    },
  })
  const [counter, setCounter] = useState(0)

  //Ref
  const loader = useRef(null)
  const CVSlogistic = useRef(null)
  const form = useRef(null)
  const couponUsed = useRef(null)
  const clickCoupon = useRef(null)
  const driveRef = useRef(null)
  const payRef = useRef(null)
  const couponPop = useRef(null)
  const [checked, setChecked] = useState(false)
  const [userInfo, setUserinfo] = useState({
    name: '',
    phone: '',
    address: '',
  })
  const getUserCoupon = async (token) => {
    const coupon = await fetch('http://localhost:3005/cart/confirm/coupon', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json()
      })
      .then((result) => {
        return result
      })
      .catch((err) => {
        console.log(err)
        return false
      })
    setUserCoupon(coupon)
  }
  const getUserPoints = async (token) => {
    const points = await fetch('http://localhost:3005/cart/confirm/points', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json()
      })
      .then((result) => {
        return result.total_points
      })
      .catch((err) => {
        console.log(err)
        return false
      })
    setUserPoints(points)
  }

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
  useEffect(() => {
    if (auth.isAuth) {
      const token = localStorage.getItem('accessToken')
      setToken(localStorage.getItem('accessToken'))
      getUser(token)

      getUserCoupon(token)
      getUserPoints(token)
    }
  }, [auth])
  useEffect(() => {
    setTotal(
      totalPrice(checkedCart) >= 1000
        ? totalPrice(checkedCart) -
            (coupon.coupon_discount ? coupon.coupon_discount : 0)
        : totalPrice(checkedCart) +
            60 -
            (coupon.coupon_discount ? coupon.coupon_discount : 0)
    )
  }, [coupon, usedPointValue])

  useEffect(() => {
    if (counter > 1) {
      setUserinfo({ ...userInfo, address: '' })
      setCsvAddress('')
    }
    setCounter(counter + 1)
    console.log(counter)
  }, [logisticsCVS])
  useEffect(() => {
    if (driving != '超商取貨') {
      setUserinfo({ ...userInfo, address: '' })
    } else {
      setUserinfo({ ...userInfo, address: csvAddress })
    }
  }, [driving])
  useEffect(() => {
    if (checked && driving != '超商取貨') {
      setUserinfo({
        name: user.user.user_name,
        phone: user.user.user_tel,
        address: user.user.delivery_address,
      })
    } else if (checked && driving === '超商取貨') {
      setUserinfo({
        name: user.user.user_name,
        phone: user.user.user_tel,
      })
    } else if (!checked && driving === '超商取貨') {
      setUserinfo({
        name: '',
        phone: '',
      })
    } else {
      setUserinfo({ name: '', phone: '', address: '' })
    }
  }, [checked, user])
  useEffect(() => {
    if (!localStorage.getItem('info')) {
      localStorage.setItem('info', JSON.stringify(storageInfo))
    } else {
      const info = JSON.parse(localStorage.getItem('info'))

      setUserinfo({
        name: info.userInfo.name,
        phone: info.userInfo.phone,
        address: info.userInfo.address,
      })
      setPayment(info.payment)
      setDriving(info.driving)
      setCVS(info.logisticsCVS)

      setChecked(info.checked)
      setRemark(info.remark)
    }
  }, [])

  useEffect(() => {
    if (window.location.search) {
      const urlParams = new URLSearchParams(window.location.search).get(
        'logistics'
      )
      setCsvAddress(urlParams)

      setUserinfo((prevUserInfo) => ({
        ...prevUserInfo,
        address: urlParams,
      }))
    }
  }, [router.isReady, user, checked])

  const [payment, setPayment] = useState('')
  const [remark, setRemark] = useState('')

  //刪除已購買物品
  const deleteCart = (cart, checkedCart) => {
    const filterCart = cart.filter((item) => {
      return !checkedCart.includes(item)
    })
    localStorage.setItem('cart', JSON.stringify(filterCart))
  }

  useEffect(() => {
    localStorage.setItem('info', JSON.stringify(storageInfo))
  }, [storageInfo])
  useEffect(() => {
    setStorageInfo({
      payment,
      driving,
      userInfo,
      remark,
      logisticsCVS,
      checked,
    })
  }, [payment, driving, userInfo, remark, logisticsCVS, checked])

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
      <main
        className={`main-container container`}
        role="presentation"
        onClick={(e) => {
          if (
            !driveRef.current.contains(e.target) &&
            !payRef.current.contains(e.target) &&
            !CVSlogistic.current.contains(e.target)
          ) {
            driveRef.current.nextElementSibling.style.display = 'none'
            payRef.current.nextElementSibling.style.display = 'none'
            CVSlogistic.current.nextElementSibling.style.display = 'none'
          }
        }}
      >
        <Process step={2} />

        <form ref={form} method="post">
          <section className={`container ${styles['cart-product-section']}`}>
            <div className={`row ${styles['cart-product-title']}`}>
              <div className="col-5">產品明細</div>
              <div className="col-2  text-center d-none d-lg-block">規格</div>
              <div className="col-2 text-center d-none d-lg-block">單價</div>
              <div className="col-1 text-center d-none d-lg-block">數量</div>
              <div className="col-2 text-end d-none d-lg-block">小計</div>
              <div className={`${styles['line']}`} />
            </div>
            {/* 產品開始 */}
            {productItems(checkedCart).map((item) => {
              const img = item.product_img.split(',')[0]

              const folderPosition = item.product_code.slice(0, 2)
              return (
                <div
                  key={item.product_id}
                  className={`row ${styles['cart-product-info']}`}
                >
                  <div className="col-1">
                    <Image
                      src={`/product-img/product/${folderPosition}/pro/${img}`}
                      width={80}
                      height={80}
                      alt={item.product_name}
                    />
                  </div>
                  <div className={`col-4`}>{item.product_name}</div>
                  <div className="col-2 text-center">{item.product_spec}</div>
                  <div className="col-2 text-center">
                    NT$ {handleThousand(item.product_price)}
                  </div>
                  <div className="col-1 text-center">{item.quantity}</div>
                  <div className={`col-2 text-end ${styles['subtotal']}`}>
                    NT$ {handleThousand(item.product_price * item.quantity)}
                  </div>
                  <div className={`${styles['underline']}`} />
                </div>
              )
            })}
            {/* 產品結束 */}
            {/* 課程開始 */}
            {courseItems(checkedCart).map((item) => {
              return (
                <div
                  key={item.course_id}
                  className={`row ${styles['cart-product-info']}`}
                >
                  <div className={`col-1 ${styles['img-container']}`}>
                    <Image
                      src={`/course-img/${item.course_img}`}
                      width={80}
                      height={80}
                      alt={item.course_name}
                    />
                  </div>
                  <div
                    className={`col-4`}
                  >{`${item.course_name}(${item.course_location})`}</div>
                  <div className="col-2 text-center">{`-`}</div>
                  <div className="col-2 text-center">
                    NT$ {handleThousand(item.course_price)}
                  </div>
                  <div className="col-1 text-center">{item.quantity}</div>
                  <div className={`col-2 text-end ${styles['subtotal']}`}>
                    NT$ {item.course_price * item.quantity}
                  </div>
                  <div className={`${styles['underline']}`} />
                </div>
              )
            })}
            {/* 課程結束 */}
          </section>
          {/* 手機版產品＋課程  開始*/}
          <section className={`${styles['cart-product-section-m']}`}>
            <div className={`${styles['cart-product-title']}`}>產品明細</div>
            <div className={`${styles['line']}`} />
            {productItems(checkedCart).map((item) => {
              const img = item.product_img.split(',')[0]

              const folderPosition = item.product_code.slice(0, 2)

              return (
                <div key={item.item_id}>
                  <div className={`${styles['cart-product-info']}`}>
                    <div>
                      <Image
                        src={`/product-img/product/${folderPosition}/pro/${img}`}
                        width={80}
                        height={80}
                        alt={item.product_name}
                      />
                    </div>
                    <div className={`${styles['info-group']}`}>
                      <div className={`${styles['cart-product-left']}`}>
                        <div className={styles['title']}>
                          {item.product_name}
                        </div>
                        <div>{item.product_spec}</div>
                      </div>

                      <div className={`${styles['cart-product-right']}`}>
                        <div className="text-end">x{item.quantity}</div>
                        <div className={styles['price']}>
                          NT$ {item.product_price}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles['underline']}`} />
                </div>
              )
            })}
            {courseItems(checkedCart).map((item) => {
              return (
                <div key={item.item_id}>
                  <div className={`${styles['cart-product-info']}`}>
                    <div className={styles['img-container']}>
                      <Image
                        src={`/course-img/${item.course_img}`}
                        width={80}
                        height={80}
                        alt={item.course_name}
                      />
                    </div>
                    <div className={`${styles['info-group']}`}>
                      <div className={`${styles['cart-product-left']}`}>
                        <div className={styles['title']}>
                          {item.course_name}({item.course_location})
                        </div>
                        <div></div>
                      </div>

                      <div className={`${styles['cart-product-right']}`}>
                        <div className="text-end">x{item.quantity}</div>
                        <div className={styles['price']}>
                          NT$ {item.course_price}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles['underline']}`} />
                </div>
              )
            })}
          </section>

          {/* 手機版產品＋課程結束 */}
          {/* 配送方式、付款方式開始 */}
          <section
            className={`container ${styles['product-method-group']} ${styles['container']}`}
          >
            <div className={`row`}>
              <div className={`col-1 col-lg-4 ${styles['method-select']}`}>
                <div className={`${styles['method-title']}`}>支付方式</div>
                <div className={`mb-5 ${styles['custom-select-sub']}`}>
                  <div
                    className={`d-flex justify-content-between ${styles['selected-sub']}`}
                    id="select2"
                    ref={payRef}
                    role="presentation"
                    onClick={(e) => {
                      const options = e.currentTarget.nextElementSibling
                      options.style.display =
                        options.style.display === 'block' ? 'none' : 'block'
                    }}
                  >
                    <div>{payment === '' ? `請選擇支付方式` : payment}</div>
                    <i className="bi bi-chevron-down"></i>
                  </div>
                  <div className={`${styles['custom-options-sub']}`}>
                    <input
                      type="text"
                      className={`d-none`}
                      name="payMthod"
                      defaultValue={payment}
                    />
                    <div
                      className={`${styles['custom-option-sub']}`}
                      data-value="綠界科技ECPay(全方位)"
                      role="presentation"
                      onClick={(e) => {
                        payRef.current.nextElementSibling.style.display = 'none'
                        setPayment(e.currentTarget.getAttribute('data-value'))
                      }}
                    >
                      綠界科技ECPay(全方位)
                    </div>
                    <div
                      className={`${styles['custom-option-sub']}`}
                      data-value="LinePay"
                      role="presentation"
                      onClick={(e) => {
                        payRef.current.nextElementSibling.style.display = 'none'
                        setPayment(e.currentTarget.getAttribute('data-value'))
                      }}
                    >
                      LinePay
                    </div>
                    <div
                      className={`${styles['custom-option-sub']}`}
                      data-value="貨到付款"
                      role="presentation"
                      onClick={(e) => {
                        payRef.current.nextElementSibling.style.display = 'none'
                        setPayment(e.currentTarget.getAttribute('data-value'))
                      }}
                    >
                      貨到付款
                    </div>
                  </div>
                </div>
                <div className={`${styles['method-title']}`}>運送方式</div>
                <div className={`${styles['custom-select']}`}>
                  <input
                    type="text"
                    className={`d-none`}
                    name="drivingMethod"
                    value={driving}
                    onChange={() => {}}
                  />
                  <div
                    className={`d-flex justify-content-between ${styles['selected']}`}
                    id="select1"
                    role="presentation"
                    ref={driveRef}
                    onClick={(e) => {
                      const options = e.currentTarget.nextElementSibling

                      options.style.display =
                        options.style.display === 'block' ? 'none' : 'block'
                    }}
                  >
                    <div>{driving === '' ? '選擇運送方式' : driving}</div>
                    <i className="bi bi-chevron-down"></i>
                  </div>
                  <div className={`${styles['custom-options']}`}>
                    <div
                      className={`${styles['custom-option']}`}
                      role="presentation"
                      data-value="宅配到府"
                      onClick={(e) => {
                        driveRef.current.nextElementSibling.style.display =
                          'none'

                        setDriving(e.currentTarget.getAttribute('data-value'))
                      }}
                    >
                      宅配到府
                    </div>
                    <div
                      className={`${styles['custom-option']}`}
                      role="presentation"
                      data-value="超商取貨"
                      onClick={(e) => {
                        driveRef.current.nextElementSibling.style.display =
                          'none'

                        setDriving(e.currentTarget.getAttribute('data-value'))
                      }}
                    >
                      超商取貨
                    </div>
                  </div>
                </div>
                <div
                  className={`${styles['custom-select']} ${
                    driving === '超商取貨' ? '' : 'd-none'
                  }`}
                >
                  <input
                    type="text"
                    className={`d-none`}
                    name="CVSshop"
                    defaultValue={logisticsCVS}
                    onChange={() => {}}
                  />
                  <div
                    className={`d-flex justify-content-between ${styles['selected']} ${styles['selected2']}`}
                    id="select1"
                    role="presentation"
                    ref={CVSlogistic}
                    onClick={(e) => {
                      const options = e.currentTarget.nextElementSibling

                      options.style.display =
                        options.style.display === 'block' ? 'none' : 'block'
                    }}
                  >
                    <div>{logisticsCVS == '' ? '選擇超商' : logisticsCVS}</div>
                    <i className="bi bi-chevron-down"></i>
                  </div>
                  <div className={`${styles['custom-options']}`}>
                    <div
                      className={`${styles['custom-option']}`}
                      role="presentation"
                      data-value="7-ELEVEN"
                      onClick={(e) => {
                        CVSlogistic.current.nextElementSibling.style.display =
                          'none'

                        setCVS(e.currentTarget.getAttribute('data-value'))
                      }}
                    >
                      7-ELEVEN
                    </div>
                    <div
                      className={`${styles['custom-option']}`}
                      role="presentation"
                      data-value="全家便利商店"
                      onClick={(e) => {
                        CVSlogistic.current.nextElementSibling.style.display =
                          'none'

                        setCVS(e.currentTarget.getAttribute('data-value'))
                      }}
                    >
                      全家便利商店
                    </div>
                    <div
                      className={`${styles['custom-option']}`}
                      role="presentation"
                      data-value="萊爾富"
                      onClick={(e) => {
                        CVSlogistic.current.nextElementSibling.style.display =
                          'none'

                        setCVS(e.currentTarget.getAttribute('data-value'))
                      }}
                    >
                      萊爾富
                    </div>
                    <div
                      className={`${styles['custom-option']}`}
                      role="presentation"
                      data-value="OK便利商店"
                      onClick={(e) => {
                        CVSlogistic.current.nextElementSibling.style.display =
                          'none'

                        setCVS(e.currentTarget.getAttribute('data-value'))
                      }}
                    >
                      OK便利商店
                    </div>
                  </div>
                </div>
              </div>
              <div className={`col-12 col-lg-8`}>
                {/* 收件人資訊開始 */}
                <div className={`${styles['custom-info-section']}`}>
                  <div className={`${styles['info-title']}`}>收件人資訊</div>
                  <div className={`${styles['info']}`}>
                    <div className={`${styles['info-input']}`}>
                      <p>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名 :</p>
                      <input
                        name="userName"
                        type="text"
                        placeholder="請填入姓名"
                        className={styles['myInput']}
                        value={userInfo.name}
                        onChange={(e) => {
                          setUserinfo({
                            ...userInfo,
                            name: e.currentTarget.value,
                          })
                        }}
                      />
                    </div>

                    <div className={`${styles['info-input']}`}>
                      <p>聯絡電話 :</p>
                      <input
                        name="phone"
                        type="text"
                        placeholder="請填入手機號碼"
                        className={styles['myInput']}
                        value={userInfo.phone}
                        onChange={(e) => {
                          setUserinfo({
                            ...userInfo,
                            phone: e.currentTarget.value,
                          })
                        }}
                      />
                    </div>
                    <div className={`${styles['info-input']}`}>
                      <p>{driving == '超商取貨' ? '超商地址' : '宅配地址'} :</p>
                      <input
                        name="address"
                        type="text"
                        className="d-none"
                        defaultValue={userInfo.address}
                      />
                      <input
                        disabled={driving === '超商取貨' ? true : false}
                        type="text"
                        placeholder={
                          driving == '超商取貨'
                            ? '請選擇超商'
                            : '請填入宅配地址'
                        }
                        className={`${styles['myInput']} ${
                          driving != '超商取貨' ||
                          logisticsCVS === '' ||
                          csvAddress != ''
                            ? ''
                            : 'd-none'
                        } `}
                        value={userInfo.address}
                        onChange={(e) => {
                          setUserinfo({
                            ...userInfo,
                            address: e.currentTarget.value,
                          })
                        }}
                      />
                      <a
                        className={`${
                          driving != '超商取貨' ||
                          logisticsCVS === '' ||
                          csvAddress != ''
                            ? 'd-none'
                            : ''
                        } ${styles['selectCVS']}`}
                        href={`http://localhost:3005/cart/confirm/logistics?LogisticsSubType=${
                          logisticsCVS === '7-ELEVEN'
                            ? 'UNIMARTC2C'
                            : logisticsCVS === '全家便利商店'
                            ? 'FAMIC2C'
                            : logisticsCVS === '萊爾富'
                            ? 'HILIFEC2C'
                            : logisticsCVS === 'OK便利商店'
                            ? 'OKMARTC2C'
                            : ''
                        }`}
                      >
                        選擇超商取貨地址
                      </a>
                    </div>
                    <label className={`${styles['custom-checkbox']}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          setChecked(e.target.checked)
                        }}
                      />
                      <span className={`${styles['checkmark']}`} />
                      &nbsp;&nbsp;使用會員資料一鍵填入
                    </label>
                  </div>
                </div>
                {/* 收件人資訊結束 */}
              </div>
              <div className={`col-12 ${styles['remark-title']}`}>備註</div>
              <textarea
                className={`col-12 ${styles['remark']}`}
                name="remark"
                value={remark}
                onChange={(e) => {
                  setRemark(e.currentTarget.value)
                }}
              />
            </div>
            <div className="d-none">
              {/* 隱藏input */}
              <input
                name="cartItem"
                defaultValue={JSON.stringify(checkedCart)}
              />

              <input name="payment" defaultValue={payment} />
              <input name="driving" defaultValue={driving} />
              <input name="points" defaultValue={usedPointValue} />
              <input name="originPoints" defaultValue={userPoints} />
              <input
                name="coupon"
                defaultValue={JSON.stringify({
                  discount: coupon.coupon_discount ? coupon.coupon_discount : 0,
                  id: coupon.coupon_id,
                })}
              />
            </div>
          </section>
          {/* 配送方式、付款方式結束 */}
          {/* 優惠券開始 */}
          {/* 優惠券pop-up視窗開始 */}
          <section
            className={`d-none ${styles['coupon-pop-up']}`}
            role="presentation"
            ref={couponPop}
            onClick={(e) => {
              e.currentTarget.classList.add('d-none')
            }}
          >
            <div
              className={`${styles['coupon-select']}`}
              role="presentation"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <div
                className={`d-flex justify-content-between ${styles['title-group']}`}
              >
                <p className={`${styles['title']}`}>請選擇優惠券</p>
                <div>
                  <i
                    role="presentation"
                    className={`bi bi-x-lg ${styles['bi-x-lg']}`}
                    onClick={() => {
                      couponPop.current.classList.add('d-none')
                    }}
                  />
                </div>
              </div>
              <div className={`row ${styles['row']}`} id="coupon-select">
                {userCoupon.map((coupon) => {
                  return (
                    <div
                      key={coupon.coupon_id}
                      className={`col-sm-5 d-flex ${styles['coupon-card']} `}
                      role="presentation"
                      onClick={() => {
                        setCoupon(coupon)
                        clickCoupon.current.textContent = coupon.coupon_name
                        clickCoupon.current.classList.add(
                          `${styles['coupon-choose-used']}`
                        )
                        couponUsed.current.classList.remove('d-none')
                        couponPop.current.classList.add('d-none')
                      }}
                    >
                      <div
                        className={
                          totalPrice(checkedCart) < coupon.coupon_threshold
                            ? styles['coupon-card-none']
                            : 'd-none'
                        }
                        role="presentation"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      ></div>
                      <div className={styles['image-cover']}>
                        <Image
                          src={`/coupon-img/${coupon.coupon_img}`}
                          alt={coupon.coupon_name}
                          width={188}
                          height={188}
                        />
                      </div>
                      <div className={`${styles['coupon-group']}`}>
                        <p
                          className={`${styles['coupon-title']} ${
                            totalPrice(checkedCart) < coupon.coupon_threshold
                              ? styles['not-pass-threshold']
                              : ''
                          }`}
                        >
                          {coupon.coupon_name}
                        </p>
                        <p
                          className={`${styles['coupon-price']} ${
                            totalPrice(checkedCart) < coupon.coupon_threshold
                              ? styles['not-pass-threshold']
                              : ''
                          }`}
                        >
                          NT$ {coupon.coupon_discount}
                        </p>
                        <p className={`${styles['coupon-intro']}`}>
                          {totalPrice(checkedCart) < coupon.coupon_threshold ? (
                            `再消費 ${Math.abs(
                              totalPrice(checkedCart) - coupon.coupon_threshold
                            )} 元可折${coupon.coupon_discount}元`
                          ) : (
                            <span style={{ color: 'grey' }}>
                              {coupon.coupon_intro}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
          {/* new pop */}
          {/* new pop end  */}
          {/* 優惠券pop-up視窗結束 */}
          <section
            className={`d-flex justify-content-between align-items-center container ${styles['product-coupon']} ${styles['container']}`}
            id="coupon"
            role="presentation"
            onClick={() => {
              couponPop.current.classList.remove('d-none')
            }}
          >
            <div className={`${styles['coupon-title']}`}>
              優惠券
              <span
                className={`d-none ${styles['coupon-used']}`}
                ref={couponUsed}
              >
                (已使用)
              </span>
            </div>
            <div className={`${styles['coupon-choose']}`} ref={clickCoupon}>
              點擊選擇優惠卷
            </div>
          </section>
          {/* 優惠券結束 */}
          {/* 點數開始 */}
          <section
            className={`d-flex justify-content-between align-items-center ${styles['product-point']} ${styles['container']}`}
          >
            <div className={`${styles['point-title']}`}>
              剩餘點數 :{' '}
              <span className={`${styles['bolder']}`}>
                {userPoints - usedPointValue} 點
              </span>
            </div>

            <input
              className={`${styles['point-input']} ${styles['myInput']}`}
              placeholder="請填入點數"
              value={usedPointValue ? usedPointValue : ''}
              onChange={(e) => {
                if (!isNaN(e.target.value)) {
                  setusedPointValue(Math.min(e.target.value, userPoints, total))
                }
              }}
            />
          </section>
          {/* 點數結束 */}
          {/* 總計開始 */}
          <section className={`container ${styles['product-total-group']} `}>
            <div className={`${styles['product-total-box']}`}>
              <div className={`${styles['total']} ${styles['item-container']}`}>
                <p className={`${styles['total-title']}`}>小計</p>
                <p className={`${styles['total-price']}`}>
                  NT$ {subTotalPrice(checkedCart)}
                </p>
              </div>

              <div
                className={`${coupon.coupon_discount ? '' : 'd-none'} ${
                  styles['total']
                } ${styles['item-container']}`}
              >
                <p className={`${styles['total-title']}`}>優惠券折抵</p>
                <p className={`${styles['total-price']}`}>
                  - NT$ {coupon.coupon_discount ? coupon.coupon_discount : 0}
                </p>
              </div>
              <div
                className={`${usedPointValue ? '' : 'd-none'} ${
                  styles['total']
                } ${styles['item-container']}`}
              >
                <p className={`${styles['total-title']}`}>點數折抵</p>
                <p className={`${styles['total-price']}`}>
                  - NT$ {usedPointValue ? usedPointValue : 0}
                </p>
              </div>
              <div
                className={`${styles['freight']} ${styles['item-container']}`}
              >
                <p className={`${styles['freight-title']}`}>運費(滿千免運)</p>
                <p className={`${styles['freight-total']}`}>
                  NT$ {totalPrice(checkedCart) >= 1000 ? 0 : 60}
                </p>
              </div>
              <div className={`${styles['line']}`} />
              <div className={`${styles['sum']} ${styles['item-container']}`}>
                <p className={`${styles['sum-title']}`}>總金額</p>
                <p className={`${styles['sum-price']}`}>
                  NT${' '}
                  {totalPrice(checkedCart) >= 1000
                    ? totalPrice(checkedCart) -
                      usedPointValue -
                      (coupon.coupon_discount ? coupon.coupon_discount : 0)
                    : totalPrice(checkedCart) +
                      60 -
                      usedPointValue -
                      (coupon.coupon_discount ? coupon.coupon_discount : 0)}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className={styles['submit-button']}
              onClick={(e) => {
                if (checkedCart.length == 0) {
                  e.preventDefault()
                } else {
                  deleteCart(cart, checkedCart)
                  loader.current.classList.remove('d-none')
                  document.body.style.overflow = 'hidden'
                  const formData = new FormData(form.current)
                  fetch('http://localhost:3005/cart/confirm/payment', {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                  })
                    .then((response) => {
                      return response.json()
                    })
                    .then((result) => {
                      if (
                        result.status === 'success' &&
                        result.payment === 'LinePay' &&
                        result.orderId
                      ) {
                        window.location.href = `http://localhost:3005/cart/confirm/creat-linepay?orderId=${result.orderId}`
                      } else if (
                        result.status === 'success' &&
                        result.payment === '綠界科技ECPay(全方位)' &&
                        result.orderId
                      ) {
                        window.location.href = `http://localhost:3005/cart/confirm/ecpay?orderId=${result.orderId}`
                      } else {
                        window.location.href = `http://localhost:3000/cart/confirm/success?orderId=${result.orderId}`
                      }
                    })
                    .catch((err) => {
                      console.log(err)
                      alert('付款失敗')
                      return false
                    })
                }
              }}
            >
              前往付款
            </button>
          </section>
        </form>

        {/* 總計結束 */}
      </main>
    </>
  )
}
