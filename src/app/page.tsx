"use client";
import { useMemo, useState } from "react";
import { skillCatalog } from "@/data/mock-data";
import { PostCard } from "@/components/posts/post-card"; import { useApp } from "@/components/providers/app-provider";
import { getGenderPriority } from "@/lib/gender-personalization";
import { getSkillById } from "@/lib/skill-directory";

type FeedTab = "forYou" | "following";

export default function Home() {
  const { currentUser, posts, followingUserIds } = useApp();
  const [tab, setTab] = useState<FeedTab>("forYou");
  const followingPosts = posts.filter((post) => followingUserIds.includes(post.authorId));
  const recommendedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const skillA = getSkillById(a.skillId, skillCatalog);
      const skillB = getSkillById(b.skillId, skillCatalog);
      const priorityA = getGenderPriority(currentUser.gender, skillA?.gender ?? "both");
      const priorityB = getGenderPriority(currentUser.gender, skillB?.gender ?? "both");
      return priorityA - priorityB;
    });
  }, [posts, currentUser.gender]);
  const visiblePosts = tab === "forYou" ? recommendedPosts : followingPosts;

  return (
    <>
      <header className="sticky top-0 z-10 flex h-15 items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur">
        <div>
          <p className="text-lg font-black tracking-tight text-slate-900">Gym<span className="text-sky-600">Skill</span></p>
          <p className="text-[11px] text-slate-400">今日の練習を、次の力に。</p>
        </div>
        <button aria-label="表示設定" className="rounded-full bg-slate-100 p-2 text-slate-500">☰</button>
      </header>
      <section>
        <div className="px-4 pb-2 pt-5">
          <h1 className="text-xl font-bold text-slate-900">みんなの練習</h1>
          <p className="mt-1 text-sm text-slate-500">一歩ずつの積み重ねを応援しよう。</p>
        </div>
        <div className="flex gap-2 px-4 pb-3">
          <button
            type="button"
            onClick={() => setTab("forYou")}
            aria-pressed={tab === "forYou"}
            className={tab === "forYou" ? "flex-1 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white" : "flex-1 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-500"}
          >
            おすすめ
          </button>
          <button
            type="button"
            onClick={() => setTab("following")}
            aria-pressed={tab === "following"}
            className={tab === "following" ? "flex-1 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white" : "flex-1 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-500"}
          >
            フォロー
          </button>
        </div>
        {tab === "following" && followingUserIds.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-bold text-slate-700">フォロー中のユーザーはいません</p>
            <p className="mt-2 text-sm text-slate-400">気になる選手をフォローすると、ここに投稿が表示されます。</p>
          </div>
        ) : (
          visiblePosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>
    </>
  );
}
