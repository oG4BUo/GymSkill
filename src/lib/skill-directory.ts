import type { Skill } from "@/types";

/**
 * IDから技を解決する。見つからない場合はundefinedを返す(存在を無理に仮定しない)。
 * 将来Supabase移行時は、この関数の中身だけをDBクエリに差し替えれば良い。
 */
export function getSkillById(id: string, skills: Skill[]): Skill | undefined {
  return skills.find((skill) => skill.id === id);
}
