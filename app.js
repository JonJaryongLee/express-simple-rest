/**
 * @module expressApp
 * @requires express
 * @requires sqlite3
 * @requires cors
 */

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

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
      }
    }
  );
});

/**
 * @api {get} /api/articles 모든 게시글 요청
 * @apiName GetArticles
 * @apiGroup Article
 *
 * @apiSuccess {Article[]} articles 게시글 리스트.
 */
app.get("/api/articles", (req, res) => {
  db.all("SELECT * FROM article", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (rows.length == 0) {
      res.status(404).json({ error: "No articles found" });
      return;
    }
    res.json(rows);
  });
});

/**
 * @api {get} /api/articles/:id 특정 게시글 요청
 * @apiName GetArticle
 * @apiGroup Article
 *
 * @apiParam {Number} id 게시글의 고유 ID.
 *
 * @apiSuccess {Article} article 게시글 객체.
 */
app.get("/api/articles/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM article WHERE id = ?", id, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.json(row);
  });
});

/**
 * @api {post} /api/articles 게시글 생성
 * @apiName PostArticle
 * @apiGroup Article
 *
 * @apiParam {String} title 게시글 제목.
 * @apiParam {String} content 게시글 내용.
 *
 * @apiSuccess {Number} id 새로 생성된 게시글의 ID.
 */
app.post("/api/articles", (req, res) => {
  const { title, content } = req.body;

  if (!title || !title.trim()) {
    res.status(400).json({ error: "Title is required and cannot be blank" });
    return;
  }

  if (!content || !content.trim()) {
    res.status(400).json({ error: "Content is required and cannot be blank" });
    return;
  }

  db.run(
    "INSERT INTO article (title, content) VALUES (?, ?)",
    [title, content],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

/**
 * @api {put} /api/articles/:id 게시글 수정
 * @apiName PutArticle
 * @apiGroup Article
 *
 * @apiParam {Number} id 게시글의 고유 ID.
 * @apiParam {String} title 게시글 제목.
 * @apiParam {String} content 게시글 내용.
 *
 * @apiSuccess {Number} id 수정된 게시글의 ID.
 */
app.put("/api/articles/:id", (req, res) => {
  const { title, content } = req.body;
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ error: "ID is required" });
    return;
  }

  if (!title || !title.trim()) {
    res.status(400).json({ error: "Title is required and cannot be blank" });
    return;
  }

  if (!content || !content.trim()) {
    res.status(400).json({ error: "Content is required and cannot be blank" });
    return;
  }

  db.run(
    "UPDATE article SET title = ?, content = ? WHERE id = ?",
    [title, content, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes == 0) {
        res.status(404).json({ error: "Article not found" });
        return;
      }
      res.json({ id: id });
    }
  );
});

/**
 * @api {delete} /api/articles/:id 게시글 삭제
 * @apiName DeleteArticle
 * @apiGroup Article
 *
 * @apiParam {Number} id 게시글의 고유 ID.
 *
 * @apiSuccess {Number} id 삭제된 게시글의 ID.
 */
app.delete("/api/articles/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM article WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes == 0) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.json({ id: id });
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
