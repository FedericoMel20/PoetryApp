import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

/**
 * GET comments for a poem
 */
router.get("/:poemId", async (req, res) => {
  const { poemId } = req.params;

  try {
    const { data, error } = await supabase
      .from("comments")
      .select("id, content, rating, created_at, user_id")
      .eq("poem_id", poemId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const mapped = data.map((c) => ({
      id: c.id,
      text: c.content,
      rating: c.rating,
      user_id: c.user_id,
      user: "Anonymous",
    }));

    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load comments" });
  }
});

/**
 * POST a new comment / rating
 */
router.post("/", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const { poem_id, content, rating } = req.body;

  try {
    supabase.auth.setAuth(token);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) throw authError;

    const { error } = await supabase.from("comments").insert({
      poem_id,
      user_id: user.id,
      content,
      rating,
    });

    if (error) throw error;

    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit comment" });
  }
});

/**
 * DELETE a comment (owner only)
 */
router.delete("/:commentId", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const { commentId } = req.params;

  try {
    supabase.auth.setAuth(token);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) throw authError;

    const { data, error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, deleted: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

export default router;
