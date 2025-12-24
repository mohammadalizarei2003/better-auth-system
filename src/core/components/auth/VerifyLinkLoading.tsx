import { LoaderIcon } from "lucide-react"
import CardWrapper from "./CardWrapper"
import AuthFormMessage from "./AuthFormMessage"

const VerifyLinkLoading = () => {
    return <CardWrapper
        title="Verify Account"
        description="Please waite..."
        backLabel="Back to signin"
        backHref="/signin"
    >
        <div className="flex flex-col items-center gap-y-5 w-full">
            <LoaderIcon className="size-14 animate-spin text-primary" />
            
            {/* <AuthFormMessage variant="success" message="Account verify successfully" />
            <AuthFormMessage variant="warning" message="Account verify successfully" /> */}
        </div>
    </CardWrapper>
}

export default VerifyLinkLoading