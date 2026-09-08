"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { currentUser, initialFollows, initialLikes, initialPosts, sampleUsers } from "@/data/mock-data";
import { readLocal, writeLocal } from "@/services/browser-storage";
import type { Comment, Follow, Like, Post, Skill, SkillStatus, User, UserSkill } from "@/types";

/** 未解決の著者を表すID。実在しないユーザーIDにすることで、誤って他ユーザーの投稿として表示されることを防ぐ。 */
const UNKNOWN_AUTHOR_ID = "unknown";
/** 未解決の技を表すID。実在しない技IDにすることで、誤って別の技として表示されることを防ぐ。 */
const UNKNOWN_SKILL_ID = "unknown-skill";
const VALID_SKILL_STATUSES: SkillStatus[] = ["mastered", "practicing", "wish"];

/** localStorageから読み込んだ直後の生データの型。旧形式(author/skill埋め込み)・新形式(authorId/skillId)のどちらも受け入れる。 */
type PersistedComment = { id: string; body: string; createdAt: string; author?: User; authorId?: string };
type PersistedPost = { id: string; body: string; createdAt: string; likes: number; videoLabel?: string; comments: PersistedComment[]; author?: User; authorId?: string; skill?: Skill; skillId?: string };
/** 旧形式(Skill全体+status埋め込み)・新形式(skillId+status)のどちらも受け入れる。 */
type PersistedUserSkill = { skillId?: string; id?: string; status?: string };

function resolveAuthorId(entity: { author?: User; authorId?: string }): string {
  if (typeof entity.authorId === "string" && entity.authorId) return entity.authorId;
  if (entity.author && typeof entity.author.id === "string" && entity.author.id) return entity.author.id;
  return UNKNOWN_AUTHOR_ID;
}

function resolveSkillId(entity: { skill?: Skill; skillId?: string }): string {
  if (typeof entity.skillId === "string" && entity.skillId) return entity.skillId;
  if (entity.skill && typeof entity.skill.id === "string" && entity.skill.id) return entity.skill.id;
  return UNKNOWN_SKILL_ID;
}

/**
 * 旧形式(Skillオブジェクト全体+status)のマイスキル情報を、UserSkill(skillId+status)へ正規化する。
 * skillIdが特定できない、またはstatusが有効な値でない場合は、データを捏造せず安全に除外する(nullを返す)。
 */
function migrateUserSkill(entry: PersistedUserSkill): UserSkill | null {
  const skillId = (typeof entry.skillId === "string" && entry.skillId) || (typeof entry.id === "string" && entry.id) || null;
  if (!skillId) return null;
  if (!VALID_SKILL_STATUSES.includes(entry.status as SkillStatus)) return null;
  return { skillId, status: entry.status as SkillStatus };
}

/** 旧形式(author/skill埋め込み)のPost/Commentを、authorId/skillId形式へ正規化する。author/skill自体は新しいオブジェクトに含めない。 */
function migratePost(post: PersistedPost): Post {
  return {
    id: post.id,
    authorId: resolveAuthorId(post),
    skillId: resolveSkillId(post),
    body: post.body,
    createdAt: post.createdAt,
    likes: post.likes,
    videoLabel: post.videoLabel,
    comments: post.comments.map((comment) => ({ id: comment.id, authorId: resolveAuthorId(comment), body: comment.body, createdAt: comment.createdAt })),
  };
}

