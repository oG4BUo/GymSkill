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
