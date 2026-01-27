// src/api/poems.ts
import Constants from "expo-constants";


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
    return [];
  }
};

// ➕ POST new poem
export const addPoem = async (poem: {
  title: string;
  content: string;
  author?: string;
  category?: string;
  image?: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/api/poems`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(poem),
    });

    if (!response.ok) {
      throw new Error(`Failed to add poem (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error adding poem:", error);
    throw error;
  }
};
