"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * このファイルの関数は、すべて「サーバー上」で実行されます（"use server"の宣言）。
 * つまり、パスワードなどの入力内容は、あなたのブラウザから直接Supabaseに送られるのではなく、
 * 一度サーバーを経由して安全に処理されます。パスワードをブラウザ側のJavaScriptで
 * 扱ったり、localStorageに保存したりすることは一切ありません。
 */

export type AuthActionState = { error: string | null };

export async function signUp(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "メールアドレスとパスワードを入力してください。" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: error.message };

  redirect("/login?message=confirm-email");
}

export async function signIn(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "メールアドレスとパスワードを入力してください。" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
