// // 引入path模塊用於處理文件路徑
// import path from "path";
// // 引入url模塊的fileURLToPath方法，用於將URL轉換為文件路徑
// import { fileURLToPath } from "url";
// // 獲取當前文件的文件名
// const __filename = fileURLToPath(import.meta.url);
// // 獲取當前文件所在的目錄名
// const __dirname = path.dirname(__filename);
// // 引入dotenv模塊，用於從.env文件中加載環境變量到process.env
// import dotenv from "dotenv";

// // 引入fs/promises模塊的readFile和writeFile方法，用於進行文件的異步讀寫操作
// import { readFile, writeFile } from "fs/promises";

// /**
//  * 從JSON文件中讀取數據並解析為JS數據
//  * @param {string} pathname 文件路徑名
//  * @returns {Promise<object>} 包含解析後對象的Promise
//  */
// export const readJsonFile = async (pathname) => {
//   // 使用readFile異步讀取文件，並將路徑名與當前工作目錄結合
//   const data = await readFile(path.join(process.cwd(), pathname));
//   // 將讀取到的數據解析為JSON對象
//   return JSON.parse(data);
// };

// export const writeJsonFile = async (pathname, jsonOrObject, folder = "./") => {
//   try {
//     // 將傳入的數據轉換為字符串，如果是對象則先進行字符串化
//     const data =
//       typeof jsonOrObject === "object"
//         ? JSON.stringify(jsonOrObject)
//         : jsonOrObject;

//     // 使用writeFile異步寫入數據到指定文件，將文件路徑與當前工作目錄結合
//     await writeFile(path.join(process.cwd(), folder + pathname), data);
//     // 寫入成功返回true
//     return true;
//   } catch (e) {
//     // 發生錯誤時在控制台輸出錯誤信息
//     console.log(e);
//     // 寫入失敗返回false
//     return false;
//   }
// };

// // 讓console.log可以顯示文件與行號
// // 參考自https://stackoverflow.com/questions/45395369/how-to-get-console-log-line-numbers-shown-in-nodejs
// export const extendLog = () => {
//   /* eslint-disable */
//   ["log", "warn", "error"].forEach((methodName) => {
//     const originalMethod = console[methodName];
//     console[methodName] = (...args) => {
//       try {
//         throw new Error();
//       } catch (error) {
//         originalMethod.apply(console, [
//           error.stack // 獲取堆棧跟踪
//             .split("\n")[2] // 獲取第三行
//             .trim() // 去除空格
//             .substring(3) // 去除前三個字符("at ")
//             .replace(__dirname, "") // 移除腳本文件夾路徑
//             .replace(/\s\(./, " at ") // 將第一個括號替換為" at "
//             .replace(/\)/, ""), // 移除最後一個括號
//           "\n",
//           ...args,
//         ]);
//       }
//     };
//   });
//   /* eslint-enable  */
// };

// // 檢查空對象
// export const isEmpty = (obj) => {
//   /* eslint-disable */
//   for (var prop in obj) {
//     if (obj.hasOwnProperty(prop)) return false;
//   }
//   return JSON.stringify(obj) === JSON.stringify({});
//   /* eslint-enable  */
// };

// // 轉換字符串為kebab-case
// export const toKebabCase = (str) => {
//   return (
//     str &&
//     str
//       // 使用正則表達式匹配所有大寫字母、小寫字母及數字
//       .match(
//         /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
//       )
//       // 將匹配到的結果轉換為小寫
//       .map((x) => x.toLowerCase())
//       // 使用連字符將結果連接起來
//       .join("-")
//   );
// };

// // 加載.env文件
// export const loadEnv = (fileExt = "") => {
//   // 使用dotenv的config方法加載指定的.env文件
//   dotenv.config({ path: `${fileExt ? ".env" : ".env" + fileExt}` });
// };
