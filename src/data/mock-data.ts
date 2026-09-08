import type { Follow, Like, Post, Skill, User } from "@/types";

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60 * 1000).toISOString();
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const skillCatalog: Skill[] = [
  { id: "floor-forward-roll", name: "前転", apparatus: "ゆか", difficulty: "beginner", visualKey: "roll" }, { id: "floor-backward-roll", name: "後転", apparatus: "ゆか", difficulty: "beginner", visualKey: "roll-back" }, { id: "floor-cartwheel", name: "側転", apparatus: "ゆか", difficulty: "beginner", visualKey: "cartwheel" }, { id: "floor-roundoff", name: "ロンダート", apparatus: "ゆか", difficulty: "intermediate", visualKey: "roundoff" }, { id: "floor-back-handspring", name: "バク転", apparatus: "ゆか", difficulty: "intermediate", visualKey: "handspring" }, { id: "floor-back-tuck", name: "バク宙", apparatus: "ゆか", difficulty: "advanced", visualKey: "back-tuck" }, { id: "floor-front-tuck", name: "前宙", apparatus: "ゆか", difficulty: "advanced", visualKey: "front-tuck" },
  { id: "vault-straddle", name: "開脚跳び", apparatus: "跳馬", difficulty: "beginner", visualKey: "straddle" }, { id: "vault-handspring", name: "ハンドスプリング", apparatus: "跳馬", difficulty: "intermediate", visualKey: "vault-handspring" },
  { id: "bar-pullover", name: "逆上がり", apparatus: "鉄棒", difficulty: "beginner", visualKey: "pullover" }, { id: "bar-kip", name: "け上がり", apparatus: "鉄棒", difficulty: "intermediate", visualKey: "kip" }, { id: "bar-giant", name: "車輪", apparatus: "鉄棒", difficulty: "advanced", visualKey: "giant" }, { id: "bar-kovacs", name: "コバチ", apparatus: "鉄棒", difficulty: "elite", visualKey: "kovacs" },
];
export const currentUser: User = { id: "me", name: "山田 葵", handle: "aoi_gym", avatar: "葵", country: "日本", bio: "高校体操部。ゆかを中心に、毎日少しずつ挑戦中です。", skills: [{ skillId: "floor-roundoff", status: "mastered" }, { skillId: "floor-back-handspring", status: "practicing" }, { skillId: "floor-back-tuck", status: "wish" }, { skillId: "bar-pullover", status: "mastered" }] };
export const sampleUsers: User[] = [currentUser, { id: "rina", name: "鈴木 りな", handle: "rina.gym", avatar: "り", country: "日本", bio: "中学2年生。きれいな着地を目指しています。", skills: [{ skillId: "floor-back-handspring", status: "practicing" }, { skillId: "vault-handspring", status: "wish" }] }, { id: "haru", name: "Haru Kim", handle: "haru_moves", avatar: "H", country: "韓国", bio: "Gymnastics is my daily rhythm.", skills: [{ skillId: "bar-giant", status: "practicing" }, { skillId: "bar-kip", status: "mastered" }] }];
export const initialFollows: Follow[] = [
  { followerId: "rina", followingId: "haru", createdAt: daysAgo(3) },
  { followerId: "haru", followingId: "me", createdAt: hoursAgo(2) },
  { followerId: "me", followingId: "rina", createdAt: daysAgo(5) },
];
export const initialLikes: Like[] = [
  { userId: "rina", postId: "post-3", createdAt: minutesAgo(12) },
];
export const initialPosts: Post[] = [
  { id: "post-1", authorId: "rina", skillId: "floor-back-handspring", body: "今日は着地で一歩を減らすことが目標。腕を最後まで振り上げる意識で練習しました！", createdAt: minutesAgo(18), likes: 24, videoLabel: "練習動画", comments: [] },
  { id: "post-2", authorId: "haru", skillId: "bar-giant", body: "車輪のリズムを整える基礎練習。もっと肩を開けるようにしたいです。", createdAt: hoursAgo(1), likes: 41, videoLabel: "練習動画", comments: [] },
  { id: "post-3", authorId: currentUser.id, skillId: "floor-back-handspring", body: "補助ありでバク転の反復！少しずつ怖さがなくなってきました。", createdAt: daysAgo(1), likes: 16, comments: [{ id: "comment-seed-1", authorId: "haru", body: "すごく安定しています！", createdAt: hoursAgo(2) }] },
];
