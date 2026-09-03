import type { Follow, Post, Skill, User } from "@/types";

export const skillCatalog: Skill[] = [
  { id: "floor-forward-roll", name: "前転", apparatus: "ゆか", difficulty: "beginner", visualKey: "roll" }, { id: "floor-backward-roll", name: "後転", apparatus: "ゆか", difficulty: "beginner", visualKey: "roll-back" }, { id: "floor-cartwheel", name: "側転", apparatus: "ゆか", difficulty: "beginner", visualKey: "cartwheel" }, { id: "floor-roundoff", name: "ロンダート", apparatus: "ゆか", difficulty: "intermediate", visualKey: "roundoff" }, { id: "floor-back-handspring", name: "バク転", apparatus: "ゆか", difficulty: "intermediate", visualKey: "handspring" }, { id: "floor-back-tuck", name: "バク宙", apparatus: "ゆか", difficulty: "advanced", visualKey: "back-tuck" }, { id: "floor-front-tuck", name: "前宙", apparatus: "ゆか", difficulty: "advanced", visualKey: "front-tuck" },
  { id: "vault-straddle", name: "開脚跳び", apparatus: "跳馬", difficulty: "beginner", visualKey: "straddle" }, { id: "vault-handspring", name: "ハンドスプリング", apparatus: "跳馬", difficulty: "intermediate", visualKey: "vault-handspring" },
  { id: "bar-pullover", name: "逆上がり", apparatus: "鉄棒", difficulty: "beginner", visualKey: "pullover" }, { id: "bar-kip", name: "け上がり", apparatus: "鉄棒", difficulty: "intermediate", visualKey: "kip" }, { id: "bar-giant", name: "車輪", apparatus: "鉄棒", difficulty: "advanced", visualKey: "giant" }, { id: "bar-kovacs", name: "コバチ", apparatus: "鉄棒", difficulty: "elite", visualKey: "kovacs" },
];
const findSkill = (id: string) => skillCatalog.find((skill) => skill.id === id)!;
export const currentUser: User = { id: "me", name: "山田 葵", handle: "aoi_gym", avatar: "葵", country: "日本", bio: "高校体操部。ゆかを中心に、毎日少しずつ挑戦中です。", skills: [{ ...findSkill("floor-roundoff"), status: "mastered" }, { ...findSkill("floor-back-handspring"), status: "practicing" }, { ...findSkill("floor-back-tuck"), status: "wish" }, { ...findSkill("bar-pullover"), status: "mastered" }] };
export const sampleUsers: User[] = [currentUser, { id: "rina", name: "鈴木 りな", handle: "rina.gym", avatar: "り", country: "日本", bio: "中学2年生。きれいな着地を目指しています。", skills: [{ ...findSkill("floor-back-handspring"), status: "practicing" }, { ...findSkill("vault-handspring"), status: "wish" }] }, { id: "haru", name: "Haru Kim", handle: "haru_moves", avatar: "H", country: "韓国", bio: "Gymnastics is my daily rhythm.", skills: [{ ...findSkill("bar-giant"), status: "practicing" }, { ...findSkill("bar-kip"), status: "mastered" }] }];
export const initialFollows: Follow[] = [
  { followerId: "rina", followingId: "haru" },
  { followerId: "haru", followingId: "me" },
  { followerId: "me", followingId: "rina" },
];
export const initialPosts: Post[] = [
  { id: "post-1", author: sampleUsers[1], skill: findSkill("floor-back-handspring"), body: "今日は着地で一歩を減らすことが目標。腕を最後まで振り上げる意識で練習しました！", createdAt: "18分前", likes: 24, videoLabel: "練習動画", comments: [] },
  { id: "post-2", author: sampleUsers[2], skill: findSkill("bar-giant"), body: "車輪のリズムを整える基礎練習。もっと肩を開けるようにしたいです。", createdAt: "1時間前", likes: 41, videoLabel: "練習動画", comments: [] },
  { id: "post-3", author: currentUser, skill: findSkill("floor-back-handspring"), body: "補助ありでバク転の反復！少しずつ怖さがなくなってきました。", createdAt: "昨日", likes: 16, comments: [] },
];
