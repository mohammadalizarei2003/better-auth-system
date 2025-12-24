'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import CardWrapper from "./CardWrapper";
import { signinFormDataSchema, SigninFormDataType } from "@/core/validations/authValidations";
import { useTransition } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader, LoaderIcon } from "lucide-react";
import Link from "next/link";

const SigninForm = () => {
    const [isPending, startTransaction] = useTransition();

    const form = useForm<SigninFormDataType>({
        resolver: zodResolver(signinFormDataSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit = async (formData: SigninFormDataType) => {
        startTransaction(() => {
            // signin action
            console.log(formData);
        })
    }

    return <CardWrapper
        title="Signin Form"
        description="Please fill all fields"
        backHref="/"
        backLabel="Back to landing"
        isShowSocial
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    disabled={isPending}
                    render={({ field }) => <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="demo@gmail.com"
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
                            <span>Password</span>
                            <Button asChild className="cursor-pointer" size='sm' variant='link'>
                                <Link href='/forgot-password'>Forgot Password</Link>
                            </Button>
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="******"
                                type="password"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>}
                />
                <Button className="w-full uppercase cursor-pointer" disabled={isPending}>
                    {isPending ? <LoaderIcon className="size-4 animate-spin" /> : "signin"}
                </Button>
                <Button variant='link' className="p-0 cursor-pointer" asChild>
                    <Link href='/signup'>
                        Don't have an account ? signup
                    </Link>
                </Button>
            </form>
        </Form>
    </CardWrapper>

}

export default SigninForm