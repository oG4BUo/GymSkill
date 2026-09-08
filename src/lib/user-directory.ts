import type { User } from "@/types";

/**
 * IDからユーザーを解決する。見つからない場合はundefinedを返す(存在を無理に仮定しない)。
 * 将来Supabase移行時は、この関数の中身だけをDBクエリに差し替えれば良い。
 */
export function getUserById(id: string, users: User[]): User | undefined {
  return users.find((user) => user.id === id);
}
