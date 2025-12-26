import SignoutButton from "@/core/components/auth/SignoutButton"
import ThemeSwitcher from "@/core/components/global/ThemeSwitcher"
import { Button } from "@/core/components/ui/button"
import { getCurrentSession, getCurrentUser } from "@/core/helpers/authHelpers"
import Link from "next/link"
import { redirect } from "next/navigation"

const LandingPage = async () => {
  const user = await getCurrentUser();
  const session = await getCurrentSession();
  if (!user) return redirect('/signin');



  return <main className="max-w-7xl mx-auto p-5 space-y-5">
    <h1 className="text-4xl font-bold">Better Auth System ({user?.name}) ({user.role})</h1>
    <p>Token: {session?.session.token}</p>
    <ThemeSwitcher />
    <Button asChild variant='link'>
      <Link href='/signin'>Signin</Link>
    </Button>
    <SignoutButton />
  </main>
}

export default LandingPage