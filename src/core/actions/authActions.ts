'use server';

import { headers } from "next/headers";
import { auth } from "@/core/lib/authConfig";
import { revalidatePath } from "next/cache";
import {
    signinFormDataSchema,
    SigninFormDataType,
    signupFormDataSchema,
    SignupFormDataType
} from "@/core/validations/authValidations";
import { APIError } from 'better-auth';

type ActionResponse<T = never> = {
    success: boolean;
    message: string;
    redirectTo?: string;
    data?: T;
    requires2FA?: boolean;
};

const ERROR_MESSAGES = {
    INVALID_FORM: 'لطفاً همه فیلدها را به درستی پر کنید.',
    EMAIL_EXISTS: 'این ایمیل قبلاً ثبت شده.',
    WEAK_PASSWORD: 'رمز عبور حداقل ۸ کاراکتر باید باشد.',
    INVALID_CREDENTIALS: 'ایمیل یا رمز عبور اشتباه است.',
    EMAIL_NOT_VERIFIED: 'لطفاً ایمیل خود را تایید کنید. لینک تایید به ایمیل شما ارسال شد.',
    TOO_MANY_REQUESTS: 'تلاش زیاد! لطفاً کمی صبر کنید.',
    SERVER_ERROR: 'خطای سرور. لطفاً دوباره تلاش کنید.',
    AUTH_FAILED: 'احراز هویت ناموفق بود.',
    ACCOUNT_CREATED: 'حساب کاربری ساخته شد! لینک تایید به ایمیل شما ارسال شد.',
    SIGNIN_SUCCESS: 'ورود موفق!',
    SIGNOUT_SUCCESS: 'خروج موفق!',
    UNKNOWN_ERROR: 'خطای ناشناخته. دوباره تلاش کنید.',
    INVALID_TOKEN: 'توکن نامعتبر یا منقضی شده.',
    TOKEN_EXPIRED: 'توکن منقضی شده. لینک جدید ارسال شد.',
} as const;

const handleBetterAuthError = (error: APIError): ActionResponse => {

    if (error.statusCode) {
        switch (error.statusCode) {
            case 401:
                return { success: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS };
            case 409:
                return { success: false, message: ERROR_MESSAGES.EMAIL_EXISTS };
            case 429:
                return { success: false, message: ERROR_MESSAGES.TOO_MANY_REQUESTS };
            case 403:
                return { success: false, message: ERROR_MESSAGES.EMAIL_NOT_VERIFIED };
            case 400:
                return { success: false, message: ERROR_MESSAGES.INVALID_FORM };
            default:
                return { success: false, message: ERROR_MESSAGES.SERVER_ERROR };
        }
    }
    const msg = (error.message || '').toLowerCase();

    if (msg.includes('already exists') || msg.includes('user_already_exists'))
        return { success: false, message: ERROR_MESSAGES.EMAIL_EXISTS };

    if (msg.includes('invalid credentials') || msg.includes('unauthorized'))
        return { success: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS };

    if (msg.includes('email not verified') || msg.includes('verify'))
        return { success: false, message: ERROR_MESSAGES.EMAIL_NOT_VERIFIED };

    if (msg.includes('too many requests') || msg.includes('rate limit'))
        return { success: false, message: ERROR_MESSAGES.TOO_MANY_REQUESTS };

    if (msg.includes('password') && msg.includes('minimum'))
        return { success: false, message: ERROR_MESSAGES.WEAK_PASSWORD };

    return { success: false, message: error.message || ERROR_MESSAGES.AUTH_FAILED };
};

const logError = (context: string, error: unknown) => {
    console.error(`[${context}]`, error);
    if (process.env.NODE_ENV === 'development' && error instanceof Error) {
        console.error(error.stack);
    }
};


export const signupAction = async (
    formData: SignupFormDataType
): Promise<ActionResponse> => {
    const validation = signupFormDataSchema.safeParse(formData);
    if (!validation.success) {
        return {
            success: false,
            message: ERROR_MESSAGES.INVALID_FORM,
        };
    }

    const { name, email, password } = validation.data;

    try {
        const result = await auth.api.signUpEmail({
            body: { name, email, password },
        });

        if (result?.user) {
            revalidatePath('/', 'layout');
            return {
                success: true,
                message: ERROR_MESSAGES.ACCOUNT_CREATED,
            };
        }

        return {
            success: false,
            message: ERROR_MESSAGES.UNKNOWN_ERROR,
        };
    } catch (error) {
        if (error instanceof APIError) {
            return handleBetterAuthError(error);
        }

        logError('Signup', error);

        return {
            success: false,
            message: ERROR_MESSAGES.SERVER_ERROR,
        };
    }
};

export const signinAction = async (
    formData: SigninFormDataType
): Promise<ActionResponse> => {
    const validation = signinFormDataSchema.safeParse(formData);
    if (!validation.success) {
        return { success: false, message: ERROR_MESSAGES.INVALID_FORM };
    }

    const { email, password } = validation.data;

    try {
        const result = await auth.api.signInEmail({ body: { email, password } });
        console.log("===================================");
        console.log(result);
        console.log("===================================");
        if ("twoFactorRedirect" in result && result.twoFactorRedirect) {
            return { success: true, message: 'لطفاً کد احراز هویت دو مرحله‌ای را وارد کنید', requires2FA: true };
        }
        if (!result?.user) return { success: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS };
        
        
        if (result.user) {
            revalidatePath('/', 'layout');
            return { success: true, message: ERROR_MESSAGES.SIGNIN_SUCCESS, redirectTo: '/dashboard' };
        }

        return { success: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS };
        // revalidatePath('/', 'layout');
        // return { success: true, message: ERROR_MESSAGES.SIGNIN_SUCCESS, redirectTo: '/dashboard' };
    } catch (error) {
        if (error instanceof APIError) return handleBetterAuthError(error);
        logError('Signin', error);
        return { success: false, message: ERROR_MESSAGES.SERVER_ERROR };
    }
};


