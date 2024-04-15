import express from "express";
import connection from "../db_connect/db.mjs";
import authenticate from "../middleware/authenticate.mjs";

const router = express.Router();


// 取得使用者收藏資料
router.post("/user-like", authenticate, async (req, res) => {
  const { category, user_id } = req.body;
  console.log(category, user_id)

  try {
    const [likeResult, likeField] = await connection.execute(
      "SELECT item_id from item_user WHERE user_id = ? AND item_type = ?",
      [user_id, 'product']
    );
    res.status(200).json(likeResult);
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

// 加入收藏
router.post("/plike", authenticate, async (req, res) => {
  const { user_id, item_id } = req.body;
  console.log(user_id,item_id)

  try {
    const [results, field] = await connection.execute(
      "INSERT INTO item_user (user_id, item_id, item_type) VALUE (?, ?, ?)",
      [user_id, item_id, 'product']
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

// 刪除收藏
router.delete("/plike", authenticate, async (req, res) => {
  const { user_id, item_id } = req.body;
  try {
    const [resultsHas, fieldHas] = await connection.execute(
      "DELETE FROM item_user WHERE user_id = ? and item_id = ? and item_type = ?",
      [user_id, item_id, 'product']
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

// !!想要寫單一篩選可以參考這裡!!
// 排序的寫法 SELECT * FROM `product` WHERE `brand_id` = ? ORDER BY `product_price`
// 搜尋的寫法 SELECT * FROM `product` WHERE `product_name` LIKE '%宏都拉斯%' AND `brand_id` = ?
// 篩選的寫法SELECT product.*,tag_mapping.* FROM `product` INNER JOIN `tag_mapping` ON product.product_code = tag_mapping.product_code WHERE `brand_id` = ? AND `tag_code` = ?
// 跨欄位篩選"SELECT product.*,tag_mapping.* FROM `product` INNER JOIN `tag_mapping` ON product.product_code = tag_mapping.product_code WHERE `brand_id` = ? AND `tag_code` IN ('010204', '010103') GROUP BY `product_id` HAVING COUNT(*) > 1"
// 價錢AND `product_price` >= 300 AND `product_price` <= 335

// 下面有點亂，放一下我的結構
// 如果是個別品牌頁面
//   如果沒有篩選
//      選出個別品牌商品
//   如果有篩選
//      選出個別品牌篩選過後商品
//   取出個別品牌aside資料
//   取出個別品牌slide資料
//   匯出商品、aside、slide資料
// 如果是全部品牌頁面
//   如果沒有篩選
//      選出全部品牌商品
//   如果有篩選
//      選出全部品牌篩選過後商品
//   取出全部品牌aside資料
//   取出全部品牌slide資料
//   匯出商品、aside、slide資料

// 商品列表頁路由
router.get("/:category", async (req, res) => {
  const { category } = req.params;
  console.log(category);
  const { sort, tag, search, titlenum, pricemin, pricemax } = req.query;
  console.log(sort);

  // 先判斷有沒有要做篩選
  let products = []
  if (category && category !== "00") {
    
    if(!sort && !tag && !search && !titlenum && !pricemin && !pricemax){
      // 如果沒有篩選就取得全部商品資料
      const [productsResult, productsFeild] = await connection
      .execute("SELECT * FROM `product` WHERE `brand_id` = ?", [category])
      .then((productResult) => {
        return productResult;
        
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });
      products = productsResult

    }else{
      // 如果有篩選就取得篩選後的資料
      
      // 商品篩選會用到的句子
      // 主體SELECT product.*,tag_mapping.* FROM `product` INNER JOIN `tag_mapping` ON product.product_code = tag_mapping.product_code WHERE `brand_id` = ? 
      // 搜尋AND `product_name` LIKE '%咖啡豆%'
      // 價錢AND `product_price` >= 300 AND `product_price` <= 335
      // 篩選AND `tag_code` IN ('010204', '010103') GROUP BY `product_id`
      // 排序ORDER BY `product_price`(最後)

      // 注意事項:
      // 如果篩選選到一個種類:having>0，如果兩種:having>1，如果三種:having>2

      let sqlTotal = "SELECT product.*,tag_mapping.* FROM `product` INNER JOIN `tag_mapping` ON product.product_code = tag_mapping.product_code WHERE `brand_id` = ?"

      // 搜尋條件
      if (search) {
        sqlTotal += ` AND \`product_name\` LIKE '%${search}%'`;
      }

      // 價格範圍條件
      if (pricemin && pricemax) {
        sqlTotal += ` AND \`product_price\` >= ${pricemin} AND \`product_price\` <= ${pricemax}`
      }
      let tagArr = []
      // 標籤條件
      if (tag) {
        let tagArrN = ''
        if (tag.includes(',')) {
          tagArr = tag.split(',');
          tagArrN = tagArr.map(tag => `'${tag}'`).join(',');
          } else {
            tagArrN = `'${tag}'`;
          }
        sqlTotal += ` AND \`tag_code\` IN (${tagArrN})`;
        console.log(tagArr)
        
      }

      

      sqlTotal += ` GROUP BY \`product\`.\`product_id\``;

      if(tag){
        sqlTotal += ` HAVING COUNT(1) >= ${Number(titlenum)}`;
        // sqlTotal += ` HAVING COUNT(1) >= ${tagArr.length}`;
        console.log(tagArr.length)
      }

      // 排序條件
      if (sort === '2') {
        sqlTotal += ` ORDER BY \`product_price\` DESC`
      }else if(sort === '1'){
        sqlTotal += ` ORDER BY \`product_price\` ASC`
      }else{
        sqlTotal += ``
      }

      console.log(sqlTotal)
      

      const [productsResult, productsFeild] = await connection
      .execute(`${sqlTotal}` , [category])
      .then((productResult) => {
        return productResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });
      products = productsResult
    }
    

    // 取得slide圖片
    const [slides, slidesFeild] = await connection
      .execute("SELECT `brand_img` FROM `brand` WHERE `brand_id` = ?", [
        category,
      ])
      .then((slideResult) => {
        return slideResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    // 取得bread (品牌名稱、id)
    const [bread, breadFeild] = await connection
      .execute("SELECT * FROM `brand` WHERE `brand_id` = ?", [category])
      .then((breadResult) => {
        return breadResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    // 取得側邊欄上面
    const [brands, brandFeild] = await connection
      .execute("SELECT * FROM `brand`", [category])
      .then((brandResult) => {
        return brandResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    // 取得側邊欄下面
    const [tags, tagFeild] = await connection
      .execute("SELECT * FROM `tag_select` WHERE `tag_code` LIKE ?", [
        `${category}%`,
      ])
      .then((tagResult) => {
        return tagResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    // console.log({
    //   products: products,
    //   slides: slides,
    //   brands: brands,
    //   tags: tags,
    //   bread: bread,
    // });
    res.json({
      products: products,
      slides: slides,
      brands: brands,
      tags: tags,
      bread: bread,
    });
  } else if (category && category === "00") {
   
    if(!sort && !tag && !search && !titlenum && !pricemin && !pricemax){
      // 如果沒有篩選就取得全部商品資料
      const [productsResult, productsFeild] = await connection
      .execute("SELECT * FROM `product`")
      .then((productResult) => {
        return productResult;
        
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });
      products = productsResult

    }else{
      // 如果有篩選就取得篩選後的資料
     
      let sqlTotal = "SELECT product.*,tag_mapping.* FROM `product` INNER JOIN `tag_mapping` ON product.product_code = tag_mapping.product_code"

      // 搜尋條件
      if (search) {
        sqlTotal += ` AND \`product_name\` LIKE '%${search}%'`;
      }

      // 價格範圍條件
      if (pricemin && pricemax) {
        sqlTotal += ` AND \`product_price\` >= ${pricemin} AND \`product_price\` <= ${pricemax}`
      }
      let tagArr = []
      // 標籤條件
      if (tag) {
        let tagArrN = []
        if (tag.includes(',')) {
          tagArr = tag.split(',');
          tagArrN = tagArr.map(tag => `'${tag}'`).join(',');
          } else {
            tagArrN = `'${tag}'`;
          }
        sqlTotal += ` AND \`tag_code\` IN (${tagArrN})`;
      }

      sqlTotal += ` GROUP BY \`product\`.\`product_id\``;

      if(tag){
        sqlTotal += ` HAVING COUNT(1) >= ${Number(titlenum)}`;
        console.log(tagArr.length)
      }

      // 排序條件
      if (sort === '2') {
        sqlTotal += ` ORDER BY \`product_price\` DESC`
      }else if(sort === '1'){
        sqlTotal += ` ORDER BY \`product_price\` ASC`
      }else{
        sqlTotal += ``
      }

      console.log(sqlTotal)
      

      const [productsResult, productsFeild] = await connection
      .execute(`${sqlTotal}`)
      .then((productResult) => {
        return productResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });
      products = productsResult
    }


    // 取得slide圖片
    const [slides, slidesFeild] = await connection
      .execute("SELECT `brand_img` FROM `brand` WHERE `brand_id` = ?", [
        category,
      ])
      .then((slideResult) => {
        return slideResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    // 取得bread (品牌名稱、id)
    const [bread, breadFeild] = await connection
      .execute("SELECT * FROM `brand` WHERE `brand_id` = ?", [category])
      .then((breadResult) => {
        return breadResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    // 取得側邊欄上面
    const [brands, brandFeild] = await connection
      .execute("SELECT * FROM `brand`", [category])
      .then((brandResult) => {
        return brandResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    // 取得側邊欄下面
    const [tags, tagFeild] = await connection
      .execute("SELECT * FROM `tag_select` WHERE `tag_code` LIKE ?", [
        `${category}%`,
      ])
      .then((tagResult) => {
        return tagResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    // console.log({
    //   products: products,
    //   slides: slides,
    //   brands: brands,
    //   tags: tags,
    //   bread: bread,
    // });

    res.json({
      products: products,
      slides: slides,
      brands: brands,
      tags: tags,
      bread: bread,
    });
  } else {
    res.status(500).send("Invalid category");
  }

  
  
  
});

// 商品細節頁路由
router.get("/:category/?:pcode", async (req, res) => {
  const { category } = req.params;
  const { pcode } = req.params;
  if (category !== "" && pcode !== "") {
    // 取得單一商品詳細資料
    const [productDetail, productDetailFeild] = await connection
      .execute(
        "SELECT * FROM `product` WHERE `brand_id` = ? and `product_code` = ?",
        [category, pcode]
      )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    // 取得側邊欄上面
    const [brands, brandFeild] = await connection
      .execute("SELECT * FROM `brand`", [category])
      .then((brandResult) => {
        return brandResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    // 取得bread (品牌名稱、id)
    const [bread, breadFeild] = await connection
      .execute("SELECT * FROM `brand` WHERE `brand_id` = ?", [category])
      .then((breadResult) => {
        return breadResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });


    // 取得評論
    const [comment, commentFeild] = await connection
      .execute("SELECT comment.*,product.product_code,user.user_name FROM `comment` INNER JOIN `product` ON comment.item_id = product.product_id INNER JOIN `user` ON comment.user_id = user.user_id WHERE product.product_code = ? AND item_type = ? AND comment_valid = '1'",[pcode,'product'])
      .then((commentResult) => {
        return commentResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    res.json({ productDetail: productDetail, brands: brands, bread: bread,comment:comment });
  } else {
    res.status(500).send("Invalid category");
  }
});

export default router;
