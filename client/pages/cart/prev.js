import { useEffect, useState } from 'react'
import beanData from '@/data/Bean.json'
import classData from '@/data/class.json'
import Link from 'next/link'
import { useCart } from '@/hooks/use-cart'
import toast from 'react-hot-toast'
import Image from 'next/image'
import warning2 from '@/assets/gif/icons8-warning2.gif'
// import img from 'next/img'

export default function Prev() {
  const { addItem = () => {}, Toaster, courseItems, cart } = useCart()
  const [product, setProduct] = useState([])
  const [course, setCourse] = useState([])

  const getProducts = async () => {
    const products = await fetch('http://localhost:3005/product/00', {
      method: 'get',
    })
      .then((response) => {
        return response.json()
      })
      .then((result) => {
        return result
      })
      .catch((err) => {
        console.log(err)
      })
    setProduct(products)
  }

  const getCourses = async () => {
    const courses = await fetch('http://localhost:3005/course/list', {
      method: 'get',
    })
      .then((response) => {
        return response.json()
      })
      .then((result) => {
        return result
      })
      .catch((err) => {
        console.log(err)
      })
    setCourse(courses)
  }
  useEffect(() => {
    getProducts()
    getCourses()
  }, [])

  return (
    <>
      <main className="container" style={{ marginTop: '1rem' }}>
        <Link href="http://localhost:3000/cart">到購物車</Link>
        <h1 style={{ color: 'red' }}>商品列表</h1>

        <hr />
        <div className="row">
          {product.map((bean) => {
            {
              /* const img = bean.product_img.toString().split(',')[0] */
            }

            const img = bean.product_img.split(',')[0]
            const folderPosition = bean.product_code.slice(0, 2)

            return (
              <div
                key={bean.product_id}
                className="col-2  me-3"
                style={{ border: '1px solid black', paddingBlock: '1rem' }}
              >
                <div
                  className="d-flex flex-column"
                  style={{ alignItems: 'center' }}
                >
                  <Image
                    src={`/product-img/product/${folderPosition}/pro/${img}`}
                    style={{
                      marginBottom: '1rem',
                      objectFit: 'cover',
                    }}
                    width={150}
                    height={150}
                    alt={bean.product_name}
                  />
                  <h3>{bean.product_name}</h3>
                  <p>規格：{bean.product_spec}</p>
                  <button
                    className="btn btn-primary"
                    style={{ color: 'white' }}
                    onClick={() => {
                      addItem({ ...bean, item_type: 'product' })
                    }}
                  >
                    加入購物車
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <h1 style={{ color: 'red', marginTop: '1.5rem' }}>課程列表</h1>
        <hr />
        <div className="row">
          {course.map((classData) => {
            return (
              <div
                key={classData.course_id}
                className="col-2  me-3"
                style={{ border: '1px solid black', paddingBlock: '1rem' }}
              >
                <div
                  className="d-flex flex-column"
                  style={{ alignItems: 'center' }}
                >
                  <Image
                    src={`/course-img/${classData.course_img}`}
                    style={{
                      marginBottom: '1rem',
                      objectFit: 'cover',
                    }}
                    width={150}
                    height={150}
                    alt={classData.course_name}
                  />
                  <h3>{classData.course_name}</h3>
                  <p>開課地點：{classData.course_location}</p>
                  <button
                    className="btn btn-primary"
                    style={{ color: 'white' }}
                    onClick={() => {
                      addItem({ ...classData, item_type: 'course' })
                    }}
                  >
                    加入購物車
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        <h1>測試</h1>
        <button
          onClick={() => {
            toast.error('測試')
          }}
        >
          Toast
        </button>
        <Image
          src="/product-img/product/02/pro/02010101-1.webp"
          width={100}
          height={100}
          alt="test"
        />
      </main>
      <Toaster
        toastOptions={{
          iconTheme: {
            primary: '#003e52',
          },
          position: 'bottom-right',
          duration: 2000,
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
