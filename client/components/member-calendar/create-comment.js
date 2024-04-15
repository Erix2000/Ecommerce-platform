import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '@/components/member-calendar/create-comment.module.scss'
import Star from './star'
import Form from 'react-bootstrap/Form'
import Image from 'next/image'
import { useAuth } from '@/hooks/use-auth'
import { Modal, Button } from 'react-bootstrap'
import toast, { Toaster } from 'react-hot-toast'
import warning2 from '@/assets/gif/icons8-warning2.gif'
import Link from 'next/link'

const CommentBox = () => {
  const router = useRouter()
  const { order_id, item_id, item_type } = router.query // 從URL獲取order_id,item_id和item_type
  const { auth } = useAuth() // 使用useAuth Hook獲取auth對象
  const [itemDetails, setItemDetails] = useState(null) // 存儲從後端獲取的商品詳情
  const [comment, setComment] = useState('') // 評論內容
  const [rating, setRating] = useState(0) // 評分
  const [showThankYouModal, setShowThankYouModal] = useState(false)
  const [isPurchased, setIsPurchased] = useState(false)
  const [isCommentSubmitted, setIsCommentSubmitted] = useState(false)
  const handleShowThankYouModal = () => setShowThankYouModal(true)
  const handleCloseThankYouModal = () => setShowThankYouModal(false)
  const productCodePrefix =
    itemDetails && itemDetails.product_code
      ? itemDetails.product_code.slice(0, 2)
      : ''

  // 獲取商品詳情
  useEffect(() => {
    if (!auth.isAuth) return
    // 檢查用戶是否購買過該商品或課程
    fetch(
      `http://localhost:3005/member/comment/check-purchase?uuid=${auth.userData.uuid}&order_id=${order_id}&item_id=${item_id}&item_type=${item_type}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'not-purchased') {
          // 如果用戶未購買，更新 isPurchased 狀態並顯示提示訊息
          setIsPurchased(false)
        } else {
          // 如果用戶已購買，更新 isPurchased 狀態並獲取商品詳情
          setIsPurchased(true)
          fetch(
            `http://localhost:3005/member/comment/getItemDetails?order_id=${order_id}&item_id=${item_id}&item_type=${item_type}`
          )
            .then((res) => res.json())
            .then((data) => {
              setItemDetails(data)
            })
            .catch((err) => console.error('Error fetching item details:', err))
        }
      })
      .catch((err) => console.error('Error checking purchase status:', err))
  }, [auth.userData.uuid, order_id, item_id, item_type, auth.isAuth])

  // 更新評論內容
  const handleCommentChange = (event) => {
    const commentText = event.target.value

    if (commentText.length >= 495) {
      // 當輸入的字符數接近或等於500時顯示提示
      toast.error(`限500字內，目前${comment.length}個字`)
    }
    // 更新評論，即使超過500字也允許，以便顯示Toast提示
    // 但不會將超過500字的評論傳送到後端
    setComment(commentText.slice(0, 500))
  }

  // 更新評分
  const handleRatingChange = (newRating) => {
    setRating(newRating)
  }

  // 提交評論
  const handleSubmit = (event) => {
    event.preventDefault()
    // console.log('Submitting rating:', rating)
    if (!isPurchased) {
      console.error('您未購買此商品或課程，無法評論。')
      return
    }
    if (rating <= 0) {
      handleShowThankYouModal()
      setIsCommentSubmitted(false)
    } else {
      setIsCommentSubmitted(true)
      const commentData = {
        order_id,
        item_id,
        item_type,
        comment_star: rating, // 從 Star 組件中獲取的評分
        comment_text: comment, // 從文本框中獲取的評論內容
        uuid: auth.userData.uuid, // 從auth對象中獲取的使用者UUID
      }

      // 使用.then()和.catch()處理Promise
      fetch('http://localhost:3005/member/comment/comment-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      })
        .then((response) => {
          if (response.status === 409) {
            // 如果後端返回409狀態碼，表示評論已存在
            toast.error('送出失敗，您已對該商品/課程提交過評論')
            throw new Error('您已對該商品/課程提交過評論')
          }
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then((data) => {
          // 處理成功情況
          console.log('Comment added successfully:', data)
          setRating(0)
          setComment('')
          handleShowThankYouModal()
          // 可以在這裡添加其他成功後的處理邏輯，如顯示成功消息給用戶等
        })
        .catch((error) => {
          // 處理錯誤情況
          console.error('Comment was not added:', error)
          // 可以在這裡添加錯誤處理邏輯，如顯示錯誤消息給用戶等
        })
    }
  }

  if (!itemDetails) {
    return (
      <div className={`${styles['alert-title']}`}>請循正常管道進入此頁面</div>
    ) // 如果商品詳情還未獲取，顯示加載提示
  }

  if (!isPurchased) {
    return (
      <div className={`container`}>
        <h2 className={`${styles['alert-title']}`}>
          您未購買此商品或課程，無法評論。
        </h2>
        <button
          className={`${styles['alert-backBtn']}`}
          onClick={() => router.push('/member/order')}
        >
          查看歷史訂單
        </button>
      </div>
    )
  }

  return (
    <>
      {' '}
      <div className={`container`}>
        <h2 className={`${styles['comment-title']}`}>評論</h2>
        <div className={`${styles['comment-box']}`}>
          <div className={`${styles['order-detail']}`}>
            <Image
              className={`${styles['order-img']}`}
              src={
                item_type === 'product' &&
                itemDetails &&
                itemDetails.product_code
                  ? `/product-img/product/${productCodePrefix}/pro/${itemDetails.product_img}`
                  : `/course-img/${itemDetails?.course_img}`
              }
              alt={
                item_type === 'product'
                  ? `${itemDetails.product_name} 產品照片`
                  : `${itemDetails.course_name} 課程照片`
              }
              width={150}
              height={150}
            />
            <div className={`${styles['product-info']}`}>
              <ul>
                {/* <li>訂單 ID: {itemDetails.product_code}</li> */}
                <li className={`${styles['order-title']}`}>
                  <Link
                    className={`${styles['order-link']}`}
                    href={
                      item_type === 'product'
                        ? `/product/${productCodePrefix}/${itemDetails.product_code}`
                        : `/course/${itemDetails.course_category_id}/${itemDetails.course_id}`
                    }
                  >
                    {item_type === 'product'
                      ? itemDetails.product_name
                      : itemDetails.course_name}
                  </Link>
                </li>{' '}
                <li className={`${styles['order-text']}`}>
                  {item_type === 'product'
                    ? itemDetails.product_spec
                    : `地點：${itemDetails.course_location}`}
                </li>{' '}
                <li className={`${styles['order-price']}`}>
                  ${itemDetails.item_price}
                </li>{' '}
              </ul>
            </div>
          </div>
          <Form
            onSubmit={handleSubmit}
            className={`${styles['comment-container']}`}
          >
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Star
                starCount={5}
                initRating={rating}
                onRatingChange={handleRatingChange}
              />
            </Form.Group>
            <Form.Group
              className="mb-2"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label className={`${styles['comment-label']}`}>
                評論內容
              </Form.Label>
              <Form.Control
                className={`${styles['input-area']}`}
                as="textarea"
                rows={3}
                value={comment}
                maxLength={500}
                onChange={handleCommentChange}
              />
            </Form.Group>
            <div className={`${styles['btn-group']}`}>
              <button type="submit" className={`${styles['submit']}`}>
                送出
              </button>
            </div>
          </Form>
        </div>
      </div>
      <Modal show={showThankYouModal} onHide={handleCloseThankYouModal}>
        <Modal.Header closeButton className={`${styles['modal-head']}`}>
          <Modal.Title className={`${styles['modal-title']}`}>
            {isCommentSubmitted
              ? '感謝您的評論！'
              : '您未填寫評分，無法提交評論'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer className={`${styles['modal-footer']}`}>
          <Button
            className={`${styles['modal-backBtn']}`}
            onClick={() => {
              router.push(`/member/order/${order_id}`)
            }}
          >
            評論其他商品
          </Button>
          {isCommentSubmitted ? (
            <Button
              className={`${styles['modal-shopBtn']}`}
              onClick={() => {
                router.push('/product/00')
              }}
            >
              繼續購物
            </Button>
          ) : (
            <Button
              className={`${styles['modal-shopBtn']}`}
              onClick={handleCloseThankYouModal}
            >
              繼續評論
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <Toaster
        toastOptions={{
          iconTheme: {
            primary: '#003e52',
          },
          position: 'bottom-right',
          duration: 3000,
          success: {
            style: {
              border: '1.5px solid #003e52',
              borderRadius: '0',
            },
          },
          error: {
            icon: <Image src={warning2} width={25} height={25} alt="warning" />,

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

export default CommentBox
