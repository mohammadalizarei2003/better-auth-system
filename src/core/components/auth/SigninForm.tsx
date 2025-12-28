'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import CardWrapper from "./CardWrapper";
import { useState, useTransition } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { signinAction, verify2FASigninAction } from "@/core/actions/authActions"; // اسم اکشن رو درست کن اگر فرق داره
import AuthFormMessage from "./AuthFormMessage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';

// Schema جدا برای هر مرحله
const credentialsSchema = z.object({
    email: z.string().email("ایمیل معتبر وارد کنید"),
    password: z.string().min(1, "رمز عبور را وارد کنید"),
});

const codeSchema = z.object({
    code: z.string().length(6, "کد باید دقیقاً ۶ رقم باشد"),
});

type CredentialsData = z.infer<typeof credentialsSchema>;
type CodeData = z.infer<typeof codeSchema>;

const SigninForm = () => {
    const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const form = useForm<CredentialsData | CodeData>({
        resolver: zodResolver(step === 'credentials' ? credentialsSchema : codeSchema),
        defaultValues: {
            email: '',
            password: '',
            code: '',
        },
    });

    // وقتی step تغییر می‌کنه، schema و values رو reset کن
    // useState(() => {
    //     form.reset(step === 'credentials' ? { email: '', password: '' } : { code: '' });
    // }, []);

    const onSubmit = (data: CredentialsData | CodeData) => {
        setMessage(null);

        startTransition(async () => {
            try {
                if (step === 'credentials') {
                    const credentials = data as CredentialsData;
                    const response = await signinAction(credentials);

                    if (response.requires2FA) {
                        setStep('2fa');
                        form.reset({ code: '' }); // آماده برای کد
                        setMessage({ type: 'success', text: response.message || 'لطفاً کد ۲FA را وارد کنید' });
                        toast.success(response.message || 'نیاز به احراز هویت دو مرحله‌ای');
                    } else if (response.success) {
                        toast.success(response.message);
                        router.push(response.redirectTo || '/dashboard');
                    } else {
                        setMessage({ type: 'error', text: response.message });
                        toast.error(response.message);
                    }
                } else {
                    const codeData = data as CodeData;
                    const response = await verify2FASigninAction(codeData.code);

                    if (response.success) {
                        toast.success(response.message);
                        router.push(response.redirectTo || '/dashboard');
                    } else {
                        setMessage({ type: 'error', text: response.message });
                        toast.error(response.message);
                    }
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "خطای ناشناخته";
                setMessage({ type: 'error', text: errorMessage });
                toast.error(errorMessage);
            }
        });
    };

    return (
        <CardWrapper
            title="ورود"
            description="لطفاً اطلاعات خود را وارد کنید"
            backHref="/"
            backLabel="بازگشت"
            isShowSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {step === 'credentials' ? (
                        <>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ایمیل</FormLabel>
                                        <FormControl>
                                            <Input placeholder="you@example.com" type="email" {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center justify-between">
                                            <span>رمز عبور</span>
                                            <Button asChild size="sm" variant="link">
                                                <Link href="/forgot-password">فراموشی رمز</Link>
                                            </Button>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="••••••••" type="password" {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    ) : (
                        <>
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>کد احراز هویت دو مرحله‌ای</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="link"
                                onClick={() => {
                                    setStep('credentials');
                                    form.reset({ email: '', password: '' });
                                }}
                                className="p-0"
                            >
                                بازگشت به ورود با ایمیل و رمز
                            </Button>
                        </>
                    )}

                    {/* دکمه submit همیشه باشه */}
                    <Button type="submit" className="w-full uppercase" disabled={isPending}>
                        {isPending ? (
                            <LoaderIcon className="size-4 animate-spin" />
                        ) : step === 'credentials' ? (
                            'ورود'
                        ) : (
                            'تأیید کد و ورود'
                        )}
                    </Button>

                    <Button variant='link' className="p-0 w-full" asChild>
                        <Link href='/signup'>
                            حساب ندارید؟ ثبت‌نام کنید
                        </Link>
                    </Button>

                    {message && (
                        <AuthFormMessage
                            variant={message.type === 'error' ? 'warning' : 'success'}
                            message={message.text}
                        />
                    )}
                </form>
            </Form>
        </CardWrapper>
    );
};

export default SigninForm;