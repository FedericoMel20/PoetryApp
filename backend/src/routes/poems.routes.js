import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// GET all poems
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("poems")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch poems" });
  }
});

// ✅ ADD NEW POEM
router.post("/", async (req, res) => {
  const { title, content, author, category, image } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      error: "Title and content are required",
    });
  }

  try {
    const { data, error } = await supabase
      .from("poems")
      .insert([
        {
          title,
          content,
          author: author || "Anonymous",
          category,
          image,
          rating: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create poem" });
  }
});

export default router;
