"use client";
import Link from "next/link";
import { PostCard } from "@/components/posts/post-card";
import { CommentSection } from "@/components/posts/comment-section";
import { useApp } from "@/components/providers/app-provider";
export function PostDetail({ id }: { id: string }) { const { posts } = useApp(); const post = posts.find((item) => item.id === id); if (!post) return <div className="p-6 text-center"><p className="font-bold">投稿が見つかりません</p><Link href="/" className="mt-4 inline-block text-sm text-sky-600">ホームへ戻る</Link></div>; return <><header className="flex h-15 items-center border-b border-slate-100 px-4"><Link href="/" aria-label="戻る" className="mr-3 text-xl text-slate-500">‹</Link><h1 className="text-xl font-bold">投稿</h1></header><PostCard post={post} /><CommentSection post={post} /></>; }
