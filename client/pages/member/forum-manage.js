import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Navbar from '@/components/layout/public-version/navbar'
import Footer from '@/components/layout/public-version/footer'
import Main from '@/components/layout/member-main'
import ArticleFavorite from '@/components/member-center/favorite/article-favorite'
import styles from '@/styles/member-center.module.scss'

import ContentTitle from '@/components/member-center/title'
import { getUserInfo } from '@/services/user.js'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'

export default function Index() {
  //
  const [forum, setForum] = useState([]) // () 根據放進去東西而改變
  const [lecturer, setLecturer] = useState([]) // 給予新的狀態
  const [lecturerName, setLecturerName] = useState('文章管理') // 初始化文章管理
  //
  const { auth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.isAuth) return

      try {
        const res = await getUserInfo()
        // console.log(res.data.user.exclusive_code) 檢查是否有exclusive_code
        setLecturer(res.data.user.exclusive_code)
      } catch (error) {
        console.error('載入使用者資料失敗：', error)
      }
    }
    fetchUserData()
  }, [auth])

  //
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3005/member/lecturer-forum/manage?exclusive_code=${lecturer}`,
          {
            method: 'get',
            headers: { Authorization: `Bearer ${localStorage.accessToken}` },

            // body:
          }
        )
        const result = await response.json()
        // console.log(result) //查看後端傳回來的值
        // map
        //
        // 如果 result 不為空且包含 lecturer_name，則設置 lecturerName 為 lecturer_name
        if (result.length > 0 && result[0].lecturer_name) {
          setLecturerName(result[0].lecturer_name)
        }
        //

        setForum(result)
      } catch (error) {
        console.error('Failed to fetch forum data:', error)
      }
    }
    fetchData()
  }, [lecturer]) // 若要重新渲染會[]改變 ?直接刪除
  //
  return (
    <>
      {/*  關閉eslint偵測 */}
      {/* eslint-disable */}
      <Head>
        <title>MR.BEAN 文章管理</title>
      </Head>
      <Navbar />
      <Main>
        <div className={styles['main-content']}>
          <ContentTitle content={`文章管理  (${lecturerName}) `} />
          <i
            className={`bi bi-plus-square-dotted ${styles['forum-edit']}`}
            onClick={() => {
              // 頁面跳轉
              router.push(`/forum/forum-create`)
            }}
          ></i>
          <style jsx>{`
            i {
              cursor: pointer;
              margin-left: 20px;
              color: #003e52;
              font-size: 25px;
            }
            i:hover {
              color: #bc955c;
            }
          `}</style>
          {/* <ContentTitle content={`${forum.lecturer_name}`} /> */}
          <div className={styles['main-content-content']}>
            {/* 將論壇資訊傳遞至ArticleFavorite組件 */}
            {/* {forum[0]?.map((value, index) => {
              return <ArticleFavorite forumData={value} key={index} />
            })} */}
            {/* 原本為 */}
            {forum.map((value, index) => {
              return <ArticleFavorite forumData={value} key={index} />
            })}
          </div>
        </div>
      </Main>
      <Footer />
    </>
  )
}
