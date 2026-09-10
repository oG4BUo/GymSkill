import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * サーバー側（Server Components、Server Actions、middleware）から使うSupabaseクライアント。
 * ログイン状態は「Cookie」という仕組みでブラウザとサーバーの間でやり取りされます。
 * このファイルは、そのCookieを安全に読み書きするための橋渡し役です。
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Componentから呼ばれた場合、Cookieの書き込みはできません（読み取り専用）。
            // これは想定内のエラーなので無視します。実際の書き込みはmiddlewareが行います。
          }
        },
      },
    },
  );
}
