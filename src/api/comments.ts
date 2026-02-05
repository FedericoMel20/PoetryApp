import Constants from "expo-constants";
import { supabase } from "../config/supabase";

const BASE_URL =
  Constants.expoConfig?.extra?.API_URL ||
  "https://poetryapp-production.up.railway.app";

export async function getComments(poemId: number) {
  const res = await fetch(`${BASE_URL}/api/comments/${poemId}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function addComment(
  poemId: number,
  text: string,
  rating?: number
) {
  const session = (await supabase.auth.getSession()).data.session;
  if (!session) throw new Error("Not authenticated");

  const res = await fetch(`${BASE_URL}/api/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      poem_id: poemId,
      content: text,
      rating,
    }),
  });

  if (!res.ok) throw new Error("Failed to submit comment");
}

export async function deleteComment(commentId: number) {
  const session = (await supabase.auth.getSession()).data.session;
  if (!session) throw new Error("Not authenticated");

  const res = await fetch(`${BASE_URL}/api/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete comment");
}
