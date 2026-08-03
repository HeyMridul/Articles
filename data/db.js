// A tiny "database" that just reads and writes a JSON file.
// This keeps the project dependency-free and easy to inspect —
// open data/articles.json anytime to see your raw data.

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "articles.json");

function readArticles() {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    console.error("Failed to read articles.json:", err);
    return [];
  }
}

function writeArticles(articles) {
  fs.writeFileSync(DB_PATH, JSON.stringify(articles, null, 2), "utf-8");
}

function getAllArticles() {
  // Newest first
  return readArticles().sort((a, b) => b.createdAt - a.createdAt);
}

function getArticleById(id) {
  return readArticles().find((a) => a.id === id);
}

function createArticle({ title, content, tag }) {
  const articles = readArticles();
  const newArticle = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    title: title.trim(),
    content: content.trim(),
    tag: (tag || "General").trim(),
    createdAt: Date.now(),
    updatedAt: null,
  };
  articles.push(newArticle);
  writeArticles(articles);
  return newArticle;
}

function updateArticle(id, { title, content, tag }) {
  const articles = readArticles();
  const idx = articles.findIndex((a) => a.id === id);
  if (idx === -1) return null;

  articles[idx] = {
    ...articles[idx],
    title: title !== undefined ? title.trim() : articles[idx].title,
    content: content !== undefined ? content.trim() : articles[idx].content,
    tag: tag !== undefined ? tag.trim() : articles[idx].tag,
    updatedAt: Date.now(),
  };
  writeArticles(articles);
  return articles[idx];
}

function deleteArticle(id) {
  const articles = readArticles();
  const filtered = articles.filter((a) => a.id !== id);
  const changed = filtered.length !== articles.length;
  if (changed) writeArticles(filtered);
  return changed;
}

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
