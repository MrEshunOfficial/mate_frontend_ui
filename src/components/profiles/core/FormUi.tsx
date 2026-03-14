"use client";

import { useProfile } from "@/hooks/profiles/useCoreUserProfile";
import { UserRole } from "@/types/base.types";
import { CreateProfileRequestBody } from "@/types/profiles/core.user.profile.types";
import { useState, useId } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ProfileFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  /** Controlled — skip the hook's internal mutation and call this instead. */
  onSubmit?: (values: CreateProfileRequestBody) => Promise<void>;
}

type FieldErrors = Partial<Record<"bio" | "mobileNumber" | "role", string>>;

// ─── Validation ────────────────────────────────────────────────────────────────

function validate(
  bio: string,
  mobileNumber: string,
  role: UserRole | "",
): FieldErrors {
  const errs: FieldErrors = {};

  if (bio.trim().length > 0 && bio.trim().length < 10)
    errs.bio = "Bio must be at least 10 characters, or leave it blank.";
  if (bio.trim().length > 500) errs.bio = "Bio must not exceed 500 characters.";

  if (mobileNumber.trim().length > 0) {
    const cleaned = mobileNumber.replace(/\s/g, "");
    if (!/^\+?[0-9]{7,15}$/.test(cleaned))
      errs.mobileNumber = "Enter a valid phone number (e.g. +233201234567).";
  }

  if (!role) errs.role = "Please choose a role to continue.";

  return errs;
}

// ─── Role Selector ─────────────────────────────────────────────────────────────

const ROLE_OPTIONS: {
  role: UserRole;
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    role: UserRole.CUSTOMER,
    label: "Customer",
    desc: "Browse and book services from providers.",
    icon: "◈",
  },
  {
    role: UserRole.PROVIDER,
    label: "Service Provider",
    desc: "List and offer your services to customers.",
    icon: "◉",
  },
];

function RoleSelector({
  value,
  onChange,
  error,
}: {
  value: UserRole | "";
  onChange: (r: UserRole) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-3">
        {ROLE_OPTIONS.map((opt) => {
          const active = value === opt.role;
          return (
            <button
              key={opt.role}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt.role)}
              className={cn(
                "flex flex-col items-start gap-1.5 rounded-xl border-2 p-4 text-left transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "border-stone-900 bg-lime-200 shadow-sm"
                  : "border-border bg-white hover:bg-stone-50",
              )}
            >
              <span className="text-2xl leading-none">{opt.icon}</span>
              <span className="text-sm font-semibold text-stone-900 font-mono">
                {opt.label}
              </span>
              <span className="text-xs text-stone-500 leading-snug">
                {opt.desc}
              </span>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Main Form ─────────────────────────────────────────────────────────────────

export function ProfileForm({
  onSuccess,
  onCancel,
  onSubmit: externalSubmit,
}: ProfileFormProps) {
  const uid = useId();
  const { createProfile, loading, errors: hookErrors } = useProfile(false);

  const [bio, setBio] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [role, setRole] = useState<UserRole | "">("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const isLoading = loading.creating;
  const bioCount = bio.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setGlobalError(null);

    const errs = validate(bio, mobileNumber, role);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload: CreateProfileRequestBody = {
      role: role as UserRole,
      bio: bio.trim() || undefined,
      mobileNumber: mobileNumber.trim() || undefined,
    };

    try {
      if (externalSubmit) {
        await externalSubmit(payload);
        onSuccess?.();
        return;
      }

      // createProfile only returns null on a caught exception — a truthy
      // return (even an empty object) means the API call succeeded.
      const result = await createProfile(payload);

      if (result !== null) {
        onSuccess?.();
      } else {
        setGlobalError(hookErrors.mutation ?? "Failed to create profile.");
      }
    } catch (err) {
      setGlobalError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  };

  // Live re-validate after first attempt
  const handleBioChange = (val: string) => {
    setBio(val);
    if (submitted)
      setFieldErrors((p) => ({
        ...p,
        bio: validate(val, mobileNumber, role).bio,
      }));
  };

  const handleMobileChange = (val: string) => {
    setMobileNumber(val);
    if (submitted)
      setFieldErrors((p) => ({
        ...p,
        mobileNumber: validate(bio, val, role).mobileNumber,
      }));
  };

  const handleRoleChange = (r: UserRole) => {
    setRole(r);
    if (submitted) setFieldErrors((p) => ({ ...p, role: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-0">
      <div className="px-7 pt-7 pb-6">
        <h2 className="text-xl font-bold text-stone-900 tracking-tight font-mono">
          Create Your Profile
        </h2>
        <p className="text-sm text-stone-500 mt-1.5 leading-relaxed">
          Choose your role and fill in your details to get started.
        </p>
      </div>

      {/* Fields */}
      <div className="px-7 flex flex-col gap-6">
        {/* Role */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-semibold uppercase tracking-widest text-stone-600">
            I am a… <span className="text-red-500 ml-0.5">*</span>
          </Label>
          <RoleSelector
            value={role}
            onChange={handleRoleChange}
            error={fieldErrors.role}
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor={`${uid}-bio`}
            className="text-xs font-semibold uppercase tracking-widest text-stone-600"
          >
            Bio
          </Label>
          <p className="text-xs text-stone-400 -mt-1">
            Tell others about yourself. 10–500 characters.
          </p>
          <div className="relative">
            <Textarea
              id={`${uid}-bio`}
              rows={4}
              placeholder="e.g. Experienced electrician based in Accra with 8 years in residential installations…"
              value={bio}
              onChange={(e) => handleBioChange(e.target.value)}
              maxLength={500}
              className={cn(
                "resize-none pr-14 text-sm",
                fieldErrors.bio && "border-red-400 focus-visible:ring-red-300",
              )}
            />
            <span
              className={cn(
                "absolute bottom-2.5 right-3 text-[10px] font-mono pointer-events-none",
                bioCount > 460 ? "text-amber-500" : "text-stone-400",
              )}
            >
              {bioCount}/500
            </span>
          </div>
          {fieldErrors.bio && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {fieldErrors.bio}
            </p>
          )}
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor={`${uid}-mobile`}
            className="text-xs font-semibold uppercase tracking-widest text-stone-600"
          >
            Mobile Number
          </Label>
          <p className="text-xs text-stone-400 -mt-1">
            Include country code, e.g. +233201234567
          </p>
          <Input
            id={`${uid}-mobile`}
            type="tel"
            placeholder="+233201234567"
            value={mobileNumber}
            onChange={(e) => handleMobileChange(e.target.value)}
            autoComplete="tel"
            className={cn(
              "text-sm font-mono",
              fieldErrors.mobileNumber &&
                "border-red-400 focus-visible:ring-red-300",
            )}
          />
          {fieldErrors.mobileNumber && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {fieldErrors.mobileNumber}
            </p>
          )}
        </div>

        {/* Global error */}
        {globalError && (
          <Alert variant="destructive" className="py-2.5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {globalError}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Footer */}
      <div className="px-7 pt-6 pb-7 flex justify-end gap-2.5 mt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin inline-block" />
              Creating…
            </span>
          ) : (
            "Create Profile"
          )}{" "}
        </Button>
      </div>
    </form>
  );
}
