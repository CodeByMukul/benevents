import EventForm from "@/components/shared/EventForm"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
const page = async() => {
   const {sessionClaims}=await auth();
    const clerkId=sessionClaims?.sub ;
    try{
      if(clerkId){
    const user=await prisma.user.findUnique({where:{clerkId}})
    if(!user||!user.canCreateEvents)return notFound()
      }else{
        return notFound()
      }
    }catch(e){
    console.log(e)
        return notFound()
    }
  return (
  <>
  <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
      <h3 className="wrapper h3-bold text-center sm:text-left">Create Event</h3>
    </section>
    <div className="wrapper my-8 ">
        <EventForm clerkId={clerkId||""} type="Create">
        </EventForm>
      </div></>
  )
}

export default page
