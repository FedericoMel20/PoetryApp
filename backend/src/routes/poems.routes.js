import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// Debug route: run a minimal Supabase query and optionally return raw error
router.get("/debug", async (req, res) => {
  try {
    const { data, error } = await supabase.from("poems").select("id").limit(1);
    if (error) {
      const payload = { ok: false };
      if (req.query.debug === "true") payload.error = error;
      return res.status(500).json(payload);
    }
    res.json({ ok: true, sample: data });
  } catch (err) {
    console.error('Supabase debug error:', err);
    const payload = { ok: false };
    if (req.query.debug === "true") payload.error = err?.message || String(err);
    res.status(500).json(payload);
  }
});

// GET all poems
router.get("/", async (req, res) => {
  try {
    const { author_id } = req.query;

    let query = supabase.from("poems").select("*").order("created_at", { ascending: false });

    if (author_id) {
      query = query.eq("author_id", author_id);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Error fetching poems:', err);
    res.status(500).json({ error: "Failed to fetch poems" });
  }
});

// ✅ ADD NEW POEM
router.post("/", async (req, res) => {
  console.log("🔥 POST /api/poems hit");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  console.log("HEADERS:", req.headers);
  console.log("AUTH HEADER:", req.headers.authorization);

  const { title, content, category, image } = req.body;

  // 🔐 Get auth header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  console.log("👤 Auth result:", authData, authError);

  if (authError || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const { data, error } = await supabase
      .from("poems")
      .insert([
        {
          title,
          content,
          category,
          image,
          author: "Anonymous",
          author_id: user.id,
          rating: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error("Insert poem error:", err);
    res.status(500).json({ error: "Failed to create poem" });
  }
});

export default router;

// DELETE poem (owner only)
router.delete("/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    supabase.auth.setAuth(token);

    const { id } = req.params;
    console.log("🗑️ DELETE poem id:", id);

    const poemId = Number(id);

    if (!poemId) {
      return res.status(400).json({ error: "Invalid poem id" });
    }

    const { error } = await supabase.from("poems").delete().eq("id", poemId).eq("author_id", user.id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error("Delete poem error:", err);
    res.status(500).json({ error: "Failed to delete poem" });
  }
});

// UPDATE poem (owner only)
router.put("/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) return res.status(401).json({ error: "Unauthorized" });

    supabase.auth.setAuth(token);

    const { id } = req.params;
    const { title, content, category, image } = req.body;

    const { data, error } = await supabase
      .from("poems")
      .update({ title, content, category, image })
      .eq("id", id)
      .eq("author_id", user.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Update poem error:", err);
    res.status(500).json({ error: "Failed to update poem" });
  }
});
