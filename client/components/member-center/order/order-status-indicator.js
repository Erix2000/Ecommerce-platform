import React from 'react'

export default function OrderStatusIndicator({ dateData = {} }) {
  const {
    created_at,
    canceled_at,
    posted_at,
    arrived_at,
    finished_at,
    returned_at,
    formatted_created_at,
    formatted_canceled_at,
    formatted_posted_at,
    formatted_arrived_at,
    formatted_finished_at,
    formatted_returned_at,
  } = dateData
  let color1 = 'gray'
  let color2 = 'gray'
  let color3 = 'gray'
  let statusPhase1 = ''
  let statusPhase2 = ''
  let statusPhase3 = ''
  let statusDate1 = ''
  let statusDate2 = ''
  let statusDate3 = ''
  // 第一區塊
  if (canceled_at) {
    //   有取消日期顯示綠色
    color1 = 'indigo'
    statusPhase1 = '取消'
    statusDate1 = formatted_canceled_at
  } else if (posted_at) {
    //   有出貨日期顯示金色
    color1 = 'skin'
    statusPhase1 = '出貨'
    statusDate1 = formatted_posted_at
  } else {
    //   都沒有則顯示灰色
    color1 = 'gray'
    statusPhase1 = '成立'
    statusDate1 = formatted_created_at
  }
  // 第二區塊

  if (arrived_at) {
    //   有送達日期顯示金色
    color2 = 'skin'
    statusPhase2 = '送達'
    statusDate2 = formatted_arrived_at
  }
  // 第三區塊
  if (returned_at) {
    color3 = 'indigo'
    statusPhase3 = '退貨'
    statusDate3 = formatted_returned_at
  } else if (!returned_at && finished_at) {
    color3 = 'skin'
    statusPhase3 = '完成'
    statusDate3 = formatted_finished_at
  }
  //   有退貨日期顯示綠色
  //   沒有退貨日期且有完成日期顯示金色
  return (
    <>
      <div className="status-indicator-list col-11 m-auto">
        <div className="gap-lg-1 col-4 status-indicator-container">
          <div
            className={`status-indicator status-indicator-1 ${color1}`}
          ></div>
          <div className="status-phase">{statusPhase1}</div>
          <div className="status-date">{statusDate1}</div>
        </div>
        <div className="gap-lg-1 col-4 status-indicator-container">
          <div
            className={`status-indicator status-indicator-2 ${color2}`}
          ></div>
          <div className="status-phase">{statusPhase2}</div>
          <div className="status-date">{statusDate2}</div>
        </div>
        <div className="gap-lg-1 col-4 status-indicator-container">
          <div
            className={`status-indicator status-indicator-3 ${color3}`}
          ></div>
          <div className="status-phase">{statusPhase3}</div>
          <div className="status-date">{statusDate3}</div>
        </div>
      </div>
      <style jsx>
        {`
           {
            /* 顏色模組 */
          }
          .gray {
            background-color: #d9d9d9;
          }
          .indigo {
            background-color: #003e52;
          }
          .skin {
            background-color: #bc955c;
          }
          .status-indicator-list {
            display: flex;
            justify-content: center;
          }
          .status-indicator-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 3px;
          }
          .status-indicator {
            width: 100%;
            padding-inline: 3px;
            height: 12px;
          }
          .status-indicator-1 {
            border-radius: 6px 0 0 6px;
          }
          .status-indicator-3 {
            border-radius: 0 6px 6px 0;
          }
          @media screen and (max-width: 992px) {
            .status-indicator-list {
              font-size: 12px;
            }
            .status-indicator {
              height: 6px;
            }
          }
        `}
      </style>
    </>
  )
}
