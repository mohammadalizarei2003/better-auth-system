import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        // autoSignIn: false,
    },
    appName: 'betterAuthSystem',
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

    advanced: {
        defaultCookieAttributes: {
            secure: true,
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        }
    },

    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
        expiresIn: 60 * 60,

        sendVerificationEmail: async ({ url }) => {
            console.log(`✅ Verify email link ===> ${url}`)
        }
    },

    user: {
        additionalFields: {
            role: {
                type: ['USER', 'ADMIN'] as const,
                required: false,
                defaultValue: 'USER',
                input: false,
            }
        }
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }
    },

    plugins: [
        nextCookies(),
        // twoFactor({
        //     issuer: 'betterAuthSystem',
        //     skipVerificationOnEnable: false,
        //     totpOptions: {
        //         digits: 6,
        //         period: 30,
        //     },
        //     backupCodeOptions: {
        //         amount: 10,
        //         length: 8,
        //     }
        // },)
    ]
});