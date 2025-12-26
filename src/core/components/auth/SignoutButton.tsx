'use client';

import { signoutAction } from "@/core/actions/authActions";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const SignoutButton = () => {
    const [isPending, startTransaction] = useTransition();

    const signoutHandler = () => {
        startTransaction(async () => {
            try {
                const response = await signoutAction();

                if (!response.success) {
                    toast.warning("Signout failed");
                    return;
                }

                if (response.success) {
                    toast.success('Signout successfully');
                }
            } catch (error) {
                toast.warning('Something went wrong.');
            }
        });
    };


    return <Button variant='destructive' onClick={signoutHandler} disabled={isPending}>
        Signout
    </Button>
}

export default SignoutButton