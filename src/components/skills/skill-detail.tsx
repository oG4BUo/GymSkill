"use client";

import { useState } from "react";
import Link from "next/link";
import { skillCatalog, sampleUsers } from "@/data/mock-data";
import { useApp } from "@/components/providers/app-provider";
import { PostCard } from "@/components/posts/post-card";
import { SkillUserListSheet } from "@/components/skills/skill-user-list-sheet";
import { getUsersBySkillStatus } from "@/lib/skill-stats";
import type { Apparatus, SkillDifficulty } from "@/types";

const difficultyLabel: Record<SkillDifficulty, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
  elite: "超上級",
};

const apparatusTheme: Record<Apparatus, { icon: string; background: string; accent: string }> = {
  ゆか: { icon: "⌁", background: "from-sky-500 to-indigo-600", accent: "text-sky-700 bg-sky-50" },
  跳馬: { icon: "⌃", background: "from-amber-500 to-orange-600", accent: "text-amber-700 bg-amber-50" },
  鉄棒: { icon: "⊹", background: "from-emerald-500 to-teal-600", accent: "text-emerald-700 bg-emerald-50" },
};

type SheetKind = "practicing" | "wish" | null;

export function SkillDetail({ id }: { id: string }) {
  const skill = skillCatalog.find((item) => item.id === id);
  const { posts } = useApp();
  const [sheet, setSheet] = useState<SheetKind>(null);

  if (!skill) {
    return (
      <div className="p-6 text-center">
        <p className="font-bold">技が見つかりません</p>
        <Link href="/profile" className="mt-4 inline-block text-sm text-sky-600">
          プロフィールへ戻る
        </Link>
      </div>
    );
  }

  const theme = apparatusTheme[skill.apparatus];
  const practicingUsers = getUsersBySkillStatus(skill.id, "practicing", sampleUsers);
  const wishUsers = getUsersBySkillStatus(skill.id, "wish", sampleUsers);
  const relatedPosts = posts.filter((post) => post.skillId === skill.id);

  return (
    <>
      <header className="flex h-15 items-center border-b border-slate-100 px-4">
        <Link href="/profile" aria-label="戻る" className="mr-3 text-xl text-slate-500">
          ‹
        </Link>
        <h1 className="text-xl font-bold">技の詳細</h1>
      </header>

      <section className="px-4 py-6">
        <div
          className={`relative flex aspect-[1.6] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${theme.background} shadow-inner`}
        >
          <span className="absolute -right-4 -top-6 text-8xl font-black text-white/10">{theme.icon}</span>
          <span
            aria-hidden
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-4xl text-white shadow-lg backdrop-blur-sm"
          >
            {theme.icon}
          </span>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">{skill.name}</h2>
        <div className="mt-2 flex items-center gap-2">
          <span className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${theme.accent}`}>{skill.apparatus}</span>
          <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
            {difficultyLabel[skill.difficulty]}
          </span>
        </div>
      </section>

      <section className="space-y-2 px-4 pb-2">
        <button
          type="button"
          onClick={() => setSheet("practicing")}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 text-left shadow-sm active:scale-[0.99]"
        >
          <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <span className="text-lg">🔥</span>この技を練習中
          </span>
          <span className="flex items-center gap-2 text-sm text-slate-500">
            {practicingUsers.length}人<span className="text-slate-300">›</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => setSheet("wish")}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 text-left shadow-sm active:scale-[0.99]"
        >
          <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <span className="text-lg">🎯</span>この技を習得したい
          </span>
          <span className="flex items-center gap-2 text-sm text-slate-500">
            {wishUsers.length}人<span className="text-slate-300">›</span>
          </span>
        </button>
      </section>

      <section className="mt-4 border-t border-slate-100 pt-2">
        <h2 className="px-4 pb-2 pt-3 text-sm font-bold text-slate-900">
          この技に関連する投稿 ({relatedPosts.length})
        </h2>
        {relatedPosts.length ? (
          relatedPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="px-4 py-6 text-center text-sm text-slate-400">関連投稿はまだありません。</p>
        )}
      </section>

      <SkillUserListSheet
        open={sheet !== null}
        title={sheet === "practicing" ? "この技を練習中の選手" : "この技を習得したい選手"}
        users={sheet === "practicing" ? practicingUsers : wishUsers}
        onClose={() => setSheet(null)}
      />
    </>
  );
}
