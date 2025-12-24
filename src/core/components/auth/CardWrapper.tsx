import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ArrowLeft } from "lucide-react";
import SocialButtons from "./SocialButtons";

interface CardWrapperInterface {
    title: string;
    description: string;
    backLabel: string;
    backHref: string;
    children: React.ReactNode;
    isShowSocial?: boolean;
}

const CardWrapper = ({ title, description, backLabel, backHref, children, isShowSocial }: CardWrapperInterface) => {
    return <Card className="max-w-md w-full">
        <CardHeader>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
        {isShowSocial && <SocialButtons />}
        <CardFooter>
            <div className="flex items-center justify-center w-full">
                <Button variant='link' asChild>
                    <Link href={backHref}>
                        <ArrowLeft />
                        <span>{backLabel}</span>
                    </Link>
                </Button>
            </div>
        </CardFooter>
    </Card>
}

export default CardWrapper