"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import type { User } from "@/types";

export function SkillUserListSheet({
  open,
  title,
  users,
  onClose,
}: {
  open: boolean;
  title: string;
  users: User[];
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="fixed inset-0 z-30 flex items-end justify-center bg-slate-900/40"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-h-[70vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <button type="button" aria-label="閉じる" onClick={onClose} className="text-xl text-slate-400">
            ✕
          </button>
        </div>
        <div className="px-4 py-2">
          {users.length ? (
            users.map((user) => (
              <Link
                key={user.id}
                href={`/users/${user.id}`}
                className="flex items-center gap-3 border-b border-slate-50 py-3 last:border-0 active:bg-slate-50"
              >
                <Avatar user={user} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    @{user.handle} · {user.country}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="py-6 text-center text-sm text-slate-400">まだ登録している選手がいません。</p>
          )}
        </div>
      </div>
    </div>
  );
}
