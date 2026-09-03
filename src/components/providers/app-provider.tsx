"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { currentUser, initialFollows, initialPosts, skillCatalog } from "@/data/mock-data";
import { readLocal, writeLocal } from "@/services/browser-storage";
import type { Comment, Follow, Post, Skill, SkillStatus } from "@/types";
type AppContextValue = { posts: Post[]; mySkills: Skill[]; likedPostIds: string[]; follows: Follow[]; followingUserIds: string[]; toggleLike: (postId: string) => void; addComment: (postId: string, body: string) => void; addPost: (skill: Skill, body: string, videoLabel?: string) => void; updateSkillStatus: (skill: Skill, status: SkillStatus | "none") => void; toggleFollow: (userId: string) => void };
const AppContext = createContext<AppContextValue | null>(null); const storageKey = "gymskill-v1";
const defaultFollowingUserIds = initialFollows.filter((follow) => follow.followerId === currentUser.id).map((follow) => follow.followingId);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState(initialPosts); const [mySkills, setMySkills] = useState(currentUser.skills); const [likedPostIds, setLikedPostIds] = useState<string[]>([]); const [followingUserIds, setFollowingUserIds] = useState<string[]>(defaultFollowingUserIds); const [ready, setReady] = useState(false);
  useEffect(() => { const saved = readLocal(storageKey, { posts: initialPosts, mySkills: currentUser.skills, likedPostIds: [] as string[], followingUserIds: defaultFollowingUserIds }); const hydratedSkills = saved.mySkills.map((skill) => ({ ...skillCatalog.find((catalogSkill) => catalogSkill.id === skill.id), ...skill })); queueMicrotask(() => { setPosts(saved.posts); setMySkills(hydratedSkills); setLikedPostIds(saved.likedPostIds); setFollowingUserIds(saved.followingUserIds ?? defaultFollowingUserIds); setReady(true); }); }, []);
  useEffect(() => { if (ready) writeLocal(storageKey, { posts, mySkills, likedPostIds, followingUserIds }); }, [posts, mySkills, likedPostIds, followingUserIds, ready]);
  const toggleLike = (postId: string) => { const isLiked = likedPostIds.includes(postId); setLikedPostIds((items) => isLiked ? items.filter((id) => id !== postId) : [...items, postId]); setPosts((items) => items.map((post) => post.id === postId ? { ...post, likes: post.likes + (isLiked ? -1 : 1) } : post)); };
  const addComment = (postId: string, body: string) => { const trimmed = body.trim(); if (!trimmed) return; const comment: Comment = { id: crypto.randomUUID(), author: currentUser, body: trimmed, createdAt: "たった今" }; setPosts((items) => items.map((post) => post.id === postId ? { ...post, comments: [...post.comments, comment] } : post)); };
  const addPost = (skill: Skill, body: string, videoLabel?: string) => { const post: Post = { id: crypto.randomUUID(), author: currentUser, skill, body: body.trim() || "練習の記録を追加しました。", createdAt: "たった今", likes: 0, comments: [], videoLabel }; setPosts((items) => [post, ...items]); };
  const updateSkillStatus = (skill: Skill, status: SkillStatus | "none") => setMySkills((items) => { if (status === "none") return items.filter((item) => item.id !== skill.id); const found = items.some((item) => item.id === skill.id); return found ? items.map((item) => item.id === skill.id ? { ...item, status } : item) : [...items, { ...skill, status }]; });
  const toggleFollow = (userId: string) => { if (userId === currentUser.id) return; setFollowingUserIds((items) => items.includes(userId) ? items.filter((id) => id !== userId) : [...items, userId]); };
  const follows = useMemo<Follow[]>(() => [...initialFollows.filter((follow) => follow.followerId !== currentUser.id), ...followingUserIds.map((userId) => ({ followerId: currentUser.id, followingId: userId }))], [followingUserIds]);
  return <AppContext.Provider value={{ posts, mySkills, likedPostIds, follows, followingUserIds, toggleLike, addComment, addPost, updateSkillStatus, toggleFollow }}>{children}</AppContext.Provider>;
}
export function useApp() { const context = useContext(AppContext); if (!context) throw new Error("useApp must be used within AppProvider"); return context; }
