// api/profiles/profile.api.ts

import { UserRole } from "@/types/base.types";
import { IUserProfile, DomainProfile, ProfileResponse, CreateProfileRequestBody, UpdateProfileRequestBody } from "@/types/profiles/core.user.profile.types";
import { APIClient } from "../base/api-client";

// ─── Supplementary Response Types ─────────────────────────────────────────────

export interface ProfileStatsResponse {
  success: boolean;
  message: string;
  stats?: {
    totalProfiles: number;
    activeProfiles: number;
    deletedProfiles: number;
    roleBreakdown: Record<UserRole, number>;
  };
}

export interface ProfileExistsResponse {
  success: boolean;
  exists: boolean;
  message?: string;
}

export interface ProfileListResponse {
  success: boolean;
  message: string;
  profiles: Partial<IUserProfile>[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface RoleTransitionValidateResponse {
  success: boolean;
  eligible: boolean;
  message: string;
  warnings?: string[];
  dataImpact?: {
    willBeDeactivated: string[];
    willBeRetained: string[];
  };
}

export interface RoleTransitionExecuteBody {
  toRole: UserRole;
  acknowledgedDataHandling: true;
}

export interface RoleTransitionExecuteResponse {
  success: boolean;
  message: string;
  newProfile?: Partial<IUserProfile>;
  previousRole?: UserRole;
}

export interface RoleTransitionHistoryResponse {
  success: boolean;
  message: string;
  history: Array<
    Pick<DomainProfile, "role" | "isActive" | "activatedAt" | "deactivatedAt" | "createdAt">
  >;
}

export interface BatchProfilesBody {
  userIds: string[];
}

// ─── Profile API Client ────────────────────────────────────────────────────────

export class ProfileAPIClient extends APIClient {
  private readonly base = "/api/profile";

  // ── Existence Check ────────────────────────────────────────────────────────

  async checkProfileExists(): Promise<ProfileExistsResponse> {
    return this.get<ProfileExistsResponse>(`${this.base}/exists`);
  }

  // ── Current User ───────────────────────────────────────────────────────────

  async getMyProfile(): Promise<ProfileResponse> {
    return this.get<ProfileResponse>(`${this.base}/me`);
  }

  async getCompleteProfile(): Promise<ProfileResponse> {
    return this.get<ProfileResponse>(`${this.base}/me/complete`);
  }

  async getMyProfileStats(): Promise<ProfileStatsResponse> {
    return this.get<ProfileStatsResponse>(`${this.base}/me/stats`);
  }

  // ── CRUD ───────────────────────────────────────────────────────────────────

  async createProfile(body: CreateProfileRequestBody): Promise<ProfileResponse> {
    return this.post<ProfileResponse>(`${this.base}/`, body);
  }

  async updateMyProfile(body: UpdateProfileRequestBody): Promise<ProfileResponse> {
    return this.patch<ProfileResponse>(`${this.base}/me`, body);
  }

  async deleteMyProfile(): Promise<ProfileResponse> {
    return this.delete<ProfileResponse>(`${this.base}/me`);
  }

  async restoreMyProfile(): Promise<ProfileResponse> {
    return this.post<ProfileResponse>(`${this.base}/me/restore`);
  }

  // ── Discovery ──────────────────────────────────────────────────────────────

  async searchProfiles(query: string): Promise<ProfileListResponse> {
    return this.get<ProfileListResponse>(`${this.base}/search`, { q: query });
  }

  async getProfilesByUserIds(userIds: string[]): Promise<ProfileListResponse> {
    return this.post<ProfileListResponse>(`${this.base}/batch`, {
      userIds,
    } satisfies BatchProfilesBody);
  }

  // ── Role Transitions ───────────────────────────────────────────────────────

  async validateRoleTransition(toRole: UserRole): Promise<RoleTransitionValidateResponse> {
    return this.get<RoleTransitionValidateResponse>(
      `${this.base}/role-transition/validate`,
      { toRole }
    );
  }

  async executeRoleTransition(
    toRole: UserRole
  ): Promise<RoleTransitionExecuteResponse> {
    return this.post<RoleTransitionExecuteResponse>(
      `${this.base}/role-transition`,
      { toRole, acknowledgedDataHandling: true } satisfies RoleTransitionExecuteBody
    );
  }

  async getRoleTransitionHistory(): Promise<RoleTransitionHistoryResponse> {
    return this.get<RoleTransitionHistoryResponse>(
      `${this.base}/role-transition/history`
    );
  }

  // ── Admin ──────────────────────────────────────────────────────────────────

  async getAllProfiles(page?: number, limit?: number): Promise<ProfileListResponse> {
    return this.get<ProfileListResponse>(this.base, { page, limit });
  }

  async getProfileByUserId(userId: string): Promise<ProfileResponse> {
    return this.get<ProfileResponse>(`${this.base}/user/${userId}`);
  }

  async getProfileById(profileId: string): Promise<ProfileResponse> {
    return this.get<ProfileResponse>(`${this.base}/${profileId}`);
  }

  async updateProfileById(
    profileId: string,
    body: UpdateProfileRequestBody
  ): Promise<ProfileResponse> {
    return this.patch<ProfileResponse>(`${this.base}/${profileId}`, body);
  }

  async permanentlyDeleteProfile(userId: string): Promise<ProfileResponse> {
    return this.delete<ProfileResponse>(`${this.base}/${userId}/permanent`);
  }

  async bulkUpdateProfiles(
    updates: Array<{ profileId: string } & UpdateProfileRequestBody>
  ): Promise<ProfileListResponse> {
    return this.patch<ProfileListResponse>(`${this.base}/bulk`, { updates });
  }
}

// ─── Singleton Export ──────────────────────────────────────────────────────────

export const profileAPI = new ProfileAPIClient();