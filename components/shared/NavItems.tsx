"use client";
import { headerLinks } from "@/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SheetClose } from "../ui/sheet";

const NavItems = ({create,...restProps}:{create:boolean}) => {
  const pathname=usePathname();
  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
      {headerLinks.map((link)=>{
        const isActive=pathname==link.route;
        return <li key={link.route} className={`${isActive&&"text-primary-500"} flex-center p-medium-16 whitespace-nowrap`}>

        {link.label!='Create Event'&&<Link {...restProps} href={link.route}>{link.label}</Link>}
        {create&&link.label=='Create Event'&&<Link {...restProps} href={link.route}>{link.label}</Link>}
      </li>})} 
    </ul>
  )
}

export default NavItems
