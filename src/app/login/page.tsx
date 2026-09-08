"use client";

import { Suspense, useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, signUp, type AuthActionState } from "./actions";

const initialState: AuthActionState = { error: null };

function ConfirmEmailMessage() {
  const searchParams = useSearchParams();
  if (searchParams.get("message") !== "confirm-email") return null;
  return (
    <p className="mb-4 rounded-xl bg-sky-50 px-3 py-2.5 text-sm text-sky-700">
      確認メールを送信しました。メール内のリンクを開いてから、ログインしてください。
    </p>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [signInState, signInAction, signInPending] = useActionState(signIn, initialState);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initialState);

  const state = mode === "login" ? signInState : signUpState;
  const action = mode === "login" ? signInAction : signUpAction;
  const pending = mode === "login" ? signInPending : signUpPending;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-black tracking-tight text-slate-900">
            Gym<span className="text-sky-600">Skill</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">今日の練習を、次の力に。</p>
        </div>

        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={
              mode === "login"
                ? "flex-1 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white"
                : "flex-1 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-500"
            }
          >
            ログイン
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={
              mode === "signup"
                ? "flex-1 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white"
                : "flex-1 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-500"
            }
          >
            新規登録
          </button>
        </div>

        <Suspense fallback={null}>
          <ConfirmEmailMessage />
        </Suspense>

        <form action={action} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-slate-700">メールアドレス</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-slate-700">パスワード</span>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            />
          </label>

          {state.error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-sky-600 py-3 font-bold text-white shadow-sm disabled:opacity-50"
          >
            {pending ? "処理中…" : mode === "login" ? "ログイン" : "新規登録する"}
          </button>
        </form>
      </div>
    </div>
  );
}
