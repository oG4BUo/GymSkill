"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sampleUsers, skillCatalog } from "@/data/mock-data";
import { useApp } from "@/components/providers/app-provider";
import { Avatar } from "@/components/ui/avatar";
import { SkillCard } from "@/components/skills/skill-card";
import { PostCard } from "@/components/posts/post-card";
import { FollowButton } from "@/components/users/follow-button";
import { FollowListSheet } from "@/components/users/follow-list-sheet";
import { getFollowers, getFollowing } from "@/lib/follow-stats";
import { getSkillById } from "@/lib/skill-directory";
import type { SkillStatus } from "@/types";

type FollowSheetKind = "followers" | "following" | null;

const statuses: { value: SkillStatus; label: string; icon: string; iconPanel: string }[] = [
  { value: "mastered", label: "習得済み", icon: "✓", iconPanel: "bg-emerald-500" },
  { value: "practicing", label: "練習中", icon: "↗", iconPanel: "bg-sky-500" },
  { value: "wish", label: "習得したい", icon: "✦", iconPanel: "bg-violet-500" },
];

export function UserProfile({ id }: { id: string }) {
  const router = useRouter();
  const user = sampleUsers.find((item) => item.id === id);
  const { posts, follows } = useApp();
  const userPosts = useMemo(() => posts.filter((post) => post.authorId === id), [posts, id]);
  const [followSheet, setFollowSheet] = useState<FollowSheetKind>(null);
  const followers = useMemo(() => getFollowers(id, follows, sampleUsers), [follows, id]);
  const following = useMemo(() => getFollowing(id, follows, sampleUsers), [follows, id]);

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="font-bold">選手が見つかりません</p>
        <button type="button" onClick={() => router.back()} className="mt-4 text-sm text-sky-600">
          戻る
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="flex h-15 items-center border-b border-slate-100 px-4">
        <button type="button" onClick={() => router.back()} aria-label="戻る" className="mr-3 text-xl text-slate-500">
          ‹
        </button>
        <h1 className="text-xl font-bold">プロフィール</h1>
      </header>

      <section className="px-4 py-6">
        <div className="flex items-center gap-4">
          <Avatar user={user} size="lg" />
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-slate-500">
              @{user.handle} · {user.country}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-700">{user.bio}</p>
        <div className="mt-5 flex items-center gap-6 border-y border-slate-100 py-3">
          <div>
            <p className="font-bold">{userPosts.length}</p>
            <p className="text-xs text-slate-400">投稿</p>
          </div>
          <div>
            <p className="font-bold">{user.skills.length}</p>
            <p className="text-xs text-slate-400">登録した技</p>
          </div>
          <button type="button" onClick={() => setFollowSheet("followers")} className="text-left">
            <p className="font-bold">{followers.length}</p>
            <p className="text-xs text-slate-400">フォロワー</p>
          </button>
          <button type="button" onClick={() => setFollowSheet("following")} className="text-left">
            <p className="font-bold">{following.length}</p>
            <p className="text-xs text-slate-400">フォロー中</p>
          </button>
        </div>
        <div className="mt-4">
          <FollowButton userId={user.id} />
        </div>
      </section>

      <section className="px-4 pb-7">
        <h2 className="mb-4 font-bold">マイスキル</h2>
        <div className="space-y-5">
          {statuses.map((status) => {
            const entries = user.skills.filter((entry) => entry.status === status.value);
            if (!entries.length) return null;
            return (
              <div key={status.value}>
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm ${status.iconPanel}`}
                  >
                    {status.icon}
                  </span>
                  <p className="text-xs font-bold text-slate-400">
                    {status.label}
                    <span className="ml-2 text-slate-400">{entries.length}</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {entries.map((entry) => {
                    const skill = getSkillById(entry.skillId, skillCatalog);
                    if (!skill) return null;
                    return (
                      <Link key={entry.skillId} href={`/skills/${entry.skillId}`} className="block">
                        <SkillCard skill={skill} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {!user.skills.length && (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-5 text-center text-sm text-slate-400">
              まだ技が登録されていません。
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-slate-100 pt-2">
        <h2 className="px-4 pb-2 pt-3 text-sm font-bold text-slate-900">投稿 ({userPosts.length})</h2>
        {userPosts.length ? (
          userPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="px-4 py-6 text-center text-sm text-slate-400">まだ投稿がありません。</p>
        )}
      </section>

      <FollowListSheet
        open={followSheet !== null}
        title={followSheet === "followers" ? `${user.name}のフォロワー` : `${user.name}のフォロー中`}
        users={followSheet === "followers" ? followers : following}
        onClose={() => setFollowSheet(null)}
      />
    </>
  );
}
