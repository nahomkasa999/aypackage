"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface AuthFormProps extends React.ComponentProps<"div"> {
  mode?: "signin" | "signup"
}

export function AuthForm({
  className,
  mode = "signin",
  ...props
}: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const isSignUp = mode === "signup"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isSignUp) {
        const { data, error } = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: "/admin",
        })

        if (error) {
          let errorMessage = "Sign up failed. Please try again."
          switch (error.message) {
            case "Email already exists":
              errorMessage = "An account with this email already exists."
              break
            case "Invalid email":
              errorMessage = "Please enter a valid email address."
              break
            case "Password too weak":
              errorMessage = "Password must be at least 8 characters long."
              break
            default:
              errorMessage = error.message || "Sign up failed. Please try again."
          }
          setError(errorMessage)
          toast.error(errorMessage)
        } else {
          toast.success("Account created successfully! Please check your email to verify your account.")
          router.push("/signin")
        }
      } else {
        const { data, error } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/admin",
        })

        if (error) {
          let errorMessage = "Sign in failed. Please try again."
          switch (error.message) {
            case "Invalid email or password":
              errorMessage = "Invalid email or password. Please check your credentials."
              break
            case "Account not verified":
              errorMessage = "Please verify your email address before signing in."
              break
            case "Too many requests":
              errorMessage = "Too many sign-in attempts. Please try again later."
              break
            default:
              errorMessage = error.message || "Sign in failed. Please try again."
          }
          setError(errorMessage)
          toast.error(errorMessage)
        } else {
          toast.success("Welcome back! Redirecting to admin dashboard...")
          router.push("/admin")
        }
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
      toast.error("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      if (isSignUp) {
        await authClient.signUp.social({
          provider: "google",
          callbackURL: "/admin",
        })
      } else {
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/admin",
        })
      }
    } catch (err) {
      setError(`Failed to ${isSignUp ? 'sign up' : 'sign in'} with Google`)
      toast.error(`Failed to ${isSignUp ? 'sign up' : 'sign in'} with Google`)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-card border" style={{ borderColor: 'var(--border-gray-700)' }}>
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-foreground">
            {isSignUp ? "Create your account" : "Welcome back"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isSignUp 
              ? "Sign up to access the admin dashboard" 
              : "Sign in to access the admin dashboard"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  {isSignUp ? "Sign up with Google" : "Sign in with Google"}
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t" style={{ '--tw-border-opacity': '0.1' } as React.CSSProperties}>
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                {isSignUp && (
                  <div className="grid gap-3">
                    <Label htmlFor="name" className="text-foreground">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-card border" 
                      style={{ borderColor: 'var(--border-gray-700)' }}
                    />
                  </div>
                )}
                <div className="grid gap-3">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-card border"
                    style={{ borderColor: 'var(--border-gray-700)' }}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    {!isSignUp && (
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground"
                      >
                        Forgot your password?
                      </a>
                    )}
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-card border"
                    style={{ borderColor: 'var(--border-gray-700)' }}
                  />
                </div>
                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </>
                  ) : (
                    isSignUp ? "Create Account" : "Sign In"
                  )}
                </Button>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <Link 
                  href={isSignUp ? "/signin" : "/signup"} 
                  className="underline underline-offset-4 text-primary hover:text-primary/80"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  )
}

// Export alias for backward compatibility
export { AuthForm as LoginForm }
