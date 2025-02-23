import Scanner from "@/components/shared/Scanner"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation";
export default async function ScannerPage() {
  const {sessionClaims} = await auth();
  const userId = sessionClaims?.id;
  const canScan = await prisma.user.findUnique({
    where:{
      clerkId:userId,
      canCreateEvents:true
    }
  })
  if(!sessionClaims||!canScan) redirect("/"); 
  if(!sessionClaims||!canScan) return <p className="text-center text-red-500">Unauthorized</p>;
  return (
    <Scanner/>
  )
}

