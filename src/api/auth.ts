import { supabase } from "../config/supabase";

// 🔐 SIGN UP
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

// 🔓 SIGN IN
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

// 🚪 SIGN OUT
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
