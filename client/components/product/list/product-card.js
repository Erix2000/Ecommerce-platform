import React from 'react'
import styles from './product-list.module.scss'

export default function productCard() {
    return (
      <>
        <div className={`col-md-3 col-6`}>
            <div className={`pcard ${styles['pcard']}`}>
                <div type="button" className={`like ${styles['like']}`}>
                    <img src="/product-img/icon/strokes.svg" alt="" />
                </div>
                <a href="">
                    <img src="/product-img/product/1starbucks/pro/01010101.jpg" className="" alt="..." />
                </a>
                <div className={`card-body ${styles['card-body']}`}>
                    <div className={`pcard-title ${styles['pcard-title']}`}>星巴克家常咖啡豆</div>
                    <div className={`pcard-price ${styles['pcard-price']}`}>
                        NT$300&nbsp;
                        <span style={{ textDecoration: "line-through !important" }}>
                            NT$400
                        </span>
                    </div>
                    <a className={`add-cart link ${styles['add-cart']}`} href="">
                        加入購物車
                    </a>
                </div>
            </div>
        </div>
      </>
    )
}