// 獲得我的最愛
export const getFavs = async () => {
  try {
    const response = await fetch(`${BASE_URL}/favorites`, {
      method: 'GET',
    })
    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    console.error('獲得我的最愛請求失敗:', error)
    return { data: null, error: error.message || '獲得我的最愛請求失敗' }
  }
}
