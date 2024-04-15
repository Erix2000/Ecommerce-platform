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
      "SELECT `item_id` FROM `item_user` WHERE `user_id`= ? AND `item_type` = ?",
      [user_id, 'course']
    );
    res.status(200).json(likeResult);
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

// 加入收藏
router.post("/clike", authenticate, async (req, res) => {
  const { user_id, item_id } = req.body;
  console.log(user_id, item_id)

  try {
    const [results, field] = await connection.execute(
      "INSERT INTO item_user (user_id, item_id, item_type) VALUE (?, ?, ?)",
      [user_id, item_id, 'course']
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

// 刪除收藏
router.delete("/clike", authenticate, async (req, res) => {
  const { user_id, item_id } = req.body;
  try {
    const [resultsHas, fieldHas] = await connection.execute(
      "DELETE FROM item_user WHERE user_id = ? and item_id = ? and item_type = ?",
      [user_id, item_id, 'course']
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

//課程列表頁路由
router.get("/:category", async (req, res) => {
  const { category } = req.params;
  const { sort, search, pricemin, pricemax, tag } = req.query;
  console.log(sort);

  // 先判斷有沒有要做篩選
  let courses = [];
  if (category !== "list") {

    if (!sort && !search && !tag) {
      // 如果沒有篩選就取得全部商品資料
      const [coursesResult, coursesField] = await connection
        .execute("SELECT * FROM `course_list` WHERE `course_category_id` = ?", [category])
        .then((courseResult) => {
          return courseResult;

        })
        .catch((err) => {
          console.log(err);
          return [[], []];
        });
      courses = coursesResult

    } else {
      // console.log(sort)
      // console.log(search)
      // console.log(pricemax)
      // console.log(pricemin)



      let sqlTotal = "SELECT * FROM `course_list` WHERE `course_category_id` = ?"

      // 搜尋條件
      if (search) {
        sqlTotal += ` AND \`course_name\` LIKE '%${search}%'`;
      }

      // 價格範圍條件
      if (pricemin && pricemax) {
        if (search) {
          sqlTotal += ` AND \`course_price\` >= ${pricemin} AND \`course_price\` <= ${pricemax}`;

        } else {
          sqlTotal += ` AND \`course_price\` >= ${pricemin} AND \`course_price\` <= ${pricemax}`;
        }

      }



      // 如果陣列裡面有包含五以上
      let arr4 = '"';
      let arr5 = '"';

      // 遍历数字数组，根据条件将数字放入对应的字符串中
      if (tag) {
        // 把tag變成數字陣列
        let tagArr = tag.split(",").map(i => parseInt(i.trim()))
        tagArr.forEach(num => {
          if (num >= 5) {
            arr5 += (arr5 !== '"' ? ',"' : '') + num + '"';
          } else if (num >= 4) {
            // arr5 += (arr5 !== '"' ? ',"' : '') + num + '"'
          } else {
            arr4 += (arr4 !== '"' ? ',"' : '') + num + '"';
          }
        });

        if (!search && !pricemin && !pricemax) {
          if (arr5 !== '"') {
            sqlTotal += ` WHERE \`course_location_id\` IN (${arr5})`
          }

          if (arr4 !== '"') {
            sqlTotal += ` WHERE \`course_type_id\` IN (${arr4})`
          }

        } else {
          if (arr5 !== '"') {
            sqlTotal += ` AND \`course_location_id\` IN (${arr5})`
          }

          if (arr4 !== '"') {
            sqlTotal += ` AND \`course_type_id\` IN (${arr4})`
          }
        }

        console.log(arr4)
        console.log(arr5)
      }


      // 排序條件
      if (sort === '2') {
        console.log(22222)
        sqlTotal += ` ORDER BY \`course_price\` DESC`

      } else if (sort === '1') {
        console.log(11111)
        sqlTotal += ` ORDER BY \`course_price\` ASC`

      } else if (sort === '3') {
        console.log(11111)

        sqlTotal += ` AND \`course_date_start\` BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)`



      } else if (sort === '4') {
        console.log(11111)

        sqlTotal += ` AND \`course_date_start\` BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 MONTH)`



      } else {
        sqlTotal += ``
      }


      console.log(sqlTotal)

      const [coursesResult, coursesFeild] = await connection
        .execute(`${sqlTotal}`, [category])
        .then((courseResult) => {
          return courseResult;
        })
        .catch((err) => {
          console.log(err);
          return [[], []];
        });
      courses = coursesResult
    }

    // 取得bread (品牌分類)
    const [bread, breadField] = await connection
      .execute("SELECT `course_category` FROM `course_bread` WHERE `bread_id`= ?", [category])
      .then((breadResult) => {
        return breadResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    // //取得課程種類(手沖、拉花、烘豆、證照)
    // const [courseCategory, courseCategoryField] = await connection
    //   .execute("SELECT * FROM `course_category` WHERE `course_list` = ?", [category])
    //   .then((classResult) => {
    //     return classResult;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     return [[], []];
    //   });

    // //取得課程教室地點
    // const [location, locationField] = await connection
    //   .execute("SELECT * FROM `course_list` WHERE `course_location_id` = ?", [`${category}%`,
    //   ])
    //   .then((locationResult) => {
    //     return locationResult;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     return [[], []];
    //   });

    res.json({
      courses: courses,
      bread: bread,
    });

  } else if (category && category === "list") {

    if (!sort && !search && !tag && !pricemin && !pricemax) {
      const [coursesResult, coursesFeild] = await connection
        .execute("SELECT * FROM `course_list`")
        .then((courseResult) => {
          return courseResult;
        })
        .catch((err) => {
          console.log(err);
          return [[], []];
        });
      courses = coursesResult;

    } else {

      let sqlTotal = "SELECT * FROM `course_list`"

      // 搜尋條件
      if (search) {
        sqlTotal += ` WHERE \`course_name\` LIKE '%${search}%'`;
      }

      // 價格範圍條件
      if (pricemin && pricemax) {
        if (search) {
          sqlTotal += ` AND \`course_price\` >= ${pricemin} AND \`course_price\` <= ${pricemax}`;

        } else {
          sqlTotal += ` WHERE \`course_price\` >= ${pricemin} AND \`course_price\` <= ${pricemax}`;
        }

      }



      // 如果陣列裡面有包含五以上
      let arr4 = '"';
      let arr5 = '"';

      if (tag) {
        // 把tag變成數字陣列
        let tagArr = tag.split(",").map(i => parseInt(i.trim()))
        // 遍历数字数组，根据条件将数字放入对应的字符串中
        tagArr.forEach(num => {
          if (num >= 5) {
            arr5 += (arr5 !== '"' ? ',"' : '') + num + '"';
          } else if (num >= 4) {
            // arr5 += (arr5 !== '"' ? ',"' : '') + num + '"'
          } else {
            arr4 += (arr4 !== '"' ? ',"' : '') + num + '"';
          }
        });
        // 確保標籤篩選條件與其他條件的連接關係
        let tagCondition = "";
        if (arr5 !== '"') {
          tagCondition += (tagCondition !== "" ? " AND " : "") + `\`course_location_id\` IN (${arr5})`;
        }

        if (arr4 !== '"') {
          tagCondition += (tagCondition !== "" ? " AND " : "") + `\`course_type_id\` IN (${arr4})`;
        }

        // 將標籤篩選條件添加到 SQL 查詢中
        sqlTotal += (tagCondition !== "" ? " AND " + tagCondition : "");

        console.log(arr4);
        console.log(arr5);
      }


      // 排序條件
      if (sort === '2') {
        console.log(22222)
        sqlTotal += ` ORDER BY \`course_price\` DESC`
      } else if (sort === '1') {
        console.log(11111)
        sqlTotal += ` ORDER BY \`course_price\` ASC`
      } else if (sort === '3') {
        console.log(11111)
        if (search) {
          sqlTotal += ` AND \`course_date_start\` BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)`

        } else {
          sqlTotal += ` WHERE \`course_date_start\` BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)`

        }


      } else if (sort === '4') {
        console.log(11111)
        if (search) {
          sqlTotal += ` AND \`course_date_start\` BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 MONTH)`

        } else {
          sqlTotal += ` WHERE \`course_date_start\` BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 MONTH)`
        }

      } else {
        sqlTotal += ``
      }


      console.log(sqlTotal)

      const [coursesResult, coursesFeild] = await connection
        .execute(`${sqlTotal}`)
        .then((courseResult) => {
          return courseResult;
        })
        .catch((err) => {
          console.log(err);
          return [[], []];
        });
      courses = coursesResult
    }
    // 取得bread (品牌分類)
    const [bread, breadField] = await connection
      .execute("SELECT `course_category` FROM `course_bread` WHERE `bread_id`= ?", ["0"])
      .then((breadResult) => {
        return breadResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    //  //取得課程種類(手沖、拉花、烘豆、證照)
    //  const [courseCategory, courseCategoryField] = await connection
    //    .execute("SELECT * FROM `course_category` WHERE `course_list` = ?", [category])
    //    .then((classResult) => {
    //      return classResult;
    //    })
    //    .catch((err) => {
    //      console.log(err);
    //      return [[], []];
    //    });

    //  //取得課程教室地點
    //  const [location, locationField] = await connection
    //    .execute("SELECT * FROM `course_list` WHERE `course_location_id` = ?", [`${category}%`,
    //    ])
    //    .then((locationResult) => {
    //      return locationResult;
    //    })
    //    .catch((err) => {
    //      console.log(err);
    //      return [[], []];
    //    });

    res.json({
      courses: courses,
      bread: bread,
    });
  } else {
    res.status(500).send("Invalid category");
  }

});

//課程細節頁的路由
router.get("/:category/?:cid", async (req, res) => {
  const { category } = req.params;
  const { cid } = req.params;

  if (category !== "" && cid !== "") {
    const [courseDetail, courseDetailField] = await connection
      .execute(
        "SELECT * FROM `course_list` JOIN lecturer ON course_list.exclusive_code = lecturer.exclusive_code WHERE `course_category_id` = ? and `course_id` = ?",
        [category, cid]
      )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
        return [[], []]
      })


    // 取得bread (品牌分類)
    let breadResult = [];
    if (category === "list") {
      const [bread, breadField] = await connection
        .execute("SELECT `course_category` FROM `course_bread` WHERE `bread_id`= ?", ['0'])
        .then((breadResult) => {
          return breadResult;
        })
        .catch((err) => {
          console.log(err);
          return [[], []];
        });
      breadResult = bread

    } else {
      const [bread, breadField] = await connection
        .execute("SELECT `course_category` FROM `course_bread` WHERE `bread_id`= ?", [category])
        .then((breadResult) => {
          return breadResult;
        })
        .catch((err) => {
          console.log(err);
          return [[], []];
        });
      breadResult = bread

    }


    // 取得評論
    const [comment, commentFeild] = await connection
      .execute("SELECT comment.*,course_list.course_id,user.user_name FROM `comment` INNER JOIN `course_list` ON comment.item_id = course_list.course_id INNER JOIN `user` ON comment.user_id = user.user_id WHERE course_list.course_id = ? AND comment.item_type = ? AND comment.comment_valid = 1", [cid, 'course'])
      .then((commentResult) => {
        return commentResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });


    res.json({ courseDetail: courseDetail, comment: comment, bread: breadResult });
  } else {
    res.status(500).send("Invalid category");
  }
});

export default router;
