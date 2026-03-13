// import { APIClient } from "../base/api-client";
import {
  SignupData,
  AuthResponse,
  LoginData,
  VerifyEmailData,
  ResendVerificationData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  StatusResponse,
  RestoreAccountData,
  VerifyAccessResponse,
  GetUsersParams,
  PaginatedUsersResponse,
  UpdateUserRoleData,
  HealthCheckResponse,
} from "@/types/user.types";
import { APIClient } from "../base/api-client";

export class AuthAPI extends APIClient {
  private readonly endpoint = "/api/auth";

  // ── Authentication ──────────────────────────────────────────────────────────

  async signup(userData: SignupData): Promise<AuthResponse> {
    return this.post<AuthResponse>(`${this.endpoint}/signup`, userData);
  }

  async login(credentials: LoginData): Promise<AuthResponse> {
    return this.post<AuthResponse>(`${this.endpoint}/login`, credentials);
  }

  async logout(): Promise<AuthResponse> {
    return this.post<AuthResponse>(`${this.endpoint}/logout`);
  }

  // ── Email Verification ──────────────────────────────────────────────────────

  async verifyEmail(data: VerifyEmailData): Promise<AuthResponse> {
    return this.post<AuthResponse>(`${this.endpoint}/verify-email`, data);
  }

  async resendVerification(data: ResendVerificationData): Promise<AuthResponse> {
    return this.post<AuthResponse>(`${this.endpoint}/resend-verification`, data);
  }

  // ── Password Management ─────────────────────────────────────────────────────

  async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
    return this.post<AuthResponse>(`${this.endpoint}/forgot-password`, data);
  }

  async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    return this.post<AuthResponse>(`${this.endpoint}/reset-password`, data);
  }

  async changePassword(data: ChangePasswordData): Promise<AuthResponse> {
    return this.post<AuthResponse>(`${this.endpoint}/change-password`, data);
  }

  // ── Token Management ────────────────────────────────────────────────────────

  async refreshToken(): Promise<AuthResponse> {
    return this.post<AuthResponse>(`${this.endpoint}/refresh-token`);
  }

  // ── Current User ────────────────────────────────────────────────────────────

  async getCurrentUser(): Promise<AuthResponse> {
    return this.get<AuthResponse>(`${this.endpoint}/me`);
  }

  async getAuthStatus(): Promise<StatusResponse> {
    return this.get<StatusResponse>(`${this.endpoint}/status`);
  }

  // ── Account Management ──────────────────────────────────────────────────────

  async deleteAccount(): Promise<AuthResponse> {
    return this.delete<AuthResponse>(`${this.endpoint}/account`);
  }

  async restoreAccount(data: RestoreAccountData): Promise<AuthResponse> {
    return this.post<AuthResponse>(`${this.endpoint}/restore-account`, data);
  }

  // ── Access Verification ─────────────────────────────────────────────────────

  async verifyEmailAccess(): Promise<VerifyAccessResponse> {
    return this.get<VerifyAccessResponse>(
      `${this.endpoint}/verify-access/verified`
    );
  }

  async verifyAdminAccess(): Promise<VerifyAccessResponse> {
    return this.get<VerifyAccessResponse>(
      `${this.endpoint}/verify-access/admin`
    );
  }

  async verifySuperAdminAccess(): Promise<VerifyAccessResponse> {
    return this.get<VerifyAccessResponse>(
      `${this.endpoint}/verify-access/super-admin`
    );
  }

  // ── Admin — User Management ─────────────────────────────────────────────────

  async getAllUsers(params?: GetUsersParams): Promise<PaginatedUsersResponse> {
    return this.get<PaginatedUsersResponse>(
      `${this.endpoint}/admin/users`,
      params
    );
  }

  async getUserById(userId: string): Promise<AuthResponse> {
    return this.get<AuthResponse>(`${this.endpoint}/admin/users/${userId}`);
  }

  // ── Super Admin — Privileged Operations ────────────────────────────────────

  // FIX: userId was typed as string | undefined — callers must resolve the ID
  // before calling this method. The undefined check belongs at the call site,
  // not inside the API layer.
  async updateUserRole(userId: string, data: UpdateUserRoleData): Promise<AuthResponse> {
    return this.patch<AuthResponse>(
      `${this.endpoint}/admin/users/${userId}/role`,
      data
    );
  }

  async deleteUser(userId: string): Promise<AuthResponse> {
    return this.delete<AuthResponse>(`${this.endpoint}/admin/users/${userId}`);
  }

  async restoreUser(userId: string): Promise<AuthResponse> {
    return this.post<AuthResponse>(
      `${this.endpoint}/admin/users/${userId}/restore`
    );
  }

  // ── Health Check ────────────────────────────────────────────────────────────

  async healthCheck(): Promise<HealthCheckResponse> {
    return this.get<HealthCheckResponse>(`${this.endpoint}/health`);
  }
}

export const authAPI = new AuthAPI();