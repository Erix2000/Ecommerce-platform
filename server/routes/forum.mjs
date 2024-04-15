import express from "express";
import connection from "../db_connect/db.mjs";
import authenticate from "../middleware/authenticate.mjs";

const router = express.Router();

// 取得使用者收藏資料 // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
router.post("/user-like", authenticate, async (req, res) => {
  const { category, user_id } = req.body;
  console.log(category, user_id);

  try {
    const [likeResult, likeField] = await connection.execute(
      "SELECT article_id from user_article WHERE user_id = ? ",
      [user_id]
    );
    res.status(200).json(likeResult);
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

// 加入收藏
router.post("/flike", authenticate, async (req, res) => {
  const { user_id, forum_id } = req.body;
  console.log(user_id, forum_id);

  try {
    const [results, field] = await connection.execute(
      "INSERT INTO user_article (user_id, article_id) VALUE (?, ?)",
      [user_id, forum_id]
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

// 刪除收藏
router.delete("/flike", authenticate, async (req, res) => {
  const { user_id, forum_id } = req.body;
  try {
    const [resultsHas, fieldHas] = await connection.execute(
      "DELETE FROM user_article WHERE user_id = ? and article_id = ? ",
      [user_id, forum_id]
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

// 文章列表頁路由 // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
router.get("/:category", async (req, res) => {
  const { category } = req.params;
  console.log(category);
  const { sort } = req.query;
  console.log(sort);

  // 先判斷有沒有要做篩選
  let forumResult = [];
  if (category && category !== "list") {
    // 取得文章資料
    if (!sort) {
      const [forums, forumsFeild] = await connection
        .execute(
          `SELECT
              forum_list.forum_id,
              forum_list.forum_title,
              forum_list.forum_introduce,
              forum_list.forum_img,
              forum_list.forum_hastag,
              forum_list.forum_category_id,
              DATE_FORMAT(forum_list.forum_modified_at, '%Y-%m-%d') AS forum_modified_at,
              forum_category.forum_category_name,
              lecturer.*
              FROM forum_list
              JOIN forum_category ON forum_list.forum_category_id = forum_category.forum_category_id
              JOIN lecturer ON forum_list.exclusive_code = lecturer.exclusive_code
              WHERE forum_list.forum_category_id =?`,
          [category]
        )
        .then((forumResult) => {
          return forumResult;
        })
        .catch((err) => {
          console.log(err);
          return [[], []];
        });
      forumResult = forums;
    } else {
      console.log("sort");
      let sqlTotal = `SELECT
      forum_list.forum_id,
      forum_list.forum_title,
      forum_list.forum_introduce,
      forum_list.forum_img,
      forum_list.forum_hastag,
      forum_list.forum_category_id,
      DATE_FORMAT(forum_list.forum_modified_at, '%Y-%m-%d') AS forum_modified_at,
      forum_category.forum_category_name,
      lecturer.*
      FROM forum_list
      JOIN forum_category ON forum_list.forum_category_id = forum_category.forum_category_id
      JOIN lecturer ON forum_list.exclusive_code = lecturer.exclusive_code
      WHERE forum_list.forum_category_id =?`;

      // 排序條件
      if (sort == "1") {
        sqlTotal += ` ORDER BY \`forum_modified_at\` DESC`;
      } else if (sort == "2") {
        sqlTotal += ` ORDER BY \`forum_modified_at\` ASC`;
      } else {
        sqlTotal += ``;
      }

      // console.log(sqlTotal);

      const [forums, forumsFeild] = await connection
        .execute(`${sqlTotal}`, [category])
        .then((forumResult) => {
          return forumResult;
        })
        .catch((err) => {
          console.log(err);
          return [[], []];
        });
      forumResult = forums;
      // console.log(sqlTotal);
    }

    // 取得forum_category (文章類別名稱、id)
    const [kind, kindFeild] = await connection
      .execute("SELECT * FROM `forum_category` WHERE `forum_category_id` = ?", [
        category,
      ])
      .then((kindResult) => {
        return kindResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    // console.log({
    //   forums: forums,
    //   kind: kind,
    // });
    res.json({
      forums: forumResult,
      kind: kind,
    });
  } else if (category && category === "list") {
    if (!sort) {
      // 取得全部專欄文章資料
      const [forums] = await connection

        //.execute("SELECT * FROM `forum_list`")
        .execute(
          `SELECT
            forum_list.forum_id,
            forum_list.forum_title,
            forum_list.forum_introduce,
            forum_list.forum_img,
            forum_list.forum_hastag,
            forum_list.forum_category_id,
            DATE_FORMAT(forum_list.forum_modified_at, '%Y-%m-%d') AS forum_modified_at,
            forum_category.forum_category_name,
            lecturer.*
            FROM forum_list
            JOIN forum_category ON forum_list.forum_category_id = forum_category.forum_category_id
            JOIN lecturer ON forum_list.exclusive_code = lecturer.exclusive_code`,
          [category]
        )
        .then((result) => {
          return result;
        })
        .catch((err) => {
          console.log(err);
          return [[], []];
        });
        forumResult = forums;
    } else {
      let sqlTotal = `SELECT
        forum_list.forum_id,
        forum_list.forum_title,
        forum_list.forum_introduce,
        forum_list.forum_img,
        forum_list.forum_hastag,
        forum_list.forum_category_id,
        DATE_FORMAT(forum_list.forum_modified_at, '%Y-%m-%d') AS forum_modified_at,
        forum_category.forum_category_name,
        lecturer.*
        FROM forum_list
        JOIN forum_category ON forum_list.forum_category_id = forum_category.forum_category_id
        JOIN lecturer ON forum_list.exclusive_code = lecturer.exclusive_code`;
      // 排序條件
      if (sort == "1") {
        sqlTotal += ` ORDER BY \`forum_modified_at\` DESC`;
      } else if (sort == "2") {
        sqlTotal += ` ORDER BY \`forum_modified_at\` ASC`;
      } else {
        sqlTotal += ``;
      }
      // 取得全部專欄文章資料
      const [forums, forumsFeild] = await connection

        //.execute("SELECT * FROM `forum_list`")
        .execute(`${sqlTotal}`, [category])
        .then((result) => {
          return result;
        })
        .catch((err) => {
          console.log(err);
          return [[], []];
        });
        forumResult = forums;
    }

    // 取得forum_category (文章類別名稱、id)
    const [kind, kindFeild] = await connection
      .execute("SELECT * FROM `forum_category` WHERE `forum_category_id` = ?", [
        category,
      ])
      .then((kindResult) => {
        return kindResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    // console.log({
    //   forums: forums,
    //   kind: kind,
    // });
    res.json({
      forums: forumResult,
      kind: kind,
    });
  } else {
    res.status(400).send("Invalid category");
  }
});

// 文章細節頁路由 // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
router.get("/:category/?:fid", async (req, res) => {
  const { category } = req.params;
  const { fid } = req.params;
  if (category !== "" && fid !== "") {
    // 取得單一文章詳細資料
    const [forumDetail, forumDetailFeild] = await connection
      .execute(
        // "SELECT * FROM `forum_list` WHERE `forum_category_id` = ? and `forum_id` = ?",

        `SELECT
        forum_list.forum_id,
        forum_list.forum_title,
        forum_list.forum_introduce,
        forum_list.forum_article,
        forum_list.forum_img, 
        forum_list.forum_hastag,
        forum_list.forum_category_id,
        DATE_FORMAT(forum_list.forum_modified_at, '%Y-%m-%d') AS forum_modified_at, 
        forum_category.forum_category_name,
        lecturer.*
        FROM forum_list
        JOIN forum_category ON forum_list.forum_category_id = forum_category.forum_category_id
        JOIN lecturer ON forum_list.exclusive_code = lecturer.exclusive_code 
        WHERE forum_list.forum_category_id = ?
        AND forum_list.forum_id = ?`,
        [category, fid]
      )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    // 取得forum_category (文章類別名稱、id)
    const [kind, kindFeild] = await connection
      .execute("SELECT * FROM `forum_category` WHERE `forum_category_id` = ?", [
        category,
      ])
      .then((kindResult) => {
        return kindResult;
      })
      .catch((err) => {
        console.log(err);
        return [[], []];
      });

    res.json({ forumDetail: forumDetail, kind: kind });
  } else {
    res.status(400).send("Invalid category");
  }
});

export default router;
