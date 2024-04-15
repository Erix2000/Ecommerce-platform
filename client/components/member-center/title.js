import React from 'react'

export default function ContentTitle({ content = '' }) {
  return (
    <>
      <div className="main-content-title">{content}</div>
      <style jsx>{`
        .main-content-title {
          font-size: 32px;
          letter-spacing: 6px;
          padding-inline-start: 16px;
          border-inline-start: 5px solid #bc955c;
          color: #003e52;
          margin-bottom: 35px;
        }
        @media screen and (max-width: 992px) {
          .main-content-title {
            font-size: 1rem;
            font-weight: 900;
            letter-spacing: 2.7px;
            padding-inline-start: 8px;
            border-inline-start-width: 3px;
            margin: 10px;
          }
        }
      `}</style>
    </>
  )
}
