import type { Skill, SkillDifficulty } from "@/types";

const difficultyLabel: Record<SkillDifficulty, string> = { beginner: "初級", intermediate: "中級", advanced: "上級", elite: "超上級" };
const apparatusTheme = {
  "ゆか": { icon: "⌁", background: "from-sky-500 to-indigo-600", accent: "text-sky-700 bg-sky-50" },
  "跳馬": { icon: "⌃", background: "from-amber-500 to-orange-600", accent: "text-amber-700 bg-amber-50" },
  "鉄棒": { icon: "⊹", background: "from-emerald-500 to-teal-600", accent: "text-emerald-700 bg-emerald-50" },
} as const;

export function SkillCard({ skill }: { skill: Skill }) {
  const theme = apparatusTheme[skill.apparatus];
  return <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm transition-transform active:scale-[0.98]">
    <div className={`relative flex aspect-[1.32] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${theme.background} shadow-inner`}>
      <span className="absolute -right-2 -top-4 text-7xl font-black text-white/10">{theme.icon}</span>
      <span aria-hidden className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-3xl text-white shadow-lg backdrop-blur-sm">{theme.icon}</span>
      <span className="absolute bottom-1.5 right-1.5 rounded-full bg-slate-950/20 px-1.5 py-0.5 text-[9px] font-bold text-white">{difficultyLabel[skill.difficulty]}</span>
    </div>
    <div className="px-1 pt-2"><h3 className="truncate text-sm font-bold text-slate-900">{skill.name}</h3><p className={`mt-1 inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-bold ${theme.accent}`}>{skill.apparatus}</p></div>
  </article>;
}
