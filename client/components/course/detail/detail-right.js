import React, { useEffect, useRef, useState } from 'react'; // 只引入一次React和Hook
import styles from './course-detail.module.scss';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useRouter } from 'next/router';
import { useCart } from '@/hooks/use-cart'
import Carousel from 'react-bootstrap/Carousel';
import { Image } from 'react-bootstrap'


import LikeFill from '@/assets/img/product/icon/like-fill.svg'
import LikeStroke from '@/assets/img/product/icon/like-stroke.svg'

import Nmage from 'next/image'
// 會員鉤子
import { useAuth } from '@/hooks/use-auth'

import CommentCard from './comment-card';
import LecturerInfo from '@/components/member/lecturer-info';
import warning2 from '@/assets/gif/icons8-warning2.gif'
import toast,{ Toaster } from 'react-hot-toast';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'



export default function DetailRight({ courseDetailData = {}, userLikeArr = {}, commentData = {} }) {
  console.log(courseDetailData);

  const { addItem } = useCart()
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { auth } = useAuth();
  const router = useRouter();
  const { category, cid } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [courseDetail, setCourseDetail] = useState([]);
  const MySwal = withReactContent(Swal)

  const [isComment, setIsComment] = useState(false)

  // let averageStars
  const [averageStars, setAverageStars] = useState(0)

  const [hasComment, setHasComment] = useState()
  const [noComment, setNoComment] = useState()

  // 愛心hover功能
  const [likeHover, setLikeHover] = useState(false)
  // 愛心active功能
  const [likeActive, setLikeActive] = useState(false)

  const token = localStorage.getItem('accessToken')

  // 取消收藏
  let unlike = () => {
    // 刪除愛心
    fetch(`http://localhost:3005/course/clike`, {
      method: 'DELETE',
      body: JSON.stringify({
        user_id: auth.userData.user_id,
        item_id: courseDetail.course_id
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
      })
      .catch((error) => {
        console.log(error)

      })
  }

  // 加入收藏
  let like = () => {
    console.log(
      courseDetail.course_id
    )
    // 加入愛心
    fetch(`http://localhost:3005/course/clike`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: auth.userData.user_id,
        item_id: courseDetail.course_id
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
      })
      .catch((error) => {
        console.log(error)
      })
    console.log(123)
  }

  //無評論
  useEffect(() => {
    setHasComment(
      <>
        {commentData.map((commentItem, i) => {
          return (
            <CommentCard key={i} commentItem={commentItem} />
          )

        })}
      </>
    )

    setNoComment(
      <>尚無評論</>
    )



  }, [isComment])

  useEffect(() => {
    setIsLoading(true)

    if (router.isReady && category && cid) {

      console.log(category)

      console.log(courseDetailData)
      setCourseDetail(courseDetailData[0])
      console.log(courseDetailData[0])
      
      
      // setImgArr(Arr);
      // setImgSrc(Arr ? Arr[0] : [])

    }

    if (commentData.length > 0) {
      setIsComment(true)
      // 評論
      let totalStars = commentData.reduce((sum, item) => sum + item.comment_star, 0);
      // 計算平均值
      setAverageStars(Math.round((totalStars / commentData.length) * 10) / 10)
      // averageStars = Math.round((totalStars / commentData.length) * 10) / 10;
      console.log(averageStars);
    } else {
      setIsComment(false)
      setAverageStars(0)
      // averageStars = 0
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 2000)

  }, [router.isReady, cid, averageStars])

  useEffect(() => {
    if (courseDetail.length === 0) {

    } else {
      if (auth.isAuth) {
        if (category) {
          
          if (userLikeArr.includes(courseDetail.course_id.toString())) {
            setLikeHover(true)
            setLikeActive(true)
            console.log(123)
          }
        }

      }
    }

    console.log(courseDetail)
  }, [courseDetail])




  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [router.isReady, cid]);

  const data = [
    { id: '1', tabTitle: '課程介紹' },
    { id: '2', tabTitle: '課程評價' },
  ];

  const [visibleTab, setVisibleTab] = useState(data[0].id);

  //頁籤下滑部分
  const introRef = useRef(null);
  const reviewRef = useRef(null);

  const handleIntroClick = () => {
    introRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReviewClick = () => {
    reviewRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const listTitles = data.map((item) => (
    <li
      key={item.id}
      onClick={() => {
        if (item.id === '1') {
          handleIntroClick();
        } else if (item.id === '2') {
          handleReviewClick();
        }
      }}
      className={
        visibleTab === item.id
          ? `${styles['tab-title']} ${styles['tab-title--active']}`
          : `${styles['tab-title']}`
      }
      style={{ letterSpacing: '0.18rem' }}
    >
      {item.tabTitle}
    </li>
  ));

  //offcanvas日期設定
  const startDate = new Date(courseDetail.course_date_start);
  const endDate = new Date(courseDetail.course_date_end);

  let formattedStartDate = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
  let formattedEndDate = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;

  // 如果開始日期與結束日期相同，只顯示開課日期
  if (startDate.getTime() === endDate.getTime()) {
    formattedEndDate = '';
  } else {
    formattedEndDate = ` ~ ${formattedEndDate}`;
  }

  let formattedDate = `${formattedStartDate}${formattedEndDate}`;


  return (
    <>
      

      {/* 電腦版 */}
      <div className={`content container ${styles['content']} ${styles['container']}`}>
        <div className={`container ${styles['container']}`}>
          <div className={`row ${styles['row']}`}>
            {/* 課程圖片開始 */}
            <div className={`col-12 col-md-6 mainImg ${styles['col-12']} ${styles['col-md-6']} ${styles['mainImg']}`}>
              <img
                src={`/course-img/${courseDetail.course_img}/`}
                className="card-img"
                alt="..."
              />
            </div>
            {/* 課程大標題 */}
            <div className={`col-12 col-md-6 courseText ${styles['courseText']}`}>
              <div className={`subTitle ${styles['subTitle']}`}>
                {courseDetail.course_name}
              </div>
              {/* 課程教室 */}
              <div className={`classroom ${styles['classroom']}`}>| {courseDetail.course_location} |</div>
              <br />
              <br />
              {/* 課程簡介 */}
              <div className={`course-outline ${styles['course-outline']}`}>「 {courseDetail.course_intro} 」</div>
              <br />
              <br />
              <div className={`course-text ${styles['course-text']}`}>
                <div className={`course-price ${styles['course-price']}`}>
                  <div className="course-price-align">
                    <p style={{ fontSize: "18px", letterSpacing: "0.18rem" }}>
                      <span className="text-danger">NT${courseDetail.course_price}</span>
                      <span className="text-secondary" style={{ fontSize: "14px", textDecoration: "line-through", color: "$indigo-color" }}> NT${courseDetail.course_origin_price}</span>
                    </p>
                  </div>
                </div>

                {/* 愛心收藏 */}
                {likeHover ? (
                  <Nmage
                    // 照片二
                    className={`${styles['course-like']}`}
                    style={{
                      width: '30px',
                      height: '30px',
                    }}

                    src={LikeFill}
                    alt="Hover Image"
                    onMouseOut={() => {
                      if (likeActive) {
                        setLikeHover(true)
                      } else {
                        setLikeHover(false)
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      if (auth.isAuth) {
                        if (likeActive) {
                          setLikeHover(false)
                          setLikeActive(false)
                          toast.success('課程已取消收藏')
                          unlike()
                        } else {
                          setLikeHover(true)
                          setLikeActive(true)
                          toast.success('課程已加入收藏')
                          like()
                        }
                      } else {
                        MySwal.fire({
                          title: (
                            <>{`尚未登入，無法收藏商品`}</>
                          ),

                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#003e52',
                          cancelButtonColor: '#808080',
                          confirmButtonText: '前往登入',
                          cancelButtonText: '繼續逛逛',
                        }).then((result) => {
                          if (result.isConfirmed) {
                            router.push("/member/login")
                          }
                        })
                      }

                    }}
                  />
                ) : (
                  <Nmage
                    // 照片一
                    className={`${styles['course-like']}`}
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: 'fff',
                    }}
                    src={LikeStroke}
                    alt="Normal Image"
                    onMouseOver={() => {
                      setLikeHover(true)
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      if (auth.isAuth) {
                      setLikeHover(true)
                      setLikeActive(true)
                      like()
                    } else {
                      MySwal.fire({
                      title: (
                          <>{`尚未登入，無法收藏商品`}</>
                      ),
                      
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#003e52',
                      cancelButtonColor: '#808080',
                      cancelButtonText: '繼續逛逛',
                      confirmButtonText: '前往登入',
                      
                      }).then((result) => {
                      if (result.isConfirmed) {
                          router.push("/member/login")
                      }
                      })
                  }
              }}
                  />
                )}
              </div>
              {/* 預約視窗 */}
              <div className={`bookarea ${styles['bookarea']}`}>
                <Button variant="primary" onClick={handleShow} className={`btn-booking ${styles['btn-booking']}`} style={{ borderRadius: 0 }}>
                  立即預約
                </Button>
                <div className={`course-booking ${styles['course-booking']}`}><i className="bi bi-person-plus-fill"></i>&nbsp;剩餘名額：{courseDetail.course_stock}</div>
              </div>

              <Offcanvas placement={'end'} show={show} onHide={handleClose} className={`custom-offcanvas ${styles['custom-offcanvas']}`}>
                <Offcanvas.Body>
                  <div className="col-12">
                    <div className="image-container" style={{ width: '370px', height: '400px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <img
                        src={`/course-img/${courseDetail.course_img}/`}
                        className="card-img"
                        alt="..."
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <br />
                    <div className={`course-info ${styles['course-info']}`}>
                      <h6 className={`course-name ${styles['course-name']}`}>｜課程名稱</h6>
                      <div className={`course-title ${styles['course-title']}`}>&nbsp;{courseDetail.course_name}</div>
                      <br />
                      <h6 className={`course-teacher ${styles['course-teacher']}`}>｜授課導師</h6>
                      <div className={`teacher ${styles['teacher']}`}>&nbsp;{courseDetail.lecturer_name}老師</div>
                      <br />
                      <h6 className={`course-date ${styles['course-date']}`}>｜開課日期</h6>
                      <div className={`date ${styles['date']}`}>&nbsp;{formattedDate}</div>
                      <br />
                      <h6 className={`course-location ${styles['course-location']}`}>｜地 點</h6>
                      <div className={`add ${styles['add']}`}>&nbsp;{courseDetail.course_address}</div>
                      <br />
                      <h6 className={`course-price ${styles['course-price']}`}>｜優惠價格</h6>
                      <div className={`textOffcanvas ${styles['textOffcanvas']}`}>
                        <span className={`price-discount text-danger ${styles['price-discount']}`} style={{ fontSize: "1em" }}>
                          &nbsp; NT$ {courseDetail.course_price} {/* 在 NT$ 和價格之間加上空格 */}
                        </span>
                        <span className={`price-display ${styles['price-display']}`} style={{ fontSize: "0.8em", textDecoration: "line-through" }}>
                          NT$ {courseDetail.course_origin_price} {/* 在 NT$ 和價格之間加上空格 */}
                        </span>
                      </div>

                      <br />
                      <a className={`btn light ${styles['btn']} ${styles['light']}`} onClick={() => {
                        addItem({ ...courseDetail, item_type: 'course' })
                      }}>
                        加入購物車
                      </a>
                    </div>
                  </div>
                </Offcanvas.Body>
              </Offcanvas>
              {/* 預約視窗結束 */}
            </div>
          </div>
          <br />
          <div className={`course-sub-content ${styles['course-sub-content']}`}>
            {/* 課程介紹點擊頁籤位置 */}
            <div className="panel-group" ref={introRef}>
              <input
                type="radio"
                name="panel-radio"
                id="radio1"
                className={`panel-control ${styles['panel-control']}`}
                defaultChecked=""
              />
              <input
                type="radio"
                name="panel-radio"
                id="radio2"
                className={`${styles['panel-control']}`}
              />
              {/* 課程介紹＆評價頁籤 */}
              <div className={`${styles['tabs']}`}>
                {/* 如果狀態等於1就顯示，不是1就不顯示 */}
                <ul
                  style={{ padding: 0, margin: 0 }}
                  className={`${styles['tab-titles']}`}
                >
                  {listTitles}
                </ul>
                <div style={{ padding: 10 }} className={`${styles['tab-content']}`}>
                  <p style={visibleTab === '1' ? {} : { display: 'none' }}>
                    {/* 課程介紹 */}
                  </p>
                  <p style={visibleTab === '2' ? {} : { display: 'none' }}>
                    {/* 課程評價 */}
                  </p>
                </div>
              </div>
              {/* 課程＆講師介紹 */}
              <div className={`container mt-5 ${styles['container']} ${styles['mt-5']}`}>
                <div className={`row ${styles['row']}`}>
                  <div className={`col-md-8 ${styles['col-md-8']}`}>
                    <div className={`pb-3 mb-4 ${styles['pb-3']} ${styles['mb-4']}`}>
                      <div className={`borderLeft ${styles['borderLeft']}`}>{courseDetail.course_outline}</div>
                    </div>
                    <br />
                    <ul className={`list-unstyled ${styles['list-unstyled']}`}>
                      <li>授課老師｜{courseDetail.lecturer_name}</li>
                      <li>{courseDetail.lecturer_honor}</li>
                      <li>
                        開課人數｜{courseDetail.course_max}名 學員
                        <br />
                        課程日期｜{formattedDate}
                        <br />
                        課程時間｜{courseDetail.course_time}
                      </li>
                    </ul>
                    <div className={`course_intro ${styles['course_intro']}`}>
                      {courseDetail.course_intro}
                    </div>
                  </div>
                  <div className={`col-md-4 mdNone ${styles['col-md-4']} ${styles['mdNone']}`}>
                    {/* 講師圖片 */}
                    <img
                      src={`http://localhost:3005/lecturer/${courseDetail.lecturer_img}`}
                      className={`img-fluid ${styles['img-fluid']}`}
                      alt="講師圖片"
                      
                    />
                  </div>
                  {/* 課程介紹＆評論簡介 */}
                  <div className={`${styles['group-line']}`} ref={reviewRef}></div>

                  {/* 評論列表部分 */}
                  <div className={`${styles['course-comments']}`}>
                    <div className={`${styles['course-comments-title']}`}>
                      評論｜
                      {` `}
                      <span className={`${styles['score']}`}>{averageStars}</span>
                      {` `}
                      <i className={`bi bi-star-fill star ${styles['star']}`} />
                      {` `}
                      (共{commentData.length}則)
                    </div>
                    {isComment ? hasComment : noComment}

                    {/* <div className={`${styles['more']}`}>
                      <a href="">
                        more
                        <i className="bi bi-chevron-double-down" />
                      </a>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )

}