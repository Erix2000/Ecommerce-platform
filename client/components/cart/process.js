import React from 'react'
import styles from '@/components/cart/cart-modules/process.module.scss'
export default function Process(props) {
  return (
    <>
      {/* 流程圖示開始 */}
      <section className={`container ${styles['process']}`}>
        <div className={`${styles['process-step']}`}>
          <div className={`${styles['process-circle']}`}>
            <p className={`${styles['step-num']}`}>1</p>
          </div>
          <p className={`${styles['step-title']}`}>購物車資訊</p>
        </div>
        <div
          className={`${styles['process-line']} ${
            props.step >= 2 ? '' : styles['not-this-process']
          }`}
        />
        <i className={`bi bi-chevron-right ${styles['process-iconM']}`} />
        <div className={`${styles['process-step']}`}>
          <div
            className={`${styles['process-circle']} ${
              props.step >= 2 ? '' : styles['not-this-process']
            }`}
          >
            <p className={`${styles['step-num']}`}>2</p>
          </div>
          <p className={`${styles['step-title']}`}>確認及填寫</p>
        </div>
        <div
          className={`${styles['process-line']} ${
            props.step >= 3 ? '' : styles['not-this-process']
          }`}
        />
        <i className={`bi bi-chevron-right ${styles['process-iconM']}`} />
        <div className={`${styles['process-step']}`}>
          <div
            className={`${styles['process-circle']} ${
              props.step >= 3 ? '' : styles['not-this-process']
            }`}
          >
            <p className={`${styles['step-num']}`}>3</p>
          </div>
          <p className={`${styles['step-title']}`}>訂單成立</p>
        </div>
      </section>
      {/* 流程圖示結束 */}
    </>
  )
}
