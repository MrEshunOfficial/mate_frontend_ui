// ─── Auth Provider ────────────────────────────────────────────────────────────

// Mirrors backend AuthProvider enum. Kept as a const enum so it tree-shakes
// cleanly in the frontend bundle and can be used as both a type and a value.
export enum AuthProvider {
  CREDENTIALS = "credentials",
  GOOGLE      = "google",
  APPLE       = "apple",
  GITHUB      = "github",
  FACEBOOK    = "facebook",
}

// ─── System Role ──────────────────────────────────────────────────────────────

// Mirrors backend SystemRole enum.
// isAdmin / isSuperAdmin were removed from the User shape — derive at call site:
//   user.systemRole === SystemRole.ADMIN
//   user.systemRole === SystemRole.SUPER_ADMIN
export enum SystemRole {
  USER        = "user",
  ADMIN       = "admin",
  SUPER_ADMIN = "super_admin",
}

// ─── User ─────────────────────────────────────────────────────────────────────

// Matches the shape returned by getUserResponse() in auth.service.ts.
// Only include fields the backend actually sends — never infer fields that
// were removed (isAdmin, isSuperAdmin).
export interface User {
  id: string;
  name: string;
  email: string;
  systemRole: SystemRole;
  isEmailVerified: boolean;
  authProvider: AuthProvider;
  profileId: string | null;
  lastLogin: string | null;   // ISO date string from JSON serialisation
  createdAt: string;
}

// Convenience helpers — derive admin status from systemRole, never from
// removed boolean fields.
export const isAdmin = (user: User): boolean =>
  user.systemRole === SystemRole.ADMIN ||
  user.systemRole === SystemRole.SUPER_ADMIN;

export const isSuperAdmin = (user: User): boolean =>
  user.systemRole === SystemRole.SUPER_ADMIN;

// ─── Auth Responses ───────────────────────────────────────────────────────────

// Base shape every auth endpoint returns.
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  profile?: Record<string, unknown> | null;
  hasProfile?: boolean;
  token?: string;
  requiresVerification?: boolean;
  email?: string;
  error?: string;
}

export interface StatusResponse {
  success: boolean;
  isAuthenticated: boolean;
  userId?: string;
  systemRole?: SystemRole;
}

export interface VerifyAccessResponse {
  success: boolean;
  message: string;
  verified?: boolean;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  user?: {
    id: string;
    email: string;
    systemRole: SystemRole;
    systemAdminName?: string;
  };
}

export interface HealthCheckResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

// ─── Paginated Users ──────────────────────────────────────────────────────────

export interface PaginatedUsersResponse {
  success: boolean;
  message: string;
  users?: User[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  token: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface RestoreAccountData {
  email: string;
}

export interface UpdateUserRoleData {
  systemRole: SystemRole;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
  [key: string]: string | number | boolean | undefined;
}