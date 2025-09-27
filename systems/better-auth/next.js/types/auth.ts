import { User } from "@prisma/client";

// Extended user type that includes the role field from Better Auth
export interface AuthUser extends Omit<User, 'role'> {
  role: string; // Better Auth stores role as string, not enum
}

// Session type that includes the extended user
export interface AuthSession {
  user: AuthUser;
  session: {
    id: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string;
    userAgent?: string;
    userId: string;
  };
}

// Better Auth client types - using any for now to avoid type conflicts
export type AuthClient = any;

// Type guard to check if user has admin role
export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === 'ADMIN';
}

// Type guard to check if user has editor role
export function isEditor(user: AuthUser | null): boolean {
  return user?.role === 'EDITOR' || user?.role === 'ADMIN';
}
