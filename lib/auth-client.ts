import { createAuthClient } from "better-auth/react";
import type { AuthClient } from "@/types/auth";

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
}) as AuthClient;