const express = require("express");
const router = express.Router();
const db = require("../data/db");
const { requireAdmin } = require("../middleware/auth");

// GET /api/articles  -> public, anyone can read
router.get("/", (req, res) => {
  res.json(db.getAllArticles());
});

// GET /api/articles/:id -> public, single article
router.get("/:id", (req, res) => {
  const article = db.getArticleById(req.params.id);
  if (!article) return res.status(404).json({ error: "Article not found." });
  res.json(article);
});

// POST /api/articles -> admin only, create new article
router.post("/", requireAdmin, (req, res) => {
  const { title, content, tag } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required." });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Content is required." });
  }

  const article = db.createArticle({ title, content, tag });
  res.status(201).json(article);
});

// PUT /api/articles/:id -> admin only, edit existing article
router.put("/:id", requireAdmin, (req, res) => {
  const { title, content, tag } = req.body;
  const updated = db.updateArticle(req.params.id, { title, content, tag });
  if (!updated) return res.status(404).json({ error: "Article not found." });
  res.json(updated);
});

// DELETE /api/articles/:id -> admin only
router.delete("/:id", requireAdmin, (req, res) => {
  const ok = db.deleteArticle(req.params.id);
  if (!ok) return res.status(404).json({ error: "Article not found." });
  res.json({ success: true });
});

module.exports = router;
