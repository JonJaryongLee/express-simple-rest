/**
 * @module expressApp
 * @requires express
 * @requires sqlite3
 * @requires cors
 */
import express from "express";
import sqlite3Module from "sqlite3";
import cors from "cors";

const sqlite3 = sqlite3Module.verbose();

/**
 * @typedef Article
 * @property {number} id 게시글의 고유 ID.
 * @property {string} title 게시글 제목.
 * @property {string} content 게시글 내용.
 */

/**
 * @type {express.Application}
 */
const app = express();

/**
 * @type {sqlite3.Database}
 */
const db = new sqlite3.Database("mydb.sqlite");

app.use(cors());
app.use(express.json());

db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS article (
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
      db.get("SELECT COUNT(*) AS count FROM article", (err, row) => {
        if (err) {
          console.error(err.message);
          return;
        }
        if (row.count === 0) {
          db.run(
            `
            INSERT INTO article (title, content) VALUES
              ('안녕하세요', '처음 뵙겠습니다.'),
              ('가입인사드립니다.', '반갑습니다.'),
              ('코딩을 처음 배우기 시작했습니다.', '잘 부탁드립니다.')
          `,
            (err) => {
              if (err) {
                console.error(err.message);
                return;
              }
            }
          );
        }
      });
    }
  );
});

/**
 * @api {get} /api/v1/articles 모든 게시글 요청
 * @apiName GetArticles
 * @apiGroup Article
 *
 * @apiSuccess {Article[]} articles 게시글 리스트.
 */
app.get("/api/v1/articles", (req, res) => {
  db.all("SELECT * FROM article", (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "No articles found" });
    }
    return res.json(rows);
  });
});

/**
 * @api {get} /api/v1/articles/:id 특정 게시글 요청
 * @apiName GetArticle
 * @apiGroup Article
 *
 * @apiParam {Number} id 게시글의 고유 ID.
 *
 * @apiSuccess {Article} article 게시글 객체.
 */
app.get("/api/v1/articles/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM article WHERE id = ?", id, (err, row) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: "Article not found" });
    }
    return res.json(row);
  });
});

/**
 * @api {post} /api/v1/articles 게시글 생성
 * @apiName PostArticle
 * @apiGroup Article
 *
 * @apiParam {String} title 게시글 제목.
 * @apiParam {String} content 게시글 내용.
 *
 * @apiSuccess {Number} id 새로 생성된 게시글의 ID.
 */
app.post("/api/v1/articles", (req, res) => {
  const { title, content } = req.body;

  if (!title || !title.trim()) {
    return res
      .status(400)
      .json({ message: "Title is required and cannot be blank" });
  }

  if (!content || !content.trim()) {
    return res
      .status(400)
      .json({ message: "Content is required and cannot be blank" });
  }

  db.run(
    "INSERT INTO article (title, content) VALUES (?, ?)",
    [title, content],
    (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      return res.json({ id: this.lastID });
    }
  );
});

/**
 * @api {put} /api/v1/articles/:id 게시글 수정
 * @apiName PutArticle
 * @apiGroup Article
 *
 * @apiParam {Number} id 게시글의 고유 ID.
 * @apiParam {String} title 게시글 제목.
 * @apiParam {String} content 게시글 내용.
 *
 * @apiSuccess {Number} id 수정된 게시글의 ID.
 */
app.put("/api/v1/articles/:id", (req, res) => {
  const { title, content } = req.body;
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  if (!title || !title.trim()) {
    return res
      .status(400)
      .json({ message: "Title is required and cannot be blank" });
  }

  if (!content || !content.trim()) {
    return res
      .status(400)
      .json({ message: "Content is required and cannot be blank" });
  }

  db.run(
    "UPDATE article SET title = ?, content = ? WHERE id = ?",
    [title, content, id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Article not found" });
      }
      return res.json({ id: id });
    }
  );
});

/**
 * @api {delete} /api/v1/articles/:id 게시글 삭제
 * @apiName DeleteArticle
 * @apiGroup Article
 *
 * @apiParam {Number} id 게시글의 고유 ID.
 *
 * @apiSuccess {Number} id 삭제된 게시글의 ID.
 */
app.delete("/api/v1/articles/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM article WHERE id = ?", id, (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Article not found" });
    }
    return res.json({ id: id });
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
