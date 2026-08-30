import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { AppProvider } from "@/components/providers/app-provider";

export const metadata: Metadata = {
  title: "GymSkill | 体操の練習SNS",
  description: "器械体操の練習を記録し、仲間と応援し合うSNS",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body><AppProvider><AppShell>{children}</AppShell></AppProvider></body>
    </html>
  );
}
