"use client";

import React from "react";
import { ProfileForm } from "@/components/profiles/core/FormUi";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function ProfileFormPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Page heading */}
        <div className="text-center">
          <span className="inline-block text-4xl leading-none select-none mb-3">
            ◉
          </span>
          <h1 className="text-2xl font-bold tracking-tight font-mono">
            Get Started
          </h1>
          <p className="text-sm mt-1.5">
            Create a profile to start using the platform.
          </p>
        </div>

        {/* Form card */}
        <Card className="overflow-hidden shadow-md">
          <CardContent className="p-0">
            <ProfileForm onSuccess={() => router.push("/profile")} />
          </CardContent>
        </Card>

        <p className="text-center text-xs">
          Already have a profile?{" "}
          <a
            href="/profile"
            className="underline underline-offset-2 hover:text-stone-700 transition-colors"
          >
            View it here
          </a>
        </p>
      </div>
    </main>
  );
}
