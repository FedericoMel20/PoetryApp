import cors from "cors";
import express from "express";
import commentsRoutes from "./routes/comments.routes.js";
import poemsRoutes from "./routes/poems.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/poems", poemsRoutes);
app.use("/api/comments", commentsRoutes);


// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "LOUD WHISPERS API is running",
  });
});

export default app;
