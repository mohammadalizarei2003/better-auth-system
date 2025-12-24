'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import CardWrapper from "./CardWrapper";
import { signupFormDataSchema, SignupFormDataType } from "@/core/validations/authValidations";
import { useTransition } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader, LoaderIcon } from "lucide-react";
import Link from "next/link";
import AuthFormMessage from "./AuthFormMessage";

const SignupForm = () => {
    const [isPending, startTransaction] = useTransition();

    const form = useForm<SignupFormDataType>({
        resolver: zodResolver(signupFormDataSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    })

    const onSubmit = async (formData: SignupFormDataType) => {
        startTransaction(() => {
            // signin action
            console.log(formData);
        })
    }

    return <CardWrapper
        title="Signup Form"
        description="Please fill all fields"
        backHref="/"
        backLabel="Back to landing"
        isShowSocial
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    disabled={isPending}
                    render={({ field }) => <FormItem>
                        <FormLabel>Name:</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Demo"
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
                <Button variant='link' asChild className="p-0 cursor-pointer">
                    <Link href='/signin'>
                        Already have an account ? signin
                    </Link>
                </Button>
                {/* <AuthFormMessage variant="success" message="This is success message" />
                <AuthFormMessage variant="warning" message="This is warning message" /> */}
            </form>
        </Form>
    </CardWrapper>

}

export default SignupForm