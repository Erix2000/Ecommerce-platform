import path from 'path'
import { readFile, writeFile } from 'fs/promises'

/**
 * Fetching data from the JSON file and parse to JS data
 * @param {string} pathname
 * @returns {Promise<object>} A promise that contains json parse object
 */
export async function loadJson(pathname) {
  const data = await readFile(path.join(process.cwd(), pathname))
  return JSON.parse(data)
}

export async function insertOneToFile(pathname, prop, obj) {
  const data = await loadJson(pathname)
  if (!data || !data[prop]) {
    console.error('something wrong')
    return false
  }
  // data[node] should array?
  data[prop].push(obj)

  try {
    await writeFile(path.join(process.cwd(), pathname), JSON.stringify(data))
    return true
  } catch (e) {
    console.error('something wrong:', e)
    return false
  }
}
