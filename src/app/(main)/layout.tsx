// app/(main)/layout.tsx
import MainHeader from "@/components/headerUi/MainHeader";
import BaseLayout from "@/components/layouts/base.layout";
import { BackgroundOverlay } from "@/components/ui/LoadingOverlay";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <BaseLayout maxWidth="container" innerClassName="flex-col p-2 relative">
      <BackgroundOverlay />

      {/* Header slot */}
      <div className="w-full shrink-0">
        <MainHeader />
      </div>

      {/* Content — flex-1 fills remaining height without fighting h-screen */}
      <main
        className="w-full flex-1 mt-2 overflow-x-hidden overflow-y-auto
        flex items-center justify-center border rounded hide-scrollbar"
      >
        {children}
      </main>
    </BaseLayout>
  );
}
