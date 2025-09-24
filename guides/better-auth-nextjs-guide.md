# Better Auth Next.js Implementation Guide

A comprehensive guide to implementing Better Auth in Next.js applications with API routes, following best practices and security standards.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Project Setup](#project-setup)
4. [Database Configuration](#database-configuration)
5. [Server Configuration](#server-configuration)
6. [Client Configuration](#client-configuration)
7. [API Routes Setup](#api-routes-setup)
8. [Authentication Components](#authentication-components)
9. [Protected Routes](#protected-routes)
10. [Social Providers](#social-providers)
11. [Advanced Features](#advanced-features)
12. [Best Practices](#best-practices)
13. [Troubleshooting](#troubleshooting)

## Overview

Better Auth is a modern authentication library that provides:
- Email & Password authentication
- Social provider authentication (Google, GitHub, Apple, etc.)
- Session management
- Account linking
- Security features (2FA, passkeys, etc.)

## Installation

```bash
npm install better-auth
npm install @better-auth/nextjs
```

## Project Setup

### 1. Environment Variables

Create a `.env.local` file in your project root:

```env
# Database
DATABASE_URL="your_database_url"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Social Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### 2. Database Schema

Better Auth requires specific database tables. Here's the Prisma schema:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or "mysql", "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  accounts Account[]
  sessions Session[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}
```

Run the migration:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Server Configuration

### 1. Auth Configuration

Create `lib/auth.ts`:

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
    },
  },
  plugins: [
    // Add plugins here as needed
  ],
});
```

### 2. Auth Client

Create `lib/auth-client.ts`:

```typescript
import { createAuthClient } from "@better-auth/nextjs";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
```

## API Routes Setup

### 1. Auth API Route

Create `app/api/auth/[...all]/route.ts`:

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "@better-auth/nextjs";

const handler = toNextJsHandler(auth);

export { handler as GET, handler as POST };
```

### 2. Session API Route

Create `app/api/auth/session/route.ts`:

```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return Response.json(session);
}
```

## Authentication Components

### 1. Sign Up Component

Create `components/auth/signup-form.tsx`:

```typescript
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard",
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
```

### 2. Sign In Component

Create `components/auth/signin-form.tsx`:

```typescript
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
```

### 3. Social Sign In Component

Create `components/auth/social-signin.tsx`:

```typescript
"use client";

import { authClient } from "@/lib/auth-client";

export function SocialSignIn() {
  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  const handleGitHubSignIn = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleGoogleSignIn}
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
      >
        Continue with Google
      </button>
      
      <button
        onClick={handleGitHubSignIn}
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
      >
        Continue with GitHub
      </button>
    </div>
  );
}
```

## Protected Routes

### 1. Session Hook

Create `hooks/use-session.ts`:

```typescript
"use client";

import { authClient } from "@/lib/auth-client";

export function useSession() {
  return authClient.useSession();
}
```

### 2. Protected Route Component

Create `components/auth/protected-route.tsx`:

```typescript
"use client";

import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return fallback || <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
```

### 3. User Profile Component

Create `components/auth/user-profile.tsx`:

```typescript
"use client";

import { useSession } from "@/hooks/use-session";
import { authClient } from "@/lib/auth-client";

export function UserProfile() {
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not signed in</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Profile</h2>
        <p>Email: {session.user.email}</p>
        <p>Name: {session.user.name}</p>
        {session.user.image && (
          <img
            src={session.user.image}
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
        )}
      </div>
      
      <button
        onClick={handleSignOut}
        className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  );
}
```

## Advanced Features

### 1. Account Linking

```typescript
// Link additional social accounts
const linkGoogle = async () => {
  await authClient.linkSocial({
    provider: "google",
    callbackURL: "/dashboard",
  });
};

// Unlink accounts
const unlinkAccount = async (providerId: string) => {
  await authClient.unlinkAccount({ providerId });
};
```

### 2. Password Reset

```typescript
// Request password reset
const requestPasswordReset = async (email: string) => {
  await authClient.forgetPassword({
    email,
    redirectTo: "/reset-password",
  });
};

// Reset password
const resetPassword = async (token: string, password: string) => {
  await authClient.resetPassword({
    token,
    password,
  });
};
```

### 3. Email Verification

```typescript
// Send verification email
const sendVerificationEmail = async () => {
  await authClient.sendVerificationEmail({
    email: session.user.email,
    redirectTo: "/dashboard",
  });
};

// Verify email
const verifyEmail = async (token: string) => {
  await authClient.verifyEmail({ token });
};
```

## Best Practices

### 1. Security

- Always use HTTPS in production
- Set secure environment variables
- Implement rate limiting on auth endpoints
- Use strong password requirements
- Enable CSRF protection

### 2. Error Handling

```typescript
// Comprehensive error handling
try {
  const result = await authClient.signIn.email({ email, password });
  if (result.error) {
    // Handle specific error cases
    switch (result.error.code) {
      case "INVALID_CREDENTIALS":
        setError("Invalid email or password");
        break;
      case "EMAIL_NOT_VERIFIED":
        setError("Please verify your email address");
        break;
      default:
        setError("An error occurred during sign in");
    }
  }
} catch (error) {
  // Handle unexpected errors
  setError("An unexpected error occurred");
}
```

### 3. Session Management

```typescript
// Configure session settings
export const auth = betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
});
```

### 4. Database Optimization

```typescript
// Use database indexes
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([sessionToken])
  @@index([userId])
  @@index([expires])
  @@map("sessions")
}
```

## Troubleshooting

### Common Issues

1. **Session not persisting**
   - Check cookie settings
   - Verify domain configuration
   - Ensure HTTPS in production

2. **Social provider errors**
   - Verify client ID and secret
   - Check redirect URLs
   - Ensure proper scopes

3. **Database connection issues**
   - Verify DATABASE_URL
   - Check Prisma schema
   - Run migrations

### Debug Mode

```typescript
export const auth = betterAuth({
  // ... other config
  logger: {
    level: "debug",
  },
});
```

## Conclusion

This guide provides a comprehensive implementation of Better Auth in Next.js applications. The setup includes:

- Complete authentication flow
- Social provider integration
- Session management
- Protected routes
- Best practices for security

For more advanced features and customization options, refer to the [Better Auth documentation](https://www.better-auth.com/docs).

## Additional Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [Prisma Documentation](https://www.prisma.io/docs)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)
