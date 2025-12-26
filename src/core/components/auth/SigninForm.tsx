'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import CardWrapper from "./CardWrapper";
import { signinFormDataSchema, SigninFormDataType } from "@/core/validations/authValidations";
import { useState, useTransition } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { signinAction } from "@/core/actions/authActions";
import AuthFormMessage from "./AuthFormMessage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SigninForm = () => {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const form = useForm<SigninFormDataType>({
        resolver: zodResolver(signinFormDataSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (formData: SigninFormDataType) => {
        setMessage(null);

        startTransition(async () => {
            try {
                const response = await signinAction(formData);

                if (response.success) {
                    setMessage({ type: 'success', text: response.message });
                    toast.success(response.message);

                    setTimeout(() => {
                        // window.location.href = response.redirectTo || '/dashboard';
                        router.push(response.redirectTo || "/dashboard");
                    }, 1000);
                } else {
                    setMessage({ type: 'error', text: response.message });
                    toast.error(response.message);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "خطای ناشناخته";
                setMessage({ type: 'error', text: errorMessage });
                toast.error(errorMessage);
            }
        });
    };

    return <CardWrapper
        title="ورود"
        description="لطفاً اطلاعات خود را وارد کنید"
        backHref="/"
        backLabel="بازگشت"
        isShowSocial
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    disabled={isPending}
                    render={({ field }) => <FormItem>
                        <FormLabel>ایمیل</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="you@example.com"
                                type="email"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>}
                />
                <FormField
                    control={form.control}
                    name="password"
                    disabled={isPending}
                    render={({ field }) => <FormItem>
                        <FormLabel className="flex items-center justify-between">
                            <span>رمز عبور</span>
                            <Button asChild className="cursor-pointer" size='sm' variant='link'>
                                <Link href='/forgot-password'>فراموشی رمز</Link>
                            </Button>
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="••••••••"
                                type="password"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>}
                />
                <Button className="w-full uppercase cursor-pointer" disabled={isPending}>
                    {isPending ? <LoaderIcon className="size-4 animate-spin" /> : "ورود"}
                </Button>
                <Button variant='link' className="p-0 cursor-pointer w-full" asChild>
                    <Link href='/signup'>
                        حساب ندارید؟ ثبت‌نام کنید
                    </Link>
                </Button>
                {message && <AuthFormMessage variant={message.type === 'error' ? 'warning' : 'success'} message={message.text} />}
            </form>
        </Form>
    </CardWrapper>;
};

export default SigninForm;