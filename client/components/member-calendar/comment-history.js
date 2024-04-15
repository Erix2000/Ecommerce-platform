import React, { useState, useEffect, useRef } from 'react'
import styles from '@/components/member-calendar/comment-history.module.scss'
import { useAuth } from '@/hooks/use-auth' // 從 useAuth Hook 獲取 auth 對象
import { Table, Modal, Button } from 'react-bootstrap'

export default function CommentHistory() {
  // 讀取資料相關
  const { auth } = useAuth() // 使用 useAuth Hook 獲取認證狀態和用戶資料
  const [comments, setComments] = useState([]) // 評論狀態
  //刪除資料相關
  const [showModal, setShowModal] = useState(false) // 控制模態窗口顯示的狀態
  const [selectedCommentId, setSelectedCommentId] = useState(null) // 記錄待刪除的評論 ID
  const [selectedType, setSelectedType] = useState('all') // 'all'表示不進行過濾
  // 下拉選單出現
  const [selBoxToggle, setSelBoxToggle] = useState(false)
  // 下拉選單文字及值設定
  const [selBox, setSelBox] = useState('所有評論')
  const selboxTitle = useRef(null)

  // 當組件掛載時，根據是否登入和用戶ID從後端獲取評論數據
  useEffect(() => {
    if (!auth.isAuth) return
    if (auth.isAuth && auth.userData.uuid) {
      fetch(
        `http://localhost:3005/member/comment/comments?uuid=${auth.userData.uuid}&type=${selectedType}`
      )
        .then((response) => response.json())
        .then((data) => {
          // 首先按照評論時間降序排序
          const sortedData = data.sort(
            (a, b) =>
              new Date(b.comment_created_at) - new Date(a.comment_created_at)
          )
          // 然後對排序後的數據進行格式化
          const formattedData = sortedData.map((comment) => {
            return {
              ...comment,
              comment_created_at: formatDate(comment.comment_created_at), // 使用 formatDate 函數格式化日期
            }
          })
          setComments(formattedData)
        })
        .catch((error) => console.error('獲取評論數據時出錯:', error))
    }
  }, [auth.isAuth, auth.userData.uuid, selectedType])

  // 在渲染之前先篩選評論
  const filteredComments = comments.filter((comment) => {
    if (selBox === '所有評論') return true
    return comment.item_type === (selBox === '產品評論' ? 'product' : 'course')
  })

  // 刪除評論的函數
  const deleteComment = (commentId) => {
    fetch(`http://localhost:3005/member/comment/comment-delete/${commentId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // 如果成功，從狀態中移除該評論
          setComments(
            comments.filter((comment) => comment.comment_id !== commentId)
          )
          setShowModal(false) // 關閉模態窗口
        } else {
          // 如果有錯誤，您可以在這裡處理
          console.error('Failed to delete comment')
        }
      })
      .catch((error) => {
        console.error('Error deleting comment:', error)
      })
  }
  // 用於顯示模態窗口的函數
  const handleShowModal = (commentId) => {
    setSelectedCommentId(commentId)
    setShowModal(true)
  }
  // 用於關閉模態窗口的函數
  const handleCloseModal = () => {
    setShowModal(false)
  }

  //格式化時間的function
  function formatDate(dateInput) {
    const date = new Date(dateInput)
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    return formattedDate
  }

  return (
    <>
      {/* 主要內容區段開始 */}
      <h2 className={`${styles['comment-title']}`}>評論紀錄</h2>
      <div className={`${styles['content']} container`}>
        <div className="row">
          <div className="col">
            {/* 下拉式選單 */}
            <div className={`${styles['input-box-area']}`}>
              {' '}
              <div className={`${styles['input-box']}`}>
                <div className={`custom-select ${styles['custom-select']}`}>
                  <input
                    type="text"
                    className="d-none"
                    id="customSelectValue"
                    defaultValue={selBox}
                  />
                  <div
                    className={`selected ${styles['selected']}`}
                    onClick={() => {
                      setSelBoxToggle((p) => !p)
                    }}
                    ref={selboxTitle}
                  >
                    {selBox === '' ? '評論類型' : selBox}&nbsp;
                    <i className="bi bi-chevron-down" />
                  </div>
                  <div
                    className={`custom-options ${styles['custom-options']}`}
                    style={{ display: selBoxToggle ? 'block' : 'none' }}
                  >
                    <div
                      className={`custom-option ${styles['custom-option']}`}
                      // onClick={selBoxTitleFun(this)}
                      data-value="所有評論"
                      value="all"
                      onClick={(e) => {
                        selboxTitle.current.nextElementSibling.style.display =
                          'none'

                        setSelBox(e.currentTarget.getAttribute('data-value'))
                      }}
                    >
                      所有評論
                    </div>
                    <div
                      className={`custom-option ${styles['custom-option']}`}
                      data-value="產品評論"
                      value="product"
                      onClick={(e) => {
                        selboxTitle.current.nextElementSibling.style.display =
                          'none'

                        setSelBox(e.currentTarget.getAttribute('data-value'))
                      }}
                    >
                      產品評論
                    </div>
                    <div
                      className={`custom-option ${styles['custom-option']}`}
                      data-value="課程評論"
                      value="course"
                      onClick={(e) => {
                        selboxTitle.current.nextElementSibling.style.display =
                          'none'

                        setSelBox(e.currentTarget.getAttribute('data-value'))
                      }}
                    >
                      課程評論
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*電腦版開始 */}
            <Table hover className={`${styles['comment-table']}`}>
              {/* 標頭 */}
              <thead className={`${styles['t-head']}`}>
                <tr>
                  <th
                    scope="col"
                    className={`${styles['w-15-percent']} text-center`}
                  >
                    評論時間
                  </th>
                  <th
                    scope="col"
                    className={`${styles['w-35-percent']} text-center`}
                  >
                    商品/課程名稱
                  </th>
                  <th
                    scope="col"
                    className={`${styles['w-45-percent']} text-center`}
                  >
                    您的評論內容
                  </th>
                  <th
                    scope="col"
                    className={`${styles['w-5-percent']} text-center`}
                  ></th>
                </tr>
              </thead>
              {/* 標頭 */}
              {/* 表格內文 */}
              <tbody className={`${styles['t-body']} table-group-divider`}>
                {filteredComments.map((comment, index) => {
                  const {
                    comment_id,
                    comment_star,
                    comment_text,
                    comment_created_at,
                    itemDetails, // 從後端獲取的額外詳情
                  } = comment

                  // 生成星星
                  const stars = []
                  for (let i = 0; i < comment_star; i++) {
                    stars.push(
                      <i key={i} className={`${styles.star} bi bi-star-fill`} />
                    )
                  }

                  // 根據 itemDetails 中是否存在 product_name 或 course_name 來決定顯示的名稱
                  const itemName =
                    itemDetails.product_name ||
                    itemDetails.course_name ||
                    '未知項目'

                  return (
                    <tr key={index}>
                      {/* 評論時間 */}
                      <th
                        scope="row"
                        className={`text-center ${styles['comment-time']}`}
                      >
                        {comment_created_at}
                      </th>
                      {/* 評論產品/課程名稱 */}
                      <td
                        className={`text-center ${styles['comment-product']}`}
                      >
                        {itemName}
                      </td>

                      <td>
                        {/* 星等 */}
                        <p className={`mb-2 ${styles['comment-stars']}`}>
                          {stars}
                        </p>
                        {/* 評論內容 */}
                        <p className={`${styles['comment-text']}`}>
                          {comment_text}
                        </p>
                      </td>
                      {/* 刪除按鈕 */}
                      <td>
                        <i
                          className={`${styles['trash-btn']} bi bi-trash3`}
                          onClick={() => handleShowModal(comment_id)}
                          role="button"
                          tabIndex="0"
                          onKeyDown={(event) => {
                            // 當用戶按下空格鍵或回車鍵時觸發刪除操作
                            if (event.key === ' ' || event.key === 'Enter') {
                              handleShowModal(comment_id) // 修正錯誤的函數名
                            }
                          }}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              {/* 表格內文 */}
            </Table>

            {/* 電腦版結束 */}

            {/* 手機版開始 */}
            <div
              className={`${styles['mobile-size']} row justify-content-center`}
            >
              <div className={`${styles['comment-card']}`}>
                {filteredComments.map((comment, index) => {
                  const {
                    comment_id,
                    comment_star,
                    comment_text,
                    comment_created_at,
                    itemDetails, // 從後端獲取的額外詳情
                  } = comment

                  // 生成星星
                  const stars = []
                  for (let i = 0; i < comment_star; i++) {
                    stars.push(
                      <i key={i} className={`${styles.star} bi bi-star-fill`} />
                    )
                  }

                  // 根據 itemDetails 中是否存在 product_name 或 course_name 來決定顯示的名稱
                  const itemName =
                    itemDetails.product_name ||
                    itemDetails.course_name ||
                    '未知項目'

                  return (
                    <div key={index} className={`${styles['comment-group']}`}>
                      <div className={`${styles['comment-first-line']}`}>
                        {/* 評論產品/課程名稱 */}
                        <p className={`${styles['comment-product']}`}>
                          {itemName}
                        </p>
                        {/* 刪除按鈕 */}
                        <i
                          className={`${styles['trash-btn']} bi bi-trash3`}
                          onClick={() => handleShowModal(comment_id)}
                          role="button"
                          tabIndex="0"
                          onKeyDown={(event) => {
                            // 當用戶按下空格鍵或回車鍵時觸發刪除操作
                            if (event.key === ' ' || event.key === 'Enter') {
                              handleShowModal(comment_id) // 修正錯誤的函數名
                            }
                          }}
                        />
                      </div>
                      {/* 星等 */}
                      <p className={`mb-2 ${styles['comment-stars']}`}>
                        {stars}
                      </p>
                      {/* 評論內容 */}
                      <p className={`${styles['comment-text']}`}>
                        {comment_text}
                      </p>
                      {/* 評論時間 */}
                      <p className={`${styles['comment-time']}`}>
                        評論時間 {comment_created_at}
                      </p>
                      <hr />
                    </div>
                  )
                })}
              </div>
            </div>
            {/* 手機版結束 */}
          </div>
        </div>
      </div>
      {/* 主要內容區段結束 */}
      {/* 主要內容結束 */}
      {/* 模態窗口 */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className={`${styles['modal-head']}`}>
          <Modal.Title className={`${styles['modal-title']}`}>
            您確定要刪除這則評論嗎？
          </Modal.Title>
        </Modal.Header>
        {/* <Modal.Body className={`${styles['modal-body']}`}>
          您確定要刪除這條評論嗎？
          </Modal.Body> */}
        <Modal.Footer className={`${styles['modal-footer']}`}>
          <Button
            className={`${styles['modal-cancelBtn']}`}
            onClick={handleCloseModal}
          >
            取消
          </Button>
          <Button
            className={`${styles['modal-deleteBtn']}`}
            onClick={() => deleteComment(selectedCommentId)}
          >
            刪除
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
