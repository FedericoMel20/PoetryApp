// src/api/poems.ts
import Constants from "expo-constants";
import { supabase } from "../config/supabase";


const BASE_URL =
  Constants.expoConfig?.extra?.API_URL ||
  "https://poetryapp-production.up.railway.app";

// GET all poems
export const getPoems = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/poems` );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching poems:", error);
    throw error;
  }
};

// GET poems by author id
export const getPoemsByAuthor = async (authorId: string) => {
  try {
    const url = `${BASE_URL}/api/poems?author_id=${encodeURIComponent(authorId)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching author's poems:", error);
    throw error;
  }
};

// ➕ POST new poem
export const addPoem = async (poem: {
  title: string;
  content: string;
  category?: string;
  image?: string;
}) => {
  const { data } = await supabase.auth.getSession();

  const session = data.session;

  if (!session) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${BASE_URL}/api/poems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(poem),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => null);
    throw new Error(text || "Failed to create poem");
  }

  return response.json();
};

export const deletePoem = async (id: number) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${BASE_URL}/api/poems/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => null);
    console.error("Delete error:", text);
    throw new Error("Failed to delete poem");
  }

  return true;
};

export const updatePoem = async (id: number, payload: { title?: string; content?: string; category?: string; image?: string }) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${BASE_URL}/api/poems/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(text || "Failed to update poem");
  }

  return res.json();
};
