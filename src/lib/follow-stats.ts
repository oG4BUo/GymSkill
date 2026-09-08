import type { Follow, User } from "@/types";

/**
 * 指定したユーザーをフォローしているユーザー一覧を返す。
 * 将来Supabase等に移行する際は、この関数の中身だけをクエリ呼び出しに差し替えれば良い。
 */
export function getFollowers(userId: User["id"], follows: Follow[], users: User[]): User[] {
  const followerIds = follows.filter((follow) => follow.followingId === userId).map((follow) => follow.followerId);
  return followerIds
    .map((id) => users.find((user) => user.id === id))
    .filter((user): user is User => Boolean(user));
}

/**
 * 指定したユーザーがフォローしているユーザー一覧を返す。
 */
export function getFollowing(userId: User["id"], follows: Follow[], users: User[]): User[] {
  const followingIds = follows.filter((follow) => follow.followerId === userId).map((follow) => follow.followingId);
  return followingIds
    .map((id) => users.find((user) => user.id === id))
    .filter((user): user is User => Boolean(user));
}
export function formatRelativeTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffMinutes < 1) return "たった今";
  if (diffMinutes < 60) return `${diffMinutes}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;

  return date.toLocaleDateString("ja-JP");
}