# Complete Better Auth Implementation Guide for Next.js

This guide provides a comprehensive, step-by-step implementation of Better Auth in a Next.js application with role-based authentication for admins. This guide includes all mistakes encountered and their solutions, ensuring you can recreate the exact same authentication system.

## 📁 Project Structure

```
your-nextjs-app/
├── .env
├── lib/
│   ├── auth.ts
│   └── auth-client.ts
├── app/
│   ├── layout.tsx
│   ├── unauthorized/
│   │   └── page.tsx
│   ├── signin/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   └── blog/
│   │       ├── page.tsx
│   │       ├── create/
│   │       │   └── page.tsx
│   │       └── [slug]/
│   │           └── edit/
│   │               └── page.tsx
│   └── api/
│       └── auth/
│           └── [...all]/
│               └── route.ts
├── prisma/
│   └── schema.prisma
└── package.json
```

## 🚀 Step-by-Step Implementation

### Step 1: Install Dependencies

```bash
# Install Better Auth
pnpm install better-auth

# Install Sonner for toast notifications (optional but recommended)
pnpm install sonner
```

### Step 2: Environment Variables

Create/update your `.env` file:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your-generated-secret-here
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (existing)
DATABASE_URL="your-database-url"
DIRECT_URL="your-direct-database-url"
```

**❌ Common Mistake:** Using `npm` instead of `pnpm` - ensure consistency with your package manager.

### Step 3: Create Auth Configuration

Create `lib/auth.ts`:

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // Change to your database provider
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "ADMIN", // Default role for initial setup
            },
        },
    },
});
```

**❌ Common Mistake:** Running `npx @better-auth/cli generate` before creating this file - create the config first!

### Step 4: Generate Database Schema

```bash
# Generate Better Auth database schema
npx @better-auth/cli generate

# Update Prisma client
pnpm prisma generate
```

**❌ Common Mistake:** Trying to manually modify the Prisma schema - let Better Auth CLI handle it!

### Step 5: Create Auth API Route

Create `app/api/auth/[...all]/route.ts`:

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

**❌ Common Mistake:** Using wrong import - ensure you use `toNextJsHandler` for App Router.

### Step 6: Create Auth Client

Create `lib/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
});
```

**❌ Common Mistake:** Forgetting the `baseURL` parameter - authentication requests will fail without it.

### Step 7: Update Root Layout

Update `app/layout.tsx` to include Sonner:

```tsx
import type { Metadata } from "next";
import { IBM_Plex_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Your App",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
```

### Step 8: Create Sign-In Page

Create `app/signin/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
                callbackURL: "/admin",
            });

            if (error) {
                let errorMessage = "Sign in failed. Please try again.";
                switch (error.message) {
                    case "Invalid email or password":
                        errorMessage = "Invalid email or password. Please check your credentials.";
                        break;
                    case "Account not verified":
                        errorMessage = "Please verify your email address before signing in.";
                        break;
                    case "Too many requests":
                        errorMessage = "Too many sign-in attempts. Please try again later.";
                        break;
                    default:
                        errorMessage = error.message || "Sign in failed. Please try again.";
                }
                setError(errorMessage);
                toast.error(errorMessage);
            } else {
                toast.success("Welcome back! Redirecting to admin dashboard...");
                router.push("/admin");
            }
        } catch (err) {
            const errorMessage = "Network error. Please check your connection and try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/admin",
            });
        } catch (err) {
            toast.error("Failed to sign in with Google");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Admin Sign In</CardTitle>
                    <CardDescription>
                        Sign in to access the admin dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="text-destructive text-sm">{error}</div>
                        )}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-4">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleSignIn}
                        >
                            Sign In with Google
                        </Button>
                    </div>

                    <div className="mt-4 text-center">
                        <Link href="/signup" className="text-sm text-primary hover:underline">
                            Need an account? Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
```

### Step 9: Create Sign-Up Page

Create `app/signup/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error } = await authClient.signUp.email({
                email,
                password,
                name,
                callbackURL: "/admin",
            });

            if (error) {
                let errorMessage = "Sign up failed. Please try again.";
                switch (error.message) {
                    case "User already exists":
                        errorMessage = "An account with this email already exists. Please sign in instead.";
                        break;
                    case "Password too weak":
                        errorMessage = "Password must be at least 8 characters long.";
                        break;
                    case "Invalid email":
                        errorMessage = "Please enter a valid email address.";
                        break;
                    case "Too many requests":
                        errorMessage = "Too many sign-up attempts. Please try again later.";
                        break;
                    default:
                        errorMessage = error.message || "Sign up failed. Please try again.";
                }
                setError(errorMessage);
                toast.error(errorMessage);
            } else {
                toast.success("Account created successfully! Welcome to the admin dashboard.");
                router.push("/admin");
            }
        } catch (err) {
            const errorMessage = "Network error. Please check your connection and try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/admin",
            });
        } catch (err) {
            toast.error("Failed to sign up with Google");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Admin Sign Up</CardTitle>
                    <CardDescription>
                        Create your admin account to access the dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>
                        {error && (
                            <div className="text-destructive text-sm">{error}</div>
                        )}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating Account..." : "Sign Up"}
                        </Button>
                    </form>

                    <div className="mt-4">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleSignUp}
                        >
                            Sign Up with Google
                        </Button>
                    </div>

                    <div className="mt-4 text-center">
                        <Link href="/signin" className="text-sm text-primary hover:underline">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
```

