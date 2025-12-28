import * as z from 'zod';


export const signupFormDataSchema = z.object({
  name: z.string().min(2, "نام حداقل ۲ کاراکتر باشد").max(50, "نام خیلی طولانی است"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  password: z.string().min(8, "رمز حداقل ۸ کاراکتر باشد").max(100, "رمز خیلی طولانی است"),
});

export type SignupFormDataType = z.infer<typeof signupFormDataSchema>;

export const signinFormDataSchema = z.object({
  email: z.string().email("ایمیل معتبر وارد کنید"),
  password: z.string().min(1, "رمز عبور را وارد کنید"),
});

export type SigninFormDataType = z.infer<typeof signinFormDataSchema>;
const codeSchema = z.object({
    code: z.string().length(6, "کد باید دقیقاً ۶ رقم باشد"),
});
type CodeData = z.infer<typeof codeSchema>;
export const forgotPasswordFormDataSchema = z.object({
    email: z.string().min(5, 'Email address is required'),
})

export type ForgotPasswordFormDataType = z.infer<typeof forgotPasswordFormDataSchema>;