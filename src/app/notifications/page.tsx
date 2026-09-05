"use client";

import Link from "next/link";
import { initialLikes, sampleUsers } from "@/data/mock-data";
import { useApp } from "@/components/providers/app-provider";
import { getNotifications, type Notification } from "@/lib/notification-stats";

const currentUserId = "me";

const notificationStyle: Record<Notification["type"], { icon: string; color: string; text: (name: string) => string }> = {
  follow: { icon: "★", color: "text-violet-500 bg-violet-50", text: (name) => `${name}さんがあなたをフォローしました` },
  like: { icon: "♥", color: "text-rose-500 bg-rose-50", text: (name) => `${name}さんがあなたの投稿にいいねしました` },
  comment: { icon: "◌", color: "text-sky-500 bg-sky-50", text: (name) => `${name}さんがあなたの投稿にコメントしました` },
};

export default function NotificationsPage() {
  const { posts, follows } = useApp();
  const notifications = getNotifications({ currentUserId, follows, likes: initialLikes, posts, users: sampleUsers });

  return (
    <>
      <header className="border-b border-slate-100 px-4 py-5">
        <h1 className="text-xl font-bold">通知</h1>
      </header>
      <div>
        {notifications.length ? (
          notifications.map((notification) => {
            const style = notificationStyle[notification.type];
            const href = notification.type === "follow" ? `/users/${notification.actor.id}` : `/posts/${notification.postId}`;
            return (
              <Link
                key={notification.id}
                href={href}
                className="flex gap-3 border-b border-slate-100 px-4 py-4 active:bg-slate-50"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${style.color}`}>
                  {style.icon}
                </div>
                <div>
                  <p className="text-sm leading-5 text-slate-700">{style.text(notification.actor.name)}</p>
                  <p className="mt-1 text-xs text-slate-400">{notification.createdAt}</p>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="px-4 py-14 text-center text-sm text-slate-400">まだ通知はありません。</p>
        )}
      </div>
    </>
  );
}
