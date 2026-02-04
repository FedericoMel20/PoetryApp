import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

let supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (typeof supabaseUrl === 'string') {
	supabaseUrl = supabaseUrl.replace(/\/+$/g, '');
}

if (!supabaseUrl || !supabaseKey) {
	console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');
	throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
