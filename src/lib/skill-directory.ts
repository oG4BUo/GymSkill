import type { Skill } from "@/types";

export function getSkillById(id: string, skills: Skill[]): Skill | undefined {
  return skills.find((skill) => skill.id === id);
}