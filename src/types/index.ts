export type Apparatus = "ゆか" | "跳馬" | "鉄棒";
export type SkillStatus = "mastered" | "practicing" | "wish";
export type SkillDifficulty = "beginner" | "intermediate" | "advanced" | "elite";

export type Skill = {
  id: string;
  name: string;
  apparatus: Apparatus;
  difficulty: SkillDifficulty;
  /** 将来、技専用のイラストや3Dモデルに接続するための識別子 */
  visualKey: string;
};
/** ユーザーと技の関係（習得済み/練習中/習得したい）。中間テーブル形式（Supabaseのuser_skillsテーブルにそのまま対応させるための設計） */
export type UserSkill = { skillId: string; status: SkillStatus };
export type User = { id: string; name: string; handle: string; avatar: string; country: string; bio: string; skills: UserSkill[] };
export type Comment = { id: string; authorId: string; body: string; createdAt: string };
export type Post = { id: string; authorId: string; skillId: string; body: string; createdAt: string; likes: number; comments: Comment[]; videoLabel?: string };
/** フォロー関係。userIdの組み合わせのみを持つ中間テーブル形式（Supabaseのfollowsテーブルにそのまま対応させるための設計） */
export type Follow = { followerId: string; followingId: string; createdAt?: string };
/** いいね関係。誰がどの投稿にいいねしたかを表す中間テーブル形式（通知機能のためのみに使用し、Post.likesの数値カウントとは独立して管理する） */
export type Like = { userId: string; postId: string; createdAt: string };
