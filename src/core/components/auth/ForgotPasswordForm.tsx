'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import CardWrapper from "./CardWrapper";
import { forgotPasswordFormDataSchema, ForgotPasswordFormDataType, signinFormDataSchema, SigninFormDataType } from "@/core/validations/authValidations";
import { useTransition } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoaderIcon } from "lucide-react";

const ForgotPasswordForm = () => {
    const [isPending, startTransaction] = useTransition();

    const form = useForm<ForgotPasswordFormDataType>({
        resolver: zodResolver(forgotPasswordFormDataSchema),
        defaultValues: {
            email: '',
        }
    })

    const onSubmit = async (formData: ForgotPasswordFormDataType) => {
        startTransaction(() => {
            // signin action
            console.log(formData);
        })
    }

    return <CardWrapper
        title="Forgot Password Form"
        description="Please fill all fields"
        backHref="/signin"
        backLabel="Back to signin"
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
                <Button className="w-full uppercase cursor-pointer" disabled={isPending}>
                    {isPending ? <LoaderIcon className="size-4 animate-spin" /> : "forgot password"}
                </Button>
            </form>
        </Form>
    </CardWrapper>

}

export default ForgotPasswordForm