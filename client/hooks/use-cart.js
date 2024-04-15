import { createContext, useContext, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
export const CartContext = createContext(null)

export function CartProvider({ children }) {
  //今日日期
  const today = new Date()

  //購物車主要狀態
  const [cart, setCart] = useState([])
  const checkedCart = cart.filter((item) => {
    return item.checked == true
  })

  //sweet alert 2
  const MySwal = withReactContent(Swal)

  //stock button
  const handleStock = (name, stock) => {
    Swal.fire({
      title: '庫存已達上限',
      text: `${name} 庫存為 ${stock}`,
      confirmButtonColor: '#003e52',
      confirmButtonText: '確定',
      icon: 'error',
    })
  }

  //localstorage start
  useEffect(() => {
    if (localStorage.getItem('cart')) {
      const reRenderCart = JSON.parse(localStorage.getItem('cart'))
      setCart(reRenderCart)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  //product course query
  const productItems = (cart) => {
    return cart.filter((item) => {
      return item.item_type === 'product'
    })
  }
  const productLength = productItems(cart).length

  const courseItems = (cart) => {
    return cart.filter((item) => {
      return item.item_type === 'course'
    })
  }
  const courseLength = courseItems(cart).length

  //toast
  const notify = (category) => {
    if (category == 'product') {
      toast.success('商品已加入購物車')
    } else if (category == 'course') {
      toast.success('課程已加入購物車')
    }
  }
  //增加商品進入購物車
  const addItem = (item) => {
    const newItem = {
      ...item,
      item_id: item.product_id || item.course_id,
      item_price: item.product_price || item.course_price,
      item_stock: item.product_stock || item.course_stock,
      item_name: item.product_name || item.course_name,
    }

    const findCart = cart.find((cart) => {
      return (
        cart.item_id == newItem.item_id && cart.item_type == newItem.item_type
      )
    })
    if (!findCart) {
      if (newItem.item_stock > 0) {
        setCart([
          ...cart,
          { ...newItem, quantity: 1, checked: false, addTime: today },
        ])
        notify(newItem.item_type)
      }
    } else {
      if (newItem.item_type == 'course') {
        toast.error('此課程已在購物車')
      } else if (newItem.item_type == 'product') {
        const plus = cart.map((item) => {
          if (item == findCart) {
            if (item.quantity >= newItem.item_stock) {
              handleStock(newItem.item_name, newItem.item_stock)
              return {
                ...newItem,
                quantity: newItem.item_stock,
                addTime: today,
              }
            } else {
              notify(item.item_type)

              return { ...newItem, quantity: item.quantity + 1, addTime: today }
            }
          } else {
            return item
          }
        })

        setCart(plus)
      }
    }
  }
  //直接增加數量進購物車
  const addItemDetail = (item, quan) => {
    const newItem = {
      ...item,
      item_id: item.product_id,
      item_price: item.product_price,
      item_stock: item.product_stock,
      item_name: item.product_name,
    }

    const findCart = cart.find((cart) => {
      return (
        cart.item_id == newItem.item_id && cart.item_type == newItem.item_type
      )
    })
    if (!findCart) {
      setCart([
        ...cart,
        { ...newItem, quantity: quan, checked: false, addTime: today },
      ])
      notify(newItem.item_type)
    } else {
      const plus = cart.map((item) => {
        if (item == findCart) {
          notify(item.item_type)

          return { ...newItem, quantity: quan }
        } else {
          return item
        }
      })

      setCart(plus)
    }
  }

  //購物車商品+1
  const plusQuan = (cart, id, category) => {
    const newCart = cart.map((item) => {
      if (item.item_id == id && item.item_type == category) {
        return { ...item, quantity: item.quantity + 1 }
      } else {
        return item
      }
    })
    setCart(newCart)
  }
  //購物車商品-1
  const minusQuan = (cart, id, category, name) => {
    const findItem = cart.find((item) => {
      return item.item_id === id && item.item_type === category
    })
    if (findItem.quantity === 1) {
      removeItem(cart, id, category, name)
    } else {
      const newCart = cart.map((item) => {
        if (item.item_id === id && item.item_type === category) {
          return { ...item, quantity: item.quantity - 1 }
        } else {
          return item
        }
      })
      setCart(newCart)
    }
  }

  //imput text set

  const textNumSet = (cart, id, name, category, stock, modifiedNum) => {
    const newCart = cart.map((item) => {
      if (item.item_id === id && item.item_type === category) {
        if (modifiedNum >= stock) {
          handleStock(name, stock)
          return { ...item, quantity: stock }
        } else {
          return { ...item, quantity: modifiedNum }
        }
      } else {
        return item
      }
    })
    setCart(newCart)
  }
  //remove item
  const removeItem = (cart, id, category, name) => {
    const newCart = cart.filter((item) => {
      return item.item_id != id || item.item_type != category
    })

    MySwal.fire({
      title: (
        <>{`確定把${category == 'product' ? '商品' : '課程'}移出購物車？`}</>
      ),
      text: `${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#003e52',
      cancelButtonColor: '#808080',
      confirmButtonText: '確定',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success(
          `已將 ${category == 'product' ? '商品' : '課程'} 移出購物車`
        )
        setCart(newCart)
      }
    })
  }

  // subTotalPrice
  const subTotalPrice = (checked) => {
    const price = checked.reduce((acc, item) => {
      return (acc += item.quantity * item.item_price)
    }, 0)

    return handleThousand(price)
  }
  // totalPrice
  const totalPrice = (checked) => {
    return checked.reduce((acc, item) => {
      return (acc += item.item_price * item.quantity)
    }, 0)
  }

  // totalItems
  const totalItems = (cart) => {
    return cart.reduce((acc, item) => {
      return (acc += item.quantity)
    }, 0)
  }

  //handle thousand
  const handleThousand = (num) => {
    const newNum = num.toString()
    return newNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  //checkbox toggle
  const chekboxToggle = (cart, id, category) => {
    const newCart = cart.map((item) => {
      if (item.item_id == id && item.item_type == category) {
        return { ...item, checked: !item.checked }
      }
      return item
    })
    setCart(newCart)
  }
  //filter checked

  const handleChecked = (cart) => {
    return cart.filter((item) => {
      return item.checked
    })
  }

  return (
    <CartContext.Provider
      value={{
        addItem,
        cart,
        setCart,
        Toaster,
        plusQuan,
        minusQuan,
        removeItem,
        textNumSet,
        subTotalPrice,
        totalItems,
        productItems,
        productLength,
        courseItems,
        courseLength,
        handleThousand,
        chekboxToggle,
        handleChecked,
        totalPrice,
        checkedCart,
        addItemDetail,
        handleStock,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
export const useCart = () => useContext(CartContext)
