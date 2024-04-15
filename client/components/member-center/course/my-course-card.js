import Image from 'next/image'
import React from 'react'

export default function MyCourseCard({ courseData = {} }) {
  const {
    course_id,
    course_category_id,
    course_img,
    course_name,
    course_intro,
    course_location,
    course_date_start,
    course_date_end,
    course_time,
    lecturer_name,
  } = courseData
  return (
    <>
      <div
        className="course-card d-lg-flex"
        onClick={() => {
          window.location.href = `http://localhost:3000/course/${course_category_id}/${course_id}`
        }}
      >
        <div className="course-img col-lg-4">
          <img src={`/course-img/${course_img}`} alt="課程圖片" />
        </div>
        <div className="course-info col-lg-8 d-flex flex-column gap-3 flex-grow-1 p-3">
          <div className="course-name">{course_name}</div>

          <div className="course-intro flex-grow-1">{course_intro}</div>
          <div className="course-detail d-flex gap-3">
            <div className="course-location">{course_location}</div>
            <div className="course-lecturer">{lecturer_name} 老師</div>
            <div className="course-date">
              {course_date_start === course_date_end
                ? course_date_start
                : `${course_date_start} ~ ${course_date_end}`}
            </div>
            <div className="course-time">{course_time}</div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .course-card {
          cursor: pointer;
          box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.25);
          &:hover {
            .course-name {
              color: #bc955c;
            }
            & img {
              opacity: 0.8;
            }
          }
        }
        .course-img {
          width: 25%;
          aspect-ratio: 2/1;
          & img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .course-location {
          font-size: 18px;
          line-height: 18px;
          font-weight: 600;
          color: #003e52;
          &:hover {
            color: #bc955c;
          }
        }
        .course-lecturer {
          color: #003e52;
          &:hover {
            color: #bc955c;
          }
        }
        .course-name {
          font-size: 28px;
          line-height: 28px;
          font-weight: 800;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .course-intro {
          font-size: 18px;
          font-weight: 500;
          text-align: justify;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .course-detail {
          font-size: 16px;
        }
        @media screen and (max-width: 992px) {
          .course-img {
            width: 100%;
          }
          .course-location {
            font-size: 14px;
            line-height: 14px;
            text-wrap: nowrap;
            font-weight: 600;
          }
          .course-name {
            font-size: 20px;
            line-height: 20px;
          }
          .course-intro {
            font-size: 14px;
          }
          .course-detail {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  )
}
