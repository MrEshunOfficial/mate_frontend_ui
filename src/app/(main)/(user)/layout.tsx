// components/layouts/profile.layout.tsx
"use client";
import BaseLayout from "@/components/layouts/base.layout";
import UserProfileNav from "@/components/layouts/UserProfileNav";
import type { ReactNode } from "react";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <BaseLayout maxWidth="container" innerClassName="gap-2 items-stretch">
      {/* Sidebar */}
      <aside className="w-80 shrink-0 h-full p-2 border rounded">
        <UserProfileNav />
      </aside>
      <section className="flex-1 h-full p-4">{children}</section>
    </BaseLayout>
  );
}
