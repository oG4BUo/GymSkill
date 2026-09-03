"use client";

import { currentUser } from "@/data/mock-data";
import { useApp } from "@/components/providers/app-provider";

export function FollowButton({ userId }: { userId: string }) {
  const { followingUserIds, toggleFollow } = useApp();

  if (userId === currentUser.id) return null;

  const isFollowing = followingUserIds.includes(userId);

  return (
    <button
      type="button"
      onClick={() => toggleFollow(userId)}
      className={
        isFollowing
          ? "rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-bold text-slate-600 active:scale-[0.98]"
          : "rounded-full bg-sky-600 px-5 py-2 text-sm font-bold text-white shadow-sm active:scale-[0.98]"
      }
    >
      {isFollowing ? "フォロー中" : "フォローする"}
    </button>
  );
}
