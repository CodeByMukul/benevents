import Scanner from "@/components/shared/Scanner"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation";
import { SearchParamProps } from "@/types";
export default async function ScannerPage( {searchParams}: SearchParamProps) {
  const sp=await searchParams;
  const eventId = sp.eventId;
  const {sessionClaims} = await auth();
  const userId = sessionClaims?.id;
  const canScan = await prisma.user.findUnique({
    where:{
      clerkId:userId,
      canCreateEvents:true,
      events:{
        some:{
          eventId:eventId as string
        }
      }
    }
  })
  if(!canScan?.isAdmin){
  if(!sessionClaims||!canScan||!eventId) redirect("/"); 
  if(!sessionClaims||!canScan||!eventId) return <p className="text-center text-red-500">Unauthorized</p>;
  }
  return (
    <Scanner eventId={eventId as string}/>
  )
}

