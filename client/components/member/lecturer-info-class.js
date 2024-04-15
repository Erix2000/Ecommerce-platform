import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import styles from '@/components/member/member.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { checkAuth, geLecturerInfoClasses } from '@/services/user.js'

export default function LecturerInfoClasses() {
  const { auth } = useAuth()
  const [lecturerClasses, setLecturerClasses] = useState([])
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.isAuth) return

      try {
        const res = await geLecturerInfoClasses()
        if (res.status !== 'success') {
          console.log('載入用戶資料失敗')
          return
        }
        setLecturerClasses(res.data.course)
        setHasProfile(true)
      } catch (error) {
        console.error('載入使用者資料失敗：', error)
      }
    }

    fetchUserData()
  }, [auth])

  const [collapses, setCollapses] = useState({})
  const handleCollapseToggle = (courseId) => {
    setCollapses((prevCollapses) => ({
      ...prevCollapses,
      [courseId]: !prevCollapses[courseId],
    }))
  }

  return (
    <div className={`${styles['content']} container`}>
      <div className={`${styles['main-title']}`}>課程檢視</div>
      <div className={`${styles['main-content']}`}>
        {lecturerClasses.map((course) => (
          <div key={course.course_id} className={`${styles['class-card']}`}>
            <div className={`${styles['info-card']} d-flex`}>
              <div className={`${styles['img-card']} d-sm-block d-none`}>
                <Image
                  className="img-fluid"
                  src={`/course-img/${course.course_img}`}
                  width={500}
                  height={500}
                  alt="我是圖片"
                />
              </div>
              <div className={`${styles['text-card']}`}>
                <div className={`${styles['text-title']}`}>
                  {course.course_name}
                </div>
                <div className={`${styles['text-content']} d-flex my-2`}>
                  <div className="me-3">{course.course_location}</div>
                  <div className="mx-3">
                    {new Date(course.course_date_start).toLocaleDateString()}
                  </div>
                </div>

                <div className="d-flex">
                  <div className="d-none d-md-block">學員募集中</div>
                  <button
                    className={`${styles['student-card']}  d-md-none d-block`}
                    onClick={() => handleCollapseToggle(course.course_id)}
                  >
                    學員募集中
                    <i className="bi bi-caret-down-fill"></i>
                  </button>
                  <div className="d-none d-md-block mx-3">
                    名額 {course.course_max}
                  </div>
                  <div className="d-none d-md-block max-3">
                    已報名 {course.course_max - course.course_stock}
                  </div>
                </div>
              </div>
              <Link
                type="button"
                href={`/course/${course.course_category_id}/${course.course_id}`}
                className={`${styles['comment-btn']}`}
              >
                學員評論
              </Link>
            </div>
            {collapses[course.course_id] ? (
              <div className={`${styles['collapse-info']} d-sm-none`}>
                <hr />
                <div className="d-flex m-3 justify-content-around">
                  <div className={`${styles['collapse-title']}`}>
                    學員募集中
                  </div>
                  <div className={`${styles['collapse-quota']}`}>
                    名額 {course.course_max}
                  </div>
                  <div className={`${styles['collapse-num']}`}>
                    已報名 {course.course_max - course.course_stock}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
