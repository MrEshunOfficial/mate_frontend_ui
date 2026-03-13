import { useState, useEffect, useCallback } from "react";
import {
  User,
  LoginData,
  SignupData,
  VerifyEmailData,
  ResendVerificationData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  RestoreAccountData,
  AuthResponse,
} from "@/types/user.types";
import { authAPI } from "@/lib/api/auth/auth.api";
import { APIError } from "@/lib/api/base/api-client";

// ─── State & Actions ──────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginData) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  verifyEmail: (data: VerifyEmailData) => Promise<void>;
  resendVerification: (data: ResendVerificationData) => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  deleteAccount: () => Promise<void>;
  restoreAccount: (data: RestoreAccountData) => Promise<void>;
  refreshToken: () => Promise<void>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthState & AuthActions => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // ── Shared Action Wrapper ───────────────────────────────────────────────────

  const handleAuthAction = useCallback(
    async (
      action: () => Promise<AuthResponse>,
      onSuccess?: (response: AuthResponse) => void
    ) => {
      try {
        updateState({ isLoading: true, error: null });
        const response = await action();

        // Backend always returns success: boolean — only update user state
        // when a user object is present in the response.
        if (response.user) {
          updateState({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          updateState({ isLoading: false });
        }

        onSuccess?.(response);
      } catch (error) {
        const apiError = error as APIError;
        const errorMessage = apiError.message ?? "An unexpected error occurred";

        updateState({
          error: errorMessage,
          isLoading: false,
          // A 401 means the session is gone — clear the user immediately
          ...(apiError.status === 401
            ? { user: null, isAuthenticated: false }
            : {}),
        });

        throw error;
      }
    },
    [updateState]
  );

  // ── Authentication ──────────────────────────────────────────────────────────

  const login = useCallback(
    (credentials: LoginData) =>
      handleAuthAction(() => authAPI.login(credentials)),
    [handleAuthAction]
  );

  const signup = useCallback(
    (userData: SignupData) =>
      handleAuthAction(() => authAPI.signup(userData)),
    [handleAuthAction]
  );

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Non-fatal — clear local state regardless
      console.warn("Logout API call failed:", error);
    } finally {
      updateState({ user: null, isAuthenticated: false, error: null });
    }
  }, [updateState]);

  const refreshUser = useCallback(
    () => handleAuthAction(() => authAPI.getCurrentUser()),
    [handleAuthAction]
  );

  // ── Email Verification ──────────────────────────────────────────────────────

  const verifyEmail = useCallback(
    (data: VerifyEmailData) =>
      handleAuthAction(() => authAPI.verifyEmail(data)),
    [handleAuthAction]
  );

  const resendVerification = useCallback(
    (data: ResendVerificationData) =>
      handleAuthAction(() => authAPI.resendVerification(data)),
    [handleAuthAction]
  );

  // ── Password Management ─────────────────────────────────────────────────────

  const forgotPassword = useCallback(
    (data: ForgotPasswordData) =>
      handleAuthAction(() => authAPI.forgotPassword(data)),
    [handleAuthAction]
  );

  const resetPassword = useCallback(
    (data: ResetPasswordData) =>
      handleAuthAction(() => authAPI.resetPassword(data)),
    [handleAuthAction]
  );

  const changePassword = useCallback(
    (data: ChangePasswordData) =>
      handleAuthAction(() => authAPI.changePassword(data)),
    [handleAuthAction]
  );

  // ── Token Management ────────────────────────────────────────────────────────

  const refreshToken = useCallback(
    () => handleAuthAction(() => authAPI.refreshToken()),
    [handleAuthAction]
  );

  // ── Account Management ──────────────────────────────────────────────────────

  const deleteAccount = useCallback(
    () =>
      handleAuthAction(
        () => authAPI.deleteAccount(),
        () => updateState({ user: null, isAuthenticated: false })
      ),
    [handleAuthAction, updateState]
  );

  const restoreAccount = useCallback(
    (data: RestoreAccountData) =>
      handleAuthAction(
        () => authAPI.restoreAccount(data),
        // Account restored but user must log in again — clear local state
        () => updateState({ user: null, isAuthenticated: false })
      ),
    [handleAuthAction, updateState]
  );

  const clearError = useCallback(
    () => updateState({ error: null }),
    [updateState]
  );

  // ── Bootstrap ───────────────────────────────────────────────────────────────

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const response = await authAPI.getCurrentUser();

        if (!mounted) return;

        if (response.user) {
          updateState({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          updateState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        if (!mounted) return;

        const apiError = error as APIError;
        console.warn("Auth initialization failed:", error);

        updateState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          // Don't surface "not authenticated" as a visible error — it's the
          // expected state for any unauthenticated visitor.
          error: apiError.status !== 401 ? (apiError.message ?? null) : null,
        });
      }
    };

    initializeAuth();
    return () => { mounted = false; };
  }, [updateState]);

  return {
    ...state,
    login,
    signup,
    logout,
    refreshUser,
    clearError,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    changePassword,
    deleteAccount,
    restoreAccount,
    refreshToken,
  };
};