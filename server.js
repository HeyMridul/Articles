require("dotenv").config();
const express = require("express");
const path = require("path");

const articlesRouter = require("./routes/articles");
const authRouter = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// Basic safety checks so you don't accidentally run with insecure defaults
if (!process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
  console.error(
    "\n Missing ADMIN_PASSWORD or JWT_SECRET.\n" +
      "   Copy .env.example to .env and fill in your own values, then restart.\n"
  );
  process.exit(1);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/articles", articlesRouter);
app.use("/api", authRouter);

app.listen(PORT, () => {
  console.log(`\n DailyLog is running: http://localhost:${PORT}`);
  console.log(` Admin portal:        http://localhost:${PORT}/admin.html\n`);
});
