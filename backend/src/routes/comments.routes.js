import { createClient } from "@supabase/supabase-js";
import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// Helper to create authenticated client with user's token
const createAuthClient = (token) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  
  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
  
  return authClient;
};

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
    // Create authenticated client with user's token
    const authClient = createAuthClient(token);

    // Get user from token
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      console.error("Auth error:", authError);
      return res.status(401).json({ error: "Invalid token" });
    }

    // Insert comment with authenticated client
    const { error } = await authClient
      .from("comments")
      .insert([
        {
          poem_id,
          user_id: user.id,
          content,
          rating,
        },
      ]);

    if (error) {
      console.error("Insert error:", error);
      throw error;
    }

    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Comment POST error:", err);
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
    // Create authenticated client with user's token
    const authClient = createAuthClient(token);

    // Get user from token
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      console.error("Auth error:", authError);
      return res.status(401).json({ error: "Invalid token" });
    }

    // Delete comment with authenticated client (RLS will enforce owner check)
    const { data, error } = await authClient
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Delete error:", error);
      throw error;
    }

    res.json({ success: true, deleted: data });
  } catch (err) {
    console.error("Comment DELETE error:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

export default router;
