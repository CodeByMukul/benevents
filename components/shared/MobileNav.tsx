import { Separator } from '../ui/separator'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import NavItems from './NavItems'
import { Sheet,SheetContent,SheetTitle,SheetTrigger } from '../ui/sheet'
import Image from 'next/image'
const MobileNav = async() => {
  const {sessionClaims}=await auth();
  const user=await prisma.user.findUnique({
    where:{
      clerkId:sessionClaims?.sub
    }
  })
  const post=user?user.canCreateEvents:false;
  return (
    <nav className='md:hidden '>

<Sheet>
  <SheetTrigger className='align-middle '>
          <Image src="/assets/icons/menu.svg" alt='menu' width={24} height={24} className='cursor-pointer'></Image>
        </SheetTrigger>
  <SheetContent className='flex flex-col gap-6 bg-white md:hidden '>
          <SheetTitle>

          <Image src="/assets/images/logo.svg" alt='logo' width={128} height={38}></Image>
          </SheetTitle>
          <Separator className='border border-gray-50'></Separator>
          <NavItems create={post}></NavItems>
  </SheetContent>
</Sheet>
    </nav>
  )
}

export default MobileNav
