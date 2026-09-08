import { createBrowserClient } from "@supabase/ssr";

/**
 * ブラウザ側（"use client" のコンポーネント）から使うSupabaseクライアント。
 * ここで使うキーは「anon key（匿名キー）」で、これは公開されても問題ない設計のキーです。
 * 秘密鍵（service_role key）は絶対にここでは使いません。
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
