import * as z from 'zod';

export const signinFormDataSchema = z.object({
    email: z.string().min(5, 'Email address is required'),
    password: z.string().min(6, 'Password is required'),
})

export type SigninFormDataType = z.infer<typeof signinFormDataSchema>;

export const signupFormDataSchema = z.object({
    name: z.string().min(5, 'Name is required'),
    email: z.string().min(5, 'Email address is required'),
    password: z.string().min(6, 'Password is required'),
})

export type SignupFormDataType = z.infer<typeof signupFormDataSchema>;

export const forgotPasswordFormDataSchema = z.object({
    email: z.string().min(5, 'Email address is required'),
})

export type ForgotPasswordFormDataType = z.infer<typeof forgotPasswordFormDataSchema>;