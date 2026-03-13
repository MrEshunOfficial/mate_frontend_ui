// hooks/useProfile.ts

import { ProfileStatsResponse, RoleTransitionHistoryResponse, RoleTransitionValidateResponse, profileAPI } from "@/lib/api/profiles/core.user.profile.api";
import { UserRole } from "@/types/base.types";
import { IUserProfile, CreateProfileRequestBody, UpdateProfileRequestBody } from "@/types/profiles/core.user.profile.types";
import { useState, useCallback, useEffect } from "react";

// ─── State Shape ───────────────────────────────────────────────────────────────

interface ProfileState {
  profile: Partial<IUserProfile> | null;
  stats: ProfileStatsResponse["stats"] | null;
  exists: boolean | null;
  transitionHistory: RoleTransitionHistoryResponse["history"];
}

interface LoadingState {
  profile: boolean;
  stats: boolean;
  exists: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  restoring: boolean;
  transition: boolean;
  transitionHistory: boolean;
}

interface ErrorState {
  profile: string | null;
  stats: string | null;
  exists: string | null;
  mutation: string | null;
  transition: string | null;
}

// ─── Return Type ───────────────────────────────────────────────────────────────

export interface UseProfileReturn {
  // State
  profile: Partial<IUserProfile> | null;
  stats: ProfileStatsResponse["stats"] | null;
  exists: boolean | null;
  transitionHistory: RoleTransitionHistoryResponse["history"];
  loading: LoadingState;
  errors: ErrorState;

  // Queries
  fetchProfile: () => Promise<void>;
  fetchCompleteProfile: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchExists: () => Promise<void>;
  fetchTransitionHistory: () => Promise<void>;

  // Mutations
  createProfile: (body: CreateProfileRequestBody) => Promise<Partial<IUserProfile> | null>;
  updateProfile: (body: UpdateProfileRequestBody) => Promise<Partial<IUserProfile> | null>;
  deleteProfile: () => Promise<boolean>;
  restoreProfile: () => Promise<boolean>;

  // Role Transition
  validateTransition: (toRole: UserRole) => Promise<RoleTransitionValidateResponse | null>;
  executeTransition: (toRole: UserRole) => Promise<boolean>;

