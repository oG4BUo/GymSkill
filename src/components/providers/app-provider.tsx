"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { currentUser, initialPosts, skillCatalog } from "@/data/mock-data";
import { readLocal, writeLocal } from "@/services/browser-storage";
import type { Comment, Post, Skill, SkillStatus } from "@/types";
type AppContextValue = { posts: Post[]; mySkills: Skill[]; likedPostIds: string[]; toggleLike: (postId: string) => void; addComment: (postId: string, body: string) => void; addPost: (skill: Skill, body: string, videoLabel?: string) => void; updateSkillStatus: (skill: Skill, status: SkillStatus | "none") => void };
const AppContext = createContext<AppContextValue | null>(null); const storageKey = "gymskill-v1";
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState(initialPosts); const [mySkills, setMySkills] = useState(currentUser.skills); const [likedPostIds, setLikedPostIds] = useState<string[]>([]); const [ready, setReady] = useState(false);
  useEffect(() => { const saved = readLocal(storageKey, { posts: initialPosts, mySkills: currentUser.skills, likedPostIds: [] as string[] }); const hydratedSkills = saved.mySkills.map((skill) => ({ ...skillCatalog.find((catalogSkill) => catalogSkill.id === skill.id), ...skill })); queueMicrotask(() => { setPosts(saved.posts); setMySkills(hydratedSkills); setLikedPostIds(saved.likedPostIds); setReady(true); }); }, []);
  useEffect(() => { if (ready) writeLocal(storageKey, { posts, mySkills, likedPostIds }); }, [posts, mySkills, likedPostIds, ready]);
  const toggleLike = (postId: string) => { const isLiked = likedPostIds.includes(postId); setLikedPostIds((items) => isLiked ? items.filter((id) => id !== postId) : [...items, postId]); setPosts((items) => items.map((post) => post.id === postId ? { ...post, likes: post.likes + (isLiked ? -1 : 1) } : post)); };
  const addComment = (postId: string, body: string) => { const trimmed = body.trim(); if (!trimmed) return; const comment: Comment = { id: crypto.randomUUID(), author: currentUser, body: trimmed, createdAt: "たった今" }; setPosts((items) => items.map((post) => post.id === postId ? { ...post, comments: [...post.comments, comment] } : post)); };
  const addPost = (skill: Skill, body: string, videoLabel?: string) => { const post: Post = { id: crypto.randomUUID(), author: currentUser, skill, body: body.trim() || "練習の記録を追加しました。", createdAt: "たった今", likes: 0, comments: [], videoLabel }; setPosts((items) => [post, ...items]); };
  const updateSkillStatus = (skill: Skill, status: SkillStatus | "none") => setMySkills((items) => { if (status === "none") return items.filter((item) => item.id !== skill.id); const found = items.some((item) => item.id === skill.id); return found ? items.map((item) => item.id === skill.id ? { ...item, status } : item) : [...items, { ...skill, status }]; });
  return <AppContext.Provider value={{ posts, mySkills, likedPostIds, toggleLike, addComment, addPost, updateSkillStatus }}>{children}</AppContext.Provider>;
}
export function useApp() { const context = useContext(AppContext); if (!context) throw new Error("useApp must be used within AppProvider"); return context; }
