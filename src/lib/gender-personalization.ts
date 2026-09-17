import type { Apparatus, Gender, Skill } from "@/types";

/**
 * ユーザーの性別と技の対象性別から、表示優先度を計算する。
 * 数値が小さいほど優先度が高い（Array.prototype.sortにそのまま渡せる設計）。
 *
 * 優先順位:
 * - unknown: 男女共通(both) > 男子/女子限定
 * - male:    男子限定 > 男女共通(both) > 女子限定
 * - female:  女子限定 > 男女共通(both) > 男子限定
 *
 * これはあくまで「表示順序のヒント」であり、閲覧を制限するものではない。
 * 検索(/search)など、意図的に全件を横断したい場所では使用しない。
 */
export function getGenderPriority(userGender: Gender, skillGender: Skill["gender"]): number {
  if (userGender === "unknown") return skillGender === "both" ? 0 : 1;
  if (skillGender === "both") return 1;
  return skillGender === userGender ? 0 : 2;
}

/**
 * 種目一覧(Apparatus[])を、ユーザーの性別に関連する種目が上に来るよう並び替える。
 * 種目そのものを追加・削除することはなく、あくまで表示順序のみを変更する。
 */
export function sortApparatusByGenderPriority(apparatusList: Apparatus[], userGender: Gender, skills: Skill[]): Apparatus[] {
  const priorityFor = (apparatus: Apparatus): number => {
    const relevantSkills = skills.filter((skill) => skill.apparatus === apparatus);
    if (!relevantSkills.length) return 1;
    const bestPriority = Math.min(...relevantSkills.map((skill) => getGenderPriority(userGender, skill.gender)));
    return bestPriority;
  };
  return [...apparatusList].sort((a, b) => priorityFor(a) - priorityFor(b));
}
