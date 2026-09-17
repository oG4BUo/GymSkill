"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { sampleUsers, skillCatalog } from "@/data/mock-data";
import { Avatar } from "@/components/ui/avatar";
import { SkillCard } from "@/components/skills/skill-card";
import { useApp } from "@/components/providers/app-provider";
import { FollowListSheet } from "@/components/users/follow-list-sheet";
import { getFollowers, getFollowing } from "@/lib/follow-stats";
import { getSkillById } from "@/lib/skill-directory";
import { sortApparatusByGenderPriority } from "@/lib/gender-personalization";
import { signOut } from "@/app/login/actions";
import type { Apparatus, SkillStatus } from "@/types";

type FollowSheetKind = "followers" | "following" | null;

const statuses: { value: SkillStatus; label: string; subtitle: string; icon: string; panel: string; iconPanel: string }[] = [
  { value: "mastered", label: "習得済み", subtitle: "自分のものにした技", icon: "✓", panel: "border-emerald-100", iconPanel: "bg-emerald-500" },
  { value: "practicing", label: "練習中", subtitle: "いま伸ばしている技", icon: "↗", panel: "border-sky-100", iconPanel: "bg-sky-500" },
  { value: "wish", label: "習得したい", subtitle: "次に目指す技", icon: "✦", panel: "border-violet-100", iconPanel: "bg-violet-500" },
];

export default function ProfilePage() {
  const { currentUser, mySkills, posts, follows, updateSkillStatus } = useApp();
  const [editing, setEditing] = useState(false);
  const [openStatuses, setOpenStatuses] = useState<SkillStatus[]>(["mastered"]);
  const [followSheet, setFollowSheet] = useState<FollowSheetKind>(null);
  const myPosts = useMemo(() => posts.filter((post) => post.authorId === currentUser.id), [posts, currentUser.id]);
  const followers = useMemo(() => getFollowers(currentUser.id, follows, sampleUsers), [follows, currentUser.id]);
  const following = useMemo(() => getFollowing(currentUser.id, follows, sampleUsers), [follows, currentUser.id]);
  const selected = new Map(mySkills.map((entry) => [entry.skillId, entry]));
  const apparatusList = useMemo(() => {
    const uniqueApparatus = [...new Set(skillCatalog.map((skill) => skill.apparatus))] as Apparatus[];
    return sortApparatusByGenderPriority(uniqueApparatus, currentUser.gender, skillCatalog);
  }, [currentUser.gender]);

  return <>
    <header className="flex h-15 items-center justify-between border-b border-slate-100 px-4"><h1 className="text-xl font-bold">プロフィール</h1><button onClick={() => setEditing((value) => !value)} className="text-sm font-bold text-sky-600">{editing ? "完了" : "技を編集"}</button></header>
    <section className="px-4 py-6"><div className="flex items-center gap-4"><Avatar user={currentUser} size="lg" /><div><h2 className="text-xl font-bold">{currentUser.name}</h2><p className="text-sm text-slate-500">@{currentUser.handle} · {currentUser.country}</p></div></div><p className="mt-4 text-sm leading-6 text-slate-700">{currentUser.bio}</p><form action={signOut} className="mt-3"><button type="submit" className="text-xs font-bold text-slate-400">ログアウト</button></form><div className="mt-5 flex items-center gap-6 border-y border-slate-100 py-3"><div><p className="font-bold">{myPosts.length}</p><p className="text-xs text-slate-400">投稿</p></div><div><p className="font-bold">{mySkills.length}</p><p className="text-xs text-slate-400">登録した技</p></div><button type="button" onClick={() => setFollowSheet("followers")} className="text-left"><p className="font-bold">{followers.length}</p><p className="text-xs text-slate-400">フォロワー</p></button><button type="button" onClick={() => setFollowSheet("following")} className="text-left"><p className="font-bold">{following.length}</p><p className="text-xs text-slate-400">フォロー中</p></button></div></section>
    <section className="px-4 pb-7"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold">マイスキル</h2><p className="mt-0.5 text-xs text-slate-400">タップして技のデッキを開く</p></div>{editing && <span className="text-xs text-slate-400">状態を選択して登録</span>}</div>
      {editing ? <div className="space-y-5">{apparatusList.map((apparatus) => <div key={apparatus}><p className="mb-2 text-xs font-bold text-slate-400">{apparatus}</p><div className="space-y-2">{skillCatalog.filter((skill) => skill.apparatus === apparatus).map((skill) => <div key={skill.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-2"><span className="text-sm font-medium">{skill.name}<span className="ml-2 text-xs text-slate-400">{difficultyName(skill.difficulty)}</span></span><select aria-label={`${skill.name}の状態`} value={selected.get(skill.id)?.status ?? "none"} onChange={(event) => updateSkillStatus(skill.id, event.target.value as SkillStatus | "none")} className="rounded-lg bg-slate-100 px-2 py-1.5 text-xs outline-none"><option value="none">未登録</option>{statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></div>)}</div></div>)}</div> : <div className="space-y-3">{statuses.map((status) => { const entries = mySkills.filter((entry) => entry.status === status.value); const isOpen = openStatuses.includes(status.value); return <div key={status.value} className={`overflow-hidden rounded-2xl border ${status.panel}`}><button type="button" onClick={() => setOpenStatuses((items) => items.includes(status.value) ? items.filter((item) => item !== status.value) : [...items, status.value])} aria-expanded={isOpen} className="flex w-full items-center gap-3 bg-white px-3 py-3 text-left"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white shadow-sm ${status.iconPanel}`}>{status.icon}</span><span className="min-w-0 flex-1"><span className="block font-bold text-slate-900">{status.label}<span className="ml-2 text-sm font-medium text-slate-400">{entries.length}</span></span><span className="mt-0.5 block text-xs text-slate-400">{status.subtitle}</span></span><span className={`text-lg text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>⌄</span></button>{isOpen && <div className="border-t border-slate-100 bg-slate-50/70 p-3">{entries.length ? <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{entries.map((entry) => { const skill = getSkillById(entry.skillId, skillCatalog); if (!skill) return null; return <Link key={entry.skillId} href={`/skills/${entry.skillId}`} className="block"><SkillCard skill={skill} /></Link>; })}</div> : <p className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-5 text-center text-sm text-slate-400">まだ技がありません。編集から追加できます。</p>}</div>}</div>; })}</div>}</section>
    <FollowListSheet open={followSheet !== null} title={followSheet === "followers" ? "フォロワー" : "フォロー中"} users={followSheet === "followers" ? followers : following} onClose={() => setFollowSheet(null)} />
  </>;
}

function difficultyName(difficulty: "beginner" | "intermediate" | "advanced" | "elite") { return { beginner: "初級", intermediate: "中級", advanced: "上級", elite: "超上級" }[difficulty]; }
