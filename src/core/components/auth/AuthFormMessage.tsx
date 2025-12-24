'use client';

import { BadgeCheckIcon, BadgeXIcon } from "lucide-react"
import { Item, ItemContent, ItemMedia, ItemTitle } from "../ui/item"

interface AuthFormMessageInterface {
    message: string;
    variant: 'success' | 'warning';

}

const AuthFormMessage = ({message, variant}:AuthFormMessageInterface) => {
    return <Item variant="muted" className={`${variant === 'success' && 'bg-emerald-500/40'} ${variant === 'warning' && 'bg-destructive/40'} w-full`} size="sm">
        <ItemMedia>
            {variant === 'success' && <BadgeCheckIcon className="size-5" />}
            {variant === 'warning' && <BadgeXIcon className="size-5" />}
        </ItemMedia>
        <ItemContent>
            <ItemTitle>{message}</ItemTitle>
        </ItemContent>
    </Item>
}

export default AuthFormMessage