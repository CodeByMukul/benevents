import EventForm from "@/components/shared/EventForm"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { handleError } from "@/lib/utils";
const page = async({params}:{params:Promise<{id:string}>}) => {
  const {id}=await params
   const {sessionClaims}=await auth();
    const clerkId=sessionClaims?.sub ;
    try{
      if(clerkId){
    const user=await prisma.user.findUnique({where:{clerkId}})
    if(!user||!user.canCreateEvents)redirect('/')
      }else{
        redirect('/')
      }
    }catch(e){
      redirect('/')
    }
    const event=await prisma.event.findUnique({
      where:{
        eventId:id
      },
      include:{
        host:true,
        category:true,
      }
    })
    
    if(!event)redirect('/');
      console.log(event)
  return (
  <>
  <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
      <h3 className="wrapper h3-bold text-center sm:text-left">Update Event</h3>
    </section>
    <div className="wrapper my-8 ">
        <EventForm clerkId={clerkId||""} type="Update" event={event}>
        </EventForm>
      </div></>
  )
}

export default page
