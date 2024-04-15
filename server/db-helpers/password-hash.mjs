import bcrypt from 'bcrypt'

const saltRounds = 10

// 生成哈希值
export const generateHash = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, saltRounds)
}

// 哈希值比對
export const compareHash = async (plainPassword, hash) => {
  return await bcrypt.compare(plainPassword, hash)
}
