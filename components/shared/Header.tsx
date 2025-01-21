import Link from "next/link"
import MobileNav from "./MobileNav"
import NavItems from "./NavItems"
import {SignedIn,UserButton ,SignedOut } from "@clerk/nextjs"
import { Button } from "../ui/button"
import Image from "next/image"
const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href={"/"} className="w-36">
          <Image src="/assets/images/logo.svg" width={128} height={38} alt="Benevents"></Image>
        </Link>
        <SignedIn>
          <nav className="md:flex-between hidden w-full max-w-xs">
            <NavItems>
            </NavItems>
          </nav>
        </SignedIn>
        <div className="flex w-32 justify-end gap-3">
          <SignedIn>
            <UserButton></UserButton>
            <MobileNav></MobileNav>
          </SignedIn>
          <SignedOut>
            <Button className="rounded-full" size="lg" asChild>
              <Link href="/sign-in">
                Log In
              </Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

export default Header
