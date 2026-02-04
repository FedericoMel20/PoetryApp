const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;


const dataPath = path.resolve(__dirname, "../src/data/poemsData.json");

// Middleware to allow frontend access
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Root route (optional)
app.get("/", (req, res) => {
  res.send(" Poetry API is running...");
});


app.get("/api/poems", (req, res) => {
  try {
    const data = fs.readFileSync(dataPath, "utf8");
    const poems = JSON.parse(data);
    res.json(poems);
  } catch (err) {
    console.error("❌ Error reading poems data:", err);
    res.status(500).json({ error: "Failed to read poems data." });
  }
});

app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
