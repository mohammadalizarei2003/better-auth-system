// src/lib/auth-helper.ts
import { cache } from "react";
import { auth } from "@/core/lib/authConfig";
import { headers } from "next/headers";

export const getCurrentUser = cache(async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) return null;
        return session.user;
    } catch (error) {
        console.error("Error getting session:", error);
        return null;
    }
});

export const getCurrentSession = cache(async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        return session ?? null;
    } catch (error) {
        return null;
    }
});