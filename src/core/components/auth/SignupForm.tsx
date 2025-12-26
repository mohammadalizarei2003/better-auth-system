'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import CardWrapper from "./CardWrapper";
import { signupFormDataSchema, SignupFormDataType } from "@/core/validations/authValidations";
import { useState, useTransition } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import AuthFormMessage from "./AuthFormMessage";
import { signupAction } from "@/core/actions/authActions";
import { toast } from "sonner";

const SignupForm = () => {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const form = useForm<SignupFormDataType>({
        resolver: zodResolver(signupFormDataSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    });

    const onSubmit = async (formData: SignupFormDataType) => {
        setMessage(null);

        startTransition(async () => {
            try {
                const response = await signupAction(formData);

                if (response.success) {
                    setMessage({ type: 'success', text: response.message });
                    toast.success(response.message);
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
        title="ثبت‌نام"
        description="لطفاً اطلاعات خود را وارد کنید"
        backHref="/"
        backLabel="بازگشت"
        isShowSocial
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    disabled={isPending}
                    render={({ field }) => <FormItem>
                        <FormLabel>نام:</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="نام شما"
                                type="text"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>}
                />
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
                        <FormLabel>رمز عبور</FormLabel>
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
                    {isPending ? <LoaderIcon className="size-4 animate-spin" /> : "ثبت‌نام"}
                </Button>
                <Button variant='link' asChild className="p-0 cursor-pointer w-full">
                    <Link href='/signin'>
                        حساب دارید؟ وارد شوید
                    </Link>
                </Button>
                {message && <AuthFormMessage variant={message.type === 'error' ? 'warning' : 'success'} message={message.text} />}
            </form>
        </Form>
    </CardWrapper>;
};

export default SignupForm;