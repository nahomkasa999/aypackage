# AyPackage - Better Auth System

A complete authentication system for Next.js applications using Better Auth.

## 🚀 Quick Start

Install the Better Auth system in your Next.js project:

```bash
npx aypackage systems better-auth
```

## ✨ Features

- **Complete Authentication System** - Sign in, sign up, and session management
- **Role-Based Access Control** - Admin, Editor, and User roles
- **Google OAuth Integration** - Social authentication support
- **Beautiful UI Components** - Pre-built signin/signup forms
- **TypeScript Support** - Full type safety
- **App Router Compatible** - Works with Next.js 13+ App Router

## 📁 What Gets Installed

### Pages
- `/signin` - Sign in page
- `/signup` - Sign up page  
- `/unauthorized` - Unauthorized access page

### API Routes
- `/api/auth/[...all]` - Better Auth API handler

### Components
- `AuthForm` - Reusable authentication form component

### Utilities
- `lib/auth.ts` - Server-side auth configuration
- `lib/auth-client.ts` - Client-side auth configuration
- `types/auth.ts` - TypeScript definitions
- `hooks/queries.ts` - Authentication hooks

## 🔧 Configuration

After installation, update your `.env.local`:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
DIRECT_URL="postgresql://username:password@localhost:5432/database_name"
```

## 🛠 Usage

### Server-Side Authentication
```typescript
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const session = await auth.api.getSession({
  headers: await headers()
})

if (!session || session.user.role !== 'ADMIN') {
  redirect('/unauthorized')
}
```

### Client-Side Authentication
```typescript
import { useAuth } from "@/hooks/queries"
import { isAdmin } from "@/types/auth"

const { session, user, isAuthenticated, isAdmin } = useAuth()

if (!isAuthenticated || !isAdmin) {
  router.push('/unauthorized')
}
```

### Using the AuthForm Component
```typescript
import { AuthForm } from "@/components/login-form"

// Sign in mode
<AuthForm mode="signin" />

// Sign up mode  
<AuthForm mode="signup" />
```

## 🔐 Security Features

- **Server-Side Validation** - All routes protected with server-side checks
- **Role-Based Access** - Admin, Editor, and User role support
- **Session Management** - Secure session handling
- **CSRF Protection** - Built-in CSRF protection
- **Rate Limiting** - Protection against brute force attacks

## 📚 Documentation

For detailed documentation, see the [Better Auth documentation](https://better-auth.com).

## 🤝 Contributing

This package is part of the AyAutomate ecosystem. For contributions, please contact the development team.

## 📄 License

MIT License - see LICENSE file for details.