import cors from "cors";
import express from "express";
import poemsRoutes from "./routes/poems.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/poems", poemsRoutes);


// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "LOUD WHISPERS API is running",
  });
});

export default app;