export const signoutAction = async (): Promise<ActionResponse> => {
    try {
        const headerList = await headers();

        await auth.api.signOut({
            headers: headerList, // اصلاح شد - مستقیم Headers پاس بده
        });

        revalidatePath('/', 'layout');

        return {
            success: true,
            message: ERROR_MESSAGES.SIGNOUT_SUCCESS,
            redirectTo: "/",
        };
    } catch (error) {
        logError('Signout', error);

        return {
            success: false,
            message: ERROR_MESSAGES.SERVER_ERROR,
            redirectTo: "/",
        };
    }
};

export const verifyEmailAction = async (
    token: string
): Promise<ActionResponse> => {
    try {
        const result = await auth.api.verifyEmail({
            query: { token }
        });

        if (result) {
            revalidatePath('/', 'layout');

            return {
                success: true,
                message: "ایمیل با موفقیت تایید شد! حالا می‌تونی وارد بشی.",
                redirectTo: "/signin",
            };
        }

        return {
            success: false,
            message: ERROR_MESSAGES.INVALID_TOKEN,
        };
    } catch (error: any) {
        logError('VerifyEmail', error);

        const message = error?.message?.toLowerCase() || '';
        if (message.includes("expired")) {
            return {
                success: false,
                message: ERROR_MESSAGES.TOKEN_EXPIRED,
            };
        }

        if (message.includes("invalid")) {
            return {
                success: false,
                message: ERROR_MESSAGES.INVALID_TOKEN,
            };
        }

        return {
            success: false,
            message: ERROR_MESSAGES.SERVER_ERROR,
        };
    }
};

export const resendVerificationEmailAction = async (
    email: string
): Promise<ActionResponse> => {
    try {
        await auth.api.sendVerificationEmail({
            body: { email },
        });

        return {
            success: true,
            message: "ایمیل تایید دوباره ارسال شد. لطفاً اینباکس خود را چک کنید.",
        };
    } catch (error) {
        logError('ResendVerification', error);

        return {
            success: false,
            message: error instanceof APIError
                ? error.message
                : ERROR_MESSAGES.SERVER_ERROR,
        };
    }
};


export const enableTwoFactorAction = async (password: string): Promise<ActionResponse<{ totpURI?: string; backupCodes?: string[] }>> => {
    try {
        const result = await auth.api.enableTwoFactor({ body: { password } });
        if (result.totpURI && result.backupCodes) {
            console.log('✅ TOTP URI (برای QR کد):', result.totpURI);
            console.log('✅ کد شش رقمی secret نیست، اما URI بالا رو برای تست دستی استفاده کن');
            console.log('✅ Backup Codes (به کاربر نشون بده):', result.backupCodes.join(', '));
            return { success: true, message: 'QR آماده است. اسکن کن و کد رو برای فعال‌سازی وارد کن.', data: { totpURI: result.totpURI, backupCodes: result.backupCodes } };
        }
        return { success: false, message: 'خطا در تولید QR' };
    } catch (error) {
        if (error instanceof APIError) return handleBetterAuthError(error);
        logError('Enable2FA', error);
        return { success: false, message: ERROR_MESSAGES.SERVER_ERROR };
    }
};

export const confirmEnableTwoFactorAction = async (code: string): Promise<ActionResponse> => {
    try {
        const result = await auth.api.verifyTOTP({ body: { code } });
        if (result.token) {
            return { success: true, message: 'احراز هویت دو مرحله‌ای فعال شد!' };
        }
        return { success: false, message: 'کد اشتباه است' };
    } catch (error) {
        if (error instanceof APIError) return handleBetterAuthError(error);
        logError('Confirm2FA', error);
        return { success: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS };
    }
};

export const disableTwoFactorAction = async (password: string): Promise<ActionResponse> => {
    try {
        await auth.api.disableTwoFactor({ body: { password } });
        return { success: true, message: 'احراز هویت دو مرحله‌ای غیرفعال شد' };
    } catch (error) {
        if (error instanceof APIError) return handleBetterAuthError(error);
        logError('Disable2FA', error);
        return { success: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS };
    }
};

export const verify2FASigninAction = async (code: string): Promise<ActionResponse> => {
    try {
        const result = await auth.api.verifyTOTP({ body: { code } }); // trustDevice: false نگه دار، یا true اگر بخوای دستگاه اعتماد بشه
        if (result.token) {
            revalidatePath('/', 'layout');
            return { success: true, message: ERROR_MESSAGES.SIGNIN_SUCCESS, redirectTo: '/dashboard' };
        }
        return { success: false, message: 'کد شش رقمی اشتباه است' };
    } catch (error) {
        if (error instanceof APIError) return handleBetterAuthError(error);
        logError('Verify2FALogin', error);
        return { success: false, message: ERROR_MESSAGES.SERVER_ERROR };
    }
};