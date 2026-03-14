"use client";

import { useProfile } from "@/hooks/profiles/useCoreUserProfile";
import { useRouter } from "next/navigation";
import { RoleTransitionValidateResponse } from "@/lib/api/profiles/core.user.profile.api";
import { UserRole } from "@/types/base.types";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  ShieldOff,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Sub-components ────────────────────────────────────────────────────────────

function ProfileAvatar({ name, src }: { name?: string; src?: string }) {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  return (
    <Avatar className="h-16 w-16 border-2 border-border">
      {src && <AvatarImage src={src} alt={name ?? "Profile"} />}
      <AvatarFallback className="bg-lime-300 text-stone-900 text-lg font-bold font-mono">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

function RolePill({ role }: { role: UserRole }) {
  const isProvider = role === UserRole.PROVIDER;
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-semibold tracking-widest uppercase rounded-full px-3",
        isProvider
          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
          : "bg-violet-50 text-violet-800 border-violet-200",
      )}
    >
      {isProvider ? "Service Provider" : "Customer"}
    </Badge>
  );
}

function TransitionPanel({
  currentRole,
  onValidate,
  onExecute,
  loading,
  error,
}: {
  currentRole: UserRole;
  onValidate: (
    role: UserRole,
  ) => Promise<RoleTransitionValidateResponse | null>;
  onExecute: (role: UserRole) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}) {
  const targetRole =
    currentRole === UserRole.CUSTOMER ? UserRole.PROVIDER : UserRole.CUSTOMER;
  const targetLabel =
    targetRole === UserRole.PROVIDER ? "Service Provider" : "Customer";

  const [validation, setValidation] =
    useState<RoleTransitionValidateResponse | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [done, setDone] = useState(false);

  const handleValidate = async () => {
    setConfirmed(false);
    const result = await onValidate(targetRole);
    setValidation(result);
  };

  const handleExecute = async () => {
    const ok = await onExecute(targetRole);
    if (ok) setDone(true);
  };

  if (done) {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
        <p className="text-sm text-emerald-800">
          Role switched to <strong>{targetLabel}</strong>. Refreshing…
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-semibold text-stone-900">
          Switch to {targetLabel}
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Check your eligibility before switching.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="py-2.5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {!validation ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleValidate}
          disabled={loading}
          className="w-fit"
        >
          <UserCog className="h-3.5 w-3.5 mr-1.5" />
          {loading ? "Checking…" : "Check Eligibility"}
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          {validation.eligible ? (
            <>
              {validation.warnings?.map((w, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 p-3"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">{w}</p>
                </div>
              ))}

              {validation.dataImpact && (
                <div className="rounded-md border border-border bg-stone-50 p-3 flex flex-col gap-1.5 text-xs">
                  {validation.dataImpact.willBeDeactivated.length > 0 && (
                    <p className="text-red-700">
                      <span className="font-medium">Will deactivate: </span>
                      {validation.dataImpact.willBeDeactivated.join(", ")}
                    </p>
                  )}
                  {validation.dataImpact.willBeRetained.length > 0 && (
                    <p className="text-emerald-700">
                      <span className="font-medium">Retained: </span>
                      {validation.dataImpact.willBeRetained.join(", ")}
                    </p>
                  )}
                </div>
              )}

              <label className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox
                  checked={confirmed}
                  onCheckedChange={(v) => setConfirmed(!!v)}
                />
                <span className="text-xs text-stone-700">
                  I understand the impact of this change
                </span>
              </label>

              <Button
                size="sm"
                onClick={handleExecute}
                disabled={!confirmed || loading}
                className="w-fit"
              >
                {loading ? "Switching…" : `Switch to ${targetLabel}`}
              </Button>
            </>
          ) : (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
              {validation.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Profile UI ───────────────────────────────────────────────────────────

interface ProfileUIProps {
  adminMode?: boolean;
  targetUserId?: string;
}

export default function ProfileUI({ adminMode = false }: ProfileUIProps) {
  const router = useRouter();
  const {
    profile,
    loading,
    errors,
    exists,
    deleteProfile,
    restoreProfile,
    validateTransition,
    executeTransition,
  } = useProfile(true);

  const [view, setView] = useState<"profile" | "transition">("profile");

  const handleDelete = async () => {
    if (!confirm("Deactivate your profile? You can restore it later.")) return;
    await deleteProfile();
  };

  const handleRestore = async () => {
    await restoreProfile();
  };

  // ── Loading splash ──────────────────────────────────────────────────────────
  if (loading.profile && !profile) {
    return (
      <div className="max-w-lg mx-auto flex flex-col gap-4">
        <Card className="overflow-hidden animate-pulse">
          <CardHeader className="pb-0">
            <div className="flex items-start justify-between gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex flex-col items-end gap-2 pt-1">
                <Skeleton className="h-5 w-28 rounded-full" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5 flex flex-col gap-3">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-1/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── No profile yet ──────────────────────────────────────────────────────────
  if (exists === false || (!loading.profile && !profile)) {
    return (
      <div className="space-y-2">
        <div className="text-5xl text-stone-300 leading-none select-none">
          ◎
        </div>
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight font-mono">
            No profile yet
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Set up your profile to get started.
          </p>
        </div>
        <Button onClick={() => router.push("/profile/setup")} className="mt-2">
          Create Profile
        </Button>
      </div>
    );
  }

  // ── Profile view ────────────────────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto flex flex-col gap-4">
      <Card className="overflow-hidden">
        {/* Header */}
        <CardHeader className="pb-0 pt-6 px-7">
          <div className="flex items-start justify-between gap-4">
            <ProfileAvatar
              name={profile?.bio?.split(" ").slice(0, 2).join(" ")}
            />
            <div className="flex flex-col items-end gap-1.5 pt-1">
              {profile?.role && <RolePill role={profile.role} />}
              {profile?.isDeleted && (
                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold tracking-widest uppercase rounded-full px-3 bg-red-50 text-red-700 border-red-200"
                >
                  Deactivated
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Body */}
        <CardContent className="px-7 pt-5 pb-6">
          {profile?.bio ? (
            <p className="text-sm text-stone-700 leading-relaxed mb-5">
              {profile.bio}
            </p>
          ) : (
            <p className="text-sm text-stone-400 italic mb-5">No bio yet.</p>
          )}

          <dl className="rounded-lg bg-stone-50 border border-stone-100 divide-y divide-stone-100">
            {profile?.mobileNumber && (
              <div className="flex justify-between items-center px-4 py-3">
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                  Mobile
                </dt>
                <dd className="text-sm text-stone-800 font-mono">
                  {profile.mobileNumber}
                </dd>
              </div>
            )}
            <div className="flex justify-between items-center px-4 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                Member since
              </dt>
              <dd className="text-sm text-stone-800">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </dd>
            </div>
            {profile?.isDeleted && profile.deletedAt && (
              <div className="flex justify-between items-center px-4 py-3">
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                  Deactivated
                </dt>
                <dd className="text-sm text-red-700">
                  {new Date(profile.deletedAt).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>

          {errors.mutation && (
            <Alert variant="destructive" className="mt-4 py-2.5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {errors.mutation}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        {/* Actions */}
        {!adminMode && (
          <>
            <Separator />
            <CardFooter className="px-7 py-4 flex flex-wrap gap-2 bg-stone-50/60">
              {view === "profile" && (
                <>
                  {profile?.role && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setView("transition")}
                    >
                      <UserCog className="h-3.5 w-3.5 mr-1.5" />
                      Switch Role
                    </Button>
                  )}

                  {profile?.isDeleted ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRestore}
                      disabled={loading.restoring}
                      className="text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                      {loading.restoring ? "Restoring…" : "Restore"}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      disabled={loading.deleting}
                      className="text-red-700 border-red-200 bg-red-50 hover:bg-red-100"
                    >
                      <ShieldOff className="h-3.5 w-3.5 mr-1.5" />
                      {loading.deleting ? "Deactivating…" : "Deactivate"}
                    </Button>
                  )}
                </>
              )}

              {view === "transition" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView("profile")}
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                  Back
                </Button>
              )}
            </CardFooter>
          </>
        )}
      </Card>

      {/* Transition panel */}
      {view === "transition" && profile?.role && (
        <Card className="animate-in slide-in-from-bottom-2 duration-200">
          <CardContent className="p-6">
            <TransitionPanel
              currentRole={profile.role}
              onValidate={validateTransition}
              onExecute={executeTransition}
              loading={loading.transition}
              error={errors.transition}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