type AppContextValue = { currentUser: User; users: User[]; posts: Post[]; mySkills: UserSkill[]; likedPostIds: string[]; follows: Follow[]; followingUserIds: string[]; likes: Like[]; toggleLike: (postId: string) => void; addComment: (postId: string, body: string) => void; addPost: (skillId: string, body: string, videoLabel?: string) => void; updateSkillStatus: (skillId: string, status: SkillStatus | "none") => void; toggleFollow: (userId: string) => void };
const AppContext = createContext<AppContextValue | null>(null); const storageKey = "gymskill-v1";
const defaultFollowingUserIds = initialFollows.filter((follow) => follow.followerId === currentUser.id).map((follow) => follow.followingId);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState(initialPosts); const [mySkills, setMySkills] = useState<UserSkill[]>(currentUser.skills); const [likedPostIds, setLikedPostIds] = useState<string[]>([]); const [followingUserIds, setFollowingUserIds] = useState<string[]>(defaultFollowingUserIds); const [ready, setReady] = useState(false);
  useEffect(() => { const saved = readLocal(storageKey, { posts: initialPosts as PersistedPost[], mySkills: currentUser.skills as PersistedUserSkill[], likedPostIds: [] as string[], followingUserIds: defaultFollowingUserIds }); const migratedPosts = saved.posts.map(migratePost); const migratedSkills = saved.mySkills.map(migrateUserSkill).filter((entry): entry is UserSkill => entry !== null); queueMicrotask(() => { setPosts(migratedPosts); setMySkills(migratedSkills); setLikedPostIds(saved.likedPostIds); setFollowingUserIds(saved.followingUserIds ?? defaultFollowingUserIds); setReady(true); }); }, []);
  useEffect(() => { if (ready) writeLocal(storageKey, { posts, mySkills, likedPostIds, followingUserIds }); }, [posts, mySkills, likedPostIds, followingUserIds, ready]);
  const toggleLike = (postId: string) => { const isLiked = likedPostIds.includes(postId); setLikedPostIds((items) => isLiked ? items.filter((id) => id !== postId) : [...items, postId]); setPosts((items) => items.map((post) => post.id === postId ? { ...post, likes: post.likes + (isLiked ? -1 : 1) } : post)); };
  const addComment = (postId: string, body: string) => { const trimmed = body.trim(); if (!trimmed) return; const comment: Comment = { id: crypto.randomUUID(), authorId: currentUser.id, body: trimmed, createdAt: new Date().toISOString() }; setPosts((items) => items.map((post) => post.id === postId ? { ...post, comments: [...post.comments, comment] } : post)); };
  const addPost = (skillId: string, body: string, videoLabel?: string) => { const post: Post = { id: crypto.randomUUID(), authorId: currentUser.id, skillId, body: body.trim() || "練習の記録を追加しました。", createdAt: new Date().toISOString(), likes: 0, comments: [], videoLabel }; setPosts((items) => [post, ...items]); };
  const updateSkillStatus = (skillId: string, status: SkillStatus | "none") => setMySkills((items) => { if (status === "none") return items.filter((item) => item.skillId !== skillId); const found = items.some((item) => item.skillId === skillId); return found ? items.map((item) => item.skillId === skillId ? { ...item, status } : item) : [...items, { skillId, status }]; });
  const toggleFollow = (userId: string) => { if (userId === currentUser.id) return; setFollowingUserIds((items) => items.includes(userId) ? items.filter((id) => id !== userId) : [...items, userId]); };
  const follows = useMemo<Follow[]>(() => [...initialFollows.filter((follow) => follow.followerId !== currentUser.id), ...followingUserIds.map((userId) => ({ followerId: currentUser.id, followingId: userId }))], [followingUserIds]);
  const likes = useMemo<Like[]>(() => [...initialLikes.filter((like) => like.userId !== currentUser.id), ...likedPostIds.map((postId) => ({ userId: currentUser.id, postId, createdAt: new Date().toISOString() }))], [likedPostIds]);
  return <AppContext.Provider value={{ currentUser, users: sampleUsers, posts, mySkills, likedPostIds, follows, followingUserIds, likes, toggleLike, addComment, addPost, updateSkillStatus, toggleFollow }}>{children}</AppContext.Provider>;
}
export function useApp() { const context = useContext(AppContext); if (!context) throw new Error("useApp must be used within AppProvider"); return context; }
