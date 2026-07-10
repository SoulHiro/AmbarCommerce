import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import {
    userTable,
    sessionTable,
    accountTable,
    verificationTable,
} from "@/db/schema";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    accountLinking: {
        enabled: true,
        trustedProviders: ["google"],
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: userTable,
            session: sessionTable,
            account: accountTable,
            verification: verificationTable,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            disableSignUp: true,
        },
    },
});