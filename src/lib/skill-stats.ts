import type { Skill, SkillStatus, User } from "@/types";

/**
 * 指定した技を、指定したステータス（練習中・習得したい等）で登録しているユーザーを抽出する。
 * 将来Supabase等に移行する際は、この関数の中身だけをクエリ呼び出しに差し替えれば良い。
 */
export function getUsersBySkillStatus(skillId: Skill["id"], status: SkillStatus, users: User[]): User[] {
  return users.filter((user) => user.skills.some((skill) => skill.id === skillId && skill.status === status));
}

/**
 * 指定した技・ステータスの登録ユーザー数を返す。
 */
export function getSkillStatusCount(skillId: Skill["id"], status: SkillStatus, users: User[]): number {
  return getUsersBySkillStatus(skillId, status, users).length;
}
