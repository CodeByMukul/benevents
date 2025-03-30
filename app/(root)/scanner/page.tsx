import Scanner from "@/components/shared/Scanner"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation";
import { SearchParamProps } from "@/types";
export default async function ScannerPage( {searchParams}: SearchParamProps) {
  const sp=await searchParams;
  const eventId = sp.eventId;
  const {sessionClaims} = await auth();
  const clerkId= sessionClaims?.id;
  const canScan = await prisma.user.findUnique({
    where:{
      clerkId,
      canCreateEvents:true,
      events:{
        some:{
          eventId:eventId as string
        }
      }
    }
  })
  if(!canScan?.isAdmin){
  if(!sessionClaims||!eventId) return notFound(); 
  if(!canScan) return <p className="text-center text-red-500">Unauthorized</p>;
  }
  return (
    <Scanner eventId={eventId as string} secretKey={process.env.SECRET_KEY_ENCRYPTION!}/>
  )
}

