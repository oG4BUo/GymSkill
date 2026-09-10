import { createBrowserClient } from "@supabase/ssr";

/**
 * ブラウザ側（"use client" のコンポーネント）から使うSupabaseクライアント。
 * ここで使うキーは「publishable key（公開可能キー）」で、これは公開されても問題ない設計のキーです
 * （旧称: anon key。Supabaseの新しいAPIキー体系での呼び方です）。
 * 秘密鍵（secret key / service_role key）は絶対にここでは使いません。
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
