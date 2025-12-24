interface AuthLayoutInterface {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutInterface) => {
    return <main className="w-screen min-h-screen flex items-center justify-center">
        {children}
    </main>
}

export default AuthLayout