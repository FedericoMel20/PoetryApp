// src/api/poems.ts
import Constants from "expo-constants";
import { supabase } from "../config/supabase";


const BASE_URL =
  Constants.expoConfig?.extra?.API_URL ||
  "https://poetryapp-production.up.railway.app";

// GET all poems
export const getPoems = async () => {
  try {
    console.log("Fetching poems from:", `${BASE_URL}/api/poems`);

    const response = await fetch(`${BASE_URL}/api/poems`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching poems:", error);
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
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
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
    const err = await response.text();
    throw new Error(err);
  }

  return response.json();
};