### Step 10: Create Unauthorized Page

Create `app/unauthorized/page.tsx`:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldX } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <ShieldX className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">Access Denied</CardTitle>
                    <CardDescription>
                        You don't have permission to access this page. Admin privileges are required.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                        If you believe this is an error, please contact the system administrator.
                    </p>
                    <div className="flex flex-col space-y-2">
                        <Button asChild>
                            <Link href="/signin">Sign In as Admin</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/">Go to Homepage</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
```

### Step 11: Protect Admin Routes

#### Server-Side Protection (Critical Routes)

Update `app/admin/page.tsx`:

```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect('/signin');
  }

  if ((session.user as any).role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Your admin dashboard content */}
    </div>
  );
}
```

**❌ Common Mistake:** Wrapping `redirect()` in try-catch - it throws `NEXT_REDIRECT` error intentionally.

#### Client-Side Protection (Admin Pages)

Update `app/admin/blog/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function BlogPostsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isPending && (!session || (session.user as any).role !== 'ADMIN')) {
      if (!session) {
        router.push('/signin');
      } else {
        router.push('/unauthorized');
      }
    }
  }, [session, isPending, router]);

  // Show loading while checking authentication
  if (isPending) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session || (session.user as any).role !== 'ADMIN') {
    return null;
  }

  return (
    <div>
      <h1>Blog Posts Management</h1>
      {/* Your blog management content */}
    </div>
  );
}
```

**❌ Common Mistake:** Using `auth.useSession()` instead of `authClient.useSession()`.

### Step 12: Update Prisma Schema

After running `npx @better-auth/cli generate`, your `prisma/schema.prisma` should include:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  emailVerified Boolean   @default(false)
  image         String?
  sessions      Session[]
  accounts      Account[]

  @@map("users")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@map("account")
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @default(now()) @updatedAt

  @@map("verification")
}
```

## 🔧 Common Mistakes & Solutions

### 1. Route 404 Issues
**Problem:** Pages in `app/(auth)/sign-in/page.tsx` return 404
**Solution:** Route groups don't affect URLs. Use `app/signin/page.tsx` instead.

### 2. NEXT_REDIRECT Error Logging
**Problem:** `redirect()` throws error that gets logged
**Solution:** Don't wrap `redirect()` in try-catch - it's expected Next.js behavior.

### 3. TypeScript Role Property Error
**Problem:** `session.user.role` TypeScript error
**Solution:** Use `(session.user as any).role` for custom user fields.

### 4. Wrong Session API Usage
**Problem:** Using `auth.api.getSession()` without headers
**Solution:** Always pass `headers: await headers()` for server-side session checks.

### 5. Missing Base URL in Client
**Problem:** Auth client requests fail
**Solution:** Include `baseURL: process.env.BETTER_AUTH_URL` in client config.

### 6. Manual Schema Modification
**Problem:** Incompatible database schema
**Solution:** Use `npx @better-auth/cli generate` to auto-generate schema.

### 7. Package Manager Inconsistency
**Problem:** Using wrong package manager
**Solution:** Stick to one package manager (pnpm in this case).

### 8. Missing Prisma Generate
**Problem:** Type errors after schema changes
**Solution:** Always run `pnpm prisma generate` after schema modifications.

### 9. Wrong Auth Client Methods
**Problem:** Using `auth.useSession()` instead of `authClient.useSession()`
**Solution:** Use `authClient` for client-side operations, `auth` for server-side.

### 10. Missing Error Handling
**Problem:** Poor user experience with generic errors
**Solution:** Implement specific error messages and toast notifications.

## 🧪 Testing the Implementation

1. **Test Sign Up:** Visit `/signup` → Create admin account
2. **Test Sign In:** Visit `/signin` → Sign in with credentials
3. **Test Admin Access:** Should redirect to `/admin` after sign in
4. **Test Unauthorized Access:** Try accessing `/admin` without auth → redirect to `/signin`
5. **Test Role Protection:** Sign in as non-admin → redirect to `/unauthorized`

## 📦 Final Package.json Dependencies

```json
{
  "dependencies": {
    "better-auth": "^1.3.16",
    "sonner": "^1.4.0",
    // ... other dependencies
  }
}
```

## 🔐 Security Features Included

- ✅ Server-side session validation
- ✅ Client-side route protection
- ✅ Role-based access control
- ✅ CSRF protection (Better Auth built-in)
- ✅ Secure cookie handling
- ✅ Rate limiting (Better Auth built-in)
- ✅ Password hashing (Better Auth built-in)

This guide provides everything needed to implement the exact same Better Auth system with role-based admin authentication. Follow each step carefully and avoid the common mistakes listed! 🚀