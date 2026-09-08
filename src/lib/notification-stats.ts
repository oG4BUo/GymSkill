import { getUserById } from "@/lib/user-directory";
import type { Follow, Like, Post, User } from "@/types";

export type Notification = {
  id: string;
  type: "follow" | "like" | "comment";
  actor: User;
  createdAt: string;
  /** like/commentの場合のみ。タップ時の遷移先投稿ID */
  postId?: string;
};

/**
 * 現在のフォロー関係・いいね関係・投稿のコメントから、自分（currentUserId）宛の通知一覧を導出する。
 * 通知専用の状態は持たず、既存データからその都度計算する読み取り専用のビュー。
 */
export function getNotifications({
  currentUserId,
  follows,
  likes,
  posts,
  users,
}: {
  currentUserId: string;
  follows: Follow[];
  likes: Like[];
  posts: Post[];
  users: User[];
}): Notification[] {
  const followNotifications: Notification[] = follows
    .filter((follow) => follow.followingId === currentUserId && follow.followerId !== currentUserId)
    .map((follow): Notification | null => {
      const actor = getUserById(follow.followerId, users);
      // Follow.createdAtは型上オプショナルなため、万一未設定のデータが渡された場合でも
      // 空文字（表示崩れの原因）にはせず、安全なISO日時にフォールバックする。
      return actor
        ? { id: `follow-${follow.followerId}-${follow.followingId}`, type: "follow", actor, createdAt: follow.createdAt ?? new Date().toISOString() }
        : null;
    })
    .filter((notification): notification is Notification => notification !== null);

  const likeNotifications: Notification[] = likes
    .filter((like) => like.userId !== currentUserId && posts.find((post) => post.id === like.postId)?.authorId === currentUserId)
    .map((like): Notification | null => {
      const actor = getUserById(like.userId, users);
      return actor
        ? { id: `like-${like.userId}-${like.postId}`, type: "like", actor, createdAt: like.createdAt, postId: like.postId }
        : null;
    })
    .filter((notification): notification is Notification => notification !== null);

  const commentNotifications: Notification[] = posts
    .filter((post) => post.authorId === currentUserId)
    .flatMap((post) =>
      post.comments
        .filter((comment) => comment.authorId !== currentUserId)
        .map((comment): Notification | null => {
          const actor = getUserById(comment.authorId, users);
          return actor
            ? { id: `comment-${comment.id}`, type: "comment", actor, createdAt: comment.createdAt, postId: post.id }
            : null;
        })
        .filter((notification): notification is Notification => notification !== null),
    );

  return [...followNotifications, ...likeNotifications, ...commentNotifications];
}
