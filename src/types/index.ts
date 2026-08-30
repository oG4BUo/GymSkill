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
  status?: SkillStatus;
};
export type User = { id: string; name: string; handle: string; avatar: string; country: string; bio: string; skills: Skill[] };
export type Comment = { id: string; author: User; body: string; createdAt: string };
export type Post = { id: string; author: User; skill: Skill; body: string; createdAt: string; likes: number; comments: Comment[]; videoLabel?: string };
