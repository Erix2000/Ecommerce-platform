import { useEffect, useState } from 'react'
import styles from '@/styles/member-center.module.scss'

export default function CouponStatusSelector({
  couponListStatus = undefined,
  setCouponListStatus = () => {},
}) {
  const [selectorTitle, setSelectorTitle] = useState('所有優惠券')
  const [showStatusList, setShowStatusList] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  useEffect(() => {
    window.addEventListener('resize', () => {
      setShowStatusList(window.innerWidth > 992)
      setShowStatus(window.innerWidth <= 992)
    })
    return window.removeEventListener('resize', () => {
      setShowStatusList(window.innerWidth > 992)
      setShowStatus(window.innerWidth <= 992)
    })
  })
  useEffect(() => {
    if (window.innerWidth <= 992) {
      setShowStatus(true)
      setShowStatusList(false)
    } else {
      setShowStatus(false)
      setShowStatusList(true)
    }
  }, [])

  return (
    <>
      <div className={styles['coupon-status-area']}>
        {showStatus && (
          <div
            className={styles['coupon-status']}
            onClick={() => {
              setShowStatusList(!showStatusList)
            }}
          >
            <div className={styles['status-indicator']}>{selectorTitle}</div>
            <i className="bi bi-caret-down-fill"></i>
          </div>
        )}
        {showStatusList && (
          <ul className={styles['coupon-status-selector']}>
            <li
              className={couponListStatus === 0 ? 'skin' : 'indigo'}
              onClick={() => {
                setCouponListStatus(0)
                setSelectorTitle('全部優惠券')
                if (window.innerWidth <= 992) {
                  setShowStatusList(false)
                }
              }}
            >
              全部優惠券
            </li>
            <li
              className={couponListStatus === 1 ? 'skin' : 'indigo'}
              onClick={() => {
                setCouponListStatus(1)
                setSelectorTitle('可使用')
                if (window.innerWidth <= 992) {
                  setShowStatusList(false)
                }
              }}
            >
              可使用
            </li>
            <li
              className={couponListStatus === 2 ? 'skin' : 'indigo'}
              onClick={() => {
                setCouponListStatus(2)
                setSelectorTitle('未領取')
                if (window.innerWidth <= 992) {
                  setShowStatusList(false)
                }
              }}
            >
              未領取
            </li>
            <li
              className={couponListStatus === 3 ? 'skin' : 'indigo'}
              onClick={() => {
                setCouponListStatus(3)
                setSelectorTitle('可兌換')
                if (window.innerWidth < 992) {
                  setShowStatusList(false)
                }
              }}
            >
              可兌換
            </li>
            <li
              className={couponListStatus === 4 ? 'skin' : 'indigo'}
              onClick={() => {
                setCouponListStatus(4)
                setSelectorTitle('已失效')
                if (window.innerWidth < 992) {
                  setShowStatusList(false)
                }
              }}
            >
              已失效
            </li>
          </ul>
        )}
      </div>
      <style jsx>{`
        .indigo {
          color: #003e52;
          cursor: pointer;
        }
        .skin {
          color: #bc955c;
          cursor: pointer;
        }
        @media screen and (max-width: 1200px) {
          .indigo {
            color: #fff;
          }
          .skin {
            color: #bc955c;
          }
        }
      `}</style>
    </>
  )
}
