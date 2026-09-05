"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { skillCatalog, sampleUsers } from "@/data/mock-data";
import { SkillBadge } from "@/components/skills/skill-badge";
import { Avatar } from "@/components/ui/avatar";
import { PostCard } from "@/components/posts/post-card";
import { useApp } from "@/components/providers/app-provider";
import type { Post, User } from "@/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { posts } = useApp();
  const normalized = query.trim().toLowerCase();
  const handleQuery = normalized.startsWith("@") ? normalized.slice(1) : normalized;

  const skills = useMemo(
    () =>
      normalized
        ? skillCatalog.filter(
            (skill) => skill.name.toLowerCase().includes(normalized) || skill.apparatus.toLowerCase().includes(normalized),
          )
        : skillCatalog,
    [normalized],
  );
  const skillIds = new Set(skills.map((skill) => skill.id));

  const users = useMemo(() => {
    if (!normalized) return [] as User[];
    const byId = new Map<string, User>();
    sampleUsers.forEach((user) => {
      const matchesSkill = user.skills.some((skill) => skillIds.has(skill.id));
      const matchesProfile = user.name.toLowerCase().includes(normalized) || user.handle.toLowerCase().includes(handleQuery);
      if (matchesSkill || matchesProfile) byId.set(user.id, user);
    });
    return [...byId.values()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalized, handleQuery, skills]);

  const matchingPosts = useMemo(() => {
    if (!normalized) return [] as Post[];
    const byId = new Map<string, Post>();
    posts.forEach((post) => {
      const matchesSkill = skillIds.has(post.skill.id);
      const matchesBody = post.body.toLowerCase().includes(normalized);
      if (matchesSkill || matchesBody) byId.set(post.id, post);
    });
    return [...byId.values()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalized, posts, skills]);

  return (
    <>
      <header className="border-b border-slate-100 px-4 pb-4 pt-5">
        <h1 className="text-xl font-bold">検索</h1>
        <div className="mt-4 flex items-center rounded-xl bg-slate-100 px-3">
          <span className="mr-2 text-slate-400">⌕</span>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例：バク転、りな、@rina.gym"
            className="h-11 w-full bg-transparent text-sm outline-none"
          />
        </div>
      </header>
      <div className="px-4 py-5">
        {!normalized ? (
          <>
            <p className="text-sm text-slate-500">技名・選手名・@ハンドル・投稿の内容で検索できます</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {skillCatalog.map((skill) => (
                <button key={skill.id} onClick={() => setQuery(skill.name)}>
                  <SkillBadge skill={skill} />
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-sm font-bold text-slate-900">技 ({skills.length})</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Link key={skill.id} href={`/skills/${skill.id}`}>
                  <SkillBadge skill={skill} />
                </Link>
              ))}
            </div>

            <h2 className="mt-7 text-sm font-bold text-slate-900">選手 ({users.length})</h2>
            <div className="mt-3 space-y-3">
              {users.map((user) => (
                <Link
                  key={user.id}
                  href={`/users/${user.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3 active:bg-slate-50"
                >
                  <Avatar user={user} size="sm" />
                  <div>
                    <p className="text-sm font-bold">{user.name}</p>
                    <p className="text-xs text-slate-500">
                      @{user.handle} · {user.country}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <h2 className="mt-7 text-sm font-bold text-slate-900">関連する投稿 ({matchingPosts.length})</h2>
            <div className="mx-[-1rem] mt-2">
              {matchingPosts.length ? (
                matchingPosts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <p className="px-4 py-5 text-sm text-slate-400">関連投稿はまだありません。</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
