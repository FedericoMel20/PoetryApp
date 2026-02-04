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
    const { data, error } = await supabase
      .from("poems")
      .select("*")
      .order("created_at", { ascending: false });

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

  const { title, content, author, category, image } = req.body;

  // 🔐 Get auth header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = authHeader.replace("Bearer ", "");
  // 🔐 Get logged-in user (do not mutate client)
  const { data: authData, error: authError } = await supabase.auth.getUser(token);

  console.log("👤 Auth result:", authData, authError);

  const user = authData?.user;
  if (authError || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // Perform insert and let Postgres/Supabase return the raw error
  const { data: inserted, error: insertError } = await supabase
    .from("poems")
    .insert({
      title,
      content,
      author: author || "Anonymous",
      category,
      image,
      rating: 0,
      author_id: user.id,
    })
    .select()
    .single();

  console.log("🧾 INSERT RESULT:", inserted);
  console.log("❌ INSERT ERROR:", insertError);

  if (insertError) {
    return res.status(500).json({ error: "DB insert failed", details: insertError });
  }

  return res.status(201).json(inserted);
});

export default router;
