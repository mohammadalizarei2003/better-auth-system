import { auth } from "@/core/lib/authConfig";
import { toNextJsHandler } from 'better-auth/next-js'

export const { GET, POST, PUT, DELETE, PATCH } = toNextJsHandler(auth.handler);
