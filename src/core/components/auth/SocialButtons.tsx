'use client';

import { BsGoogle, BsGithub } from 'react-icons/bs'
import { Button } from "../ui/button"
import { CardFooter } from "../ui/card"
import { Separator } from '../ui/separator'
import { authClient } from '@/core/lib/authClient';
import { useTransition } from 'react';

const SocialButtons = () => {

    const [isPending, startTransaction] = useTransition();

    const socialSigninHandler = async (providers: 'google' | 'github') => {
        startTransaction(async () => {
            await authClient.signIn.social({ provider: providers })
        })
    }

    return <CardFooter>
        <div className="grid grid-cols-2 gap-2 w-full">
            <Separator className='col-span-2 my-2' />
            <Button disabled={isPending} variant='outline' className='cursor-pointer' onClick={() => socialSigninHandler('google')}>
                <BsGoogle className='size-4' />
                <span>Goggle</span>
            </Button>
            <Button disabled={isPending} variant='outline' className='cursor-pointer' onClick={() => socialSigninHandler('github')}>
                <BsGithub className='size-4' />
                <span>Github</span>
            </Button>
        </div>
    </CardFooter>
}

export default SocialButtons