  // Helpers
  clearError: (key: keyof ErrorState) => void;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useProfile(autoFetch = true): UseProfileReturn {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    stats: null,
    exists: null,
    transitionHistory: [],
  });

  const [loading, setLoading] = useState<LoadingState>({
    profile: false,
    stats: false,
    exists: false,
    creating: false,
    updating: false,
    deleting: false,
    restoring: false,
    transition: false,
    transitionHistory: false,
  });

  const [errors, setErrors] = useState<ErrorState>({
    profile: null,
    stats: null,
    exists: null,
    mutation: null,
    transition: null,
  });

  // ── Helpers ────────────────────────────────────────────────────────────────

  const setLoadingKey = (key: keyof LoadingState, value: boolean) =>
    setLoading((prev) => ({ ...prev, [key]: value }));

  const setErrorKey = (key: keyof ErrorState, value: string | null) =>
    setErrors((prev) => ({ ...prev, [key]: value }));

  const clearError = useCallback((key: keyof ErrorState) => {
    setErrorKey(key, null);
  }, []);

  const extractError = (err: unknown): string =>
    err instanceof Error ? err.message : "An unexpected error occurred.";

  // ── Queries ────────────────────────────────────────────────────────────────

  const fetchProfile = useCallback(async () => {
    setLoadingKey("profile", true);
    setErrorKey("profile", null);
    try {
      const res = await profileAPI.getMyProfile();
      setState((prev) => ({ ...prev, profile: res.profile ?? null }));
    } catch (err) {
      setErrorKey("profile", extractError(err));
    } finally {
      setLoadingKey("profile", false);
    }
  }, []);

  const fetchCompleteProfile = useCallback(async () => {
    setLoadingKey("profile", true);
    setErrorKey("profile", null);
    try {
      const res = await profileAPI.getCompleteProfile();
      setState((prev) => ({ ...prev, profile: res.profile ?? null }));
    } catch (err) {
      setErrorKey("profile", extractError(err));
    } finally {
      setLoadingKey("profile", false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setLoadingKey("stats", true);
    setErrorKey("stats", null);
    try {
      const res = await profileAPI.getMyProfileStats();
      setState((prev) => ({ ...prev, stats: res.stats ?? null }));
    } catch (err) {
      setErrorKey("stats", extractError(err));
    } finally {
      setLoadingKey("stats", false);
    }
  }, []);

  const fetchExists = useCallback(async () => {
    setLoadingKey("exists", true);
    setErrorKey("exists", null);
    try {
      const res = await profileAPI.checkProfileExists();
      setState((prev) => ({ ...prev, exists: res.exists }));
    } catch (err) {
      setErrorKey("exists", extractError(err));
    } finally {
      setLoadingKey("exists", false);
    }
  }, []);

  const fetchTransitionHistory = useCallback(async () => {
    setLoadingKey("transitionHistory", true);
    try {
      const res = await profileAPI.getRoleTransitionHistory();
      setState((prev) => ({ ...prev, transitionHistory: res.history ?? [] }));
    } catch {
      // non-critical — swallow silently
    } finally {
      setLoadingKey("transitionHistory", false);
    }
  }, []);

  // ── Mutations ──────────────────────────────────────────────────────────────

  const createProfile = useCallback(
    async (body: CreateProfileRequestBody): Promise<Partial<IUserProfile> | null> => {
      setLoadingKey("creating", true);
      setErrorKey("mutation", null);
      try {
        const res = await profileAPI.createProfile(body);
        if (res.profile) {
          setState((prev) => ({ ...prev, profile: res.profile!, exists: true }));
        }
        return res.profile ?? null;
      } catch (err) {
        setErrorKey("mutation", extractError(err));
        return null;
      } finally {
        setLoadingKey("creating", false);
      }
    },
    []
  );

  const updateProfile = useCallback(
    async (body: UpdateProfileRequestBody): Promise<Partial<IUserProfile> | null> => {
      setLoadingKey("updating", true);
      setErrorKey("mutation", null);
      try {
        const res = await profileAPI.updateMyProfile(body);
        if (res.profile) {
          setState((prev) => ({
            ...prev,
            profile: { ...prev.profile, ...res.profile },
          }));
        }
        return res.profile ?? null;
      } catch (err) {
        setErrorKey("mutation", extractError(err));
        return null;
      } finally {
        setLoadingKey("updating", false);
      }
    },
    []
  );

  const deleteProfile = useCallback(async (): Promise<boolean> => {
    setLoadingKey("deleting", true);
    setErrorKey("mutation", null);
    try {
      await profileAPI.deleteMyProfile();
      setState((prev) => ({
        ...prev,
        profile: prev.profile
          ? { ...prev.profile, isDeleted: true, deletedAt: new Date() }
          : null,
      }));
      return true;
    } catch (err) {
      setErrorKey("mutation", extractError(err));
      return false;
    } finally {
      setLoadingKey("deleting", false);
    }
  }, []);

  const restoreProfile = useCallback(async (): Promise<boolean> => {
    setLoadingKey("restoring", true);
    setErrorKey("mutation", null);
    try {
      const res = await profileAPI.restoreMyProfile();
      if (res.profile) {
        setState((prev) => ({
          ...prev,
          profile: { ...prev.profile, ...res.profile, isDeleted: false, deletedAt: undefined },
        }));
      }
      return true;
    } catch (err) {
      setErrorKey("mutation", extractError(err));
      return false;
    } finally {
      setLoadingKey("restoring", false);
    }
  }, []);

  // ── Role Transitions ───────────────────────────────────────────────────────

  const validateTransition = useCallback(
    async (toRole: UserRole): Promise<RoleTransitionValidateResponse | null> => {
      setLoadingKey("transition", true);
      setErrorKey("transition", null);
      try {
        return await profileAPI.validateRoleTransition(toRole);
      } catch (err) {
        setErrorKey("transition", extractError(err));
        return null;
      } finally {
        setLoadingKey("transition", false);
      }
    },
    []
  );

  const executeTransition = useCallback(async (toRole: UserRole): Promise<boolean> => {
    setLoadingKey("transition", true);
    setErrorKey("transition", null);
    try {
      const res = await profileAPI.executeRoleTransition(toRole);
      if (res.newProfile) {
        setState((prev) => ({ ...prev, profile: res.newProfile! }));
      }
      return res.success;
    } catch (err) {
      setErrorKey("transition", extractError(err));
      return false;
    } finally {
      setLoadingKey("transition", false);
    }
  }, []);

  // ── Auto Fetch ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!autoFetch) return;
    fetchExists().then(() => {
      // Only fetch profile data if the profile actually exists.
      // `exists` is set on state asynchronously, so we use the returned
      // value from fetchExists if the API exposed it — for now we just fetch.
      fetchProfile();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]);

  return {
    profile: state.profile,
    stats: state.stats,
    exists: state.exists,
    transitionHistory: state.transitionHistory,
    loading,
    errors,
    fetchProfile,
    fetchCompleteProfile,
    fetchStats,
    fetchExists,
    fetchTransitionHistory,
    createProfile,
    updateProfile,
    deleteProfile,
    restoreProfile,
    validateTransition,
    executeTransition,
    clearError,
  };
}