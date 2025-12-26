import { Toaster } from "../components/ui/sonner";
import { ThemeProvider } from "./ThemeProvider";

interface ProvidersInterface {
    children: React.ReactNode;
}

const Providers = ({ children }: ProvidersInterface) => {
    return <>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
            <Toaster />
        </ThemeProvider>
    </>
}

export default Providers