import React from 'react'
import styles from './product-detail.module.scss'

export default function CommentCard({commentItem={}}) {
    console.log(commentItem)

    // 日期處理
    const isoDateString = commentItem.comment_created_at;
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}/${month}/${day}`;
    // console.log(formattedDate)

    // 名字處理
    let maskedName = commentItem.user_name.replace(/^(.).*/, "$1**");

    return (
      <>
      <div className={`${styles['product-comment']} row`}>
        <div className={`${styles['product-comment-header']} col-2`}>
            <img src="/avatar/9.png" alt="" />
        </div>
        <div className={`${styles['prodoct-comment-content']} col-10`}>
            <div className={`${styles['prodoct-comment-content-top']}`}>
                <div className={`${styles['client-name']}`}>
                    {maskedName}
                    <div className={`${styles['like']}`}>
                        {[...Array(commentItem.comment_star)].map((item,i) => (
                            <i key={i} className="bi bi-star-fill star" />
                        ))}
                    </div>
                </div>
                <div className={`${styles['date']}`}>{formattedDate}</div>
            </div>
            <div className={`${styles['date-m']}`}>{formattedDate}</div>
            <div className={`${styles['comment']}`}>
                {commentItem.comment_text}
            </div>
        </div>
      </div>
      </>
    )
}