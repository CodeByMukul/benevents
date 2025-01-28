import { Button } from "@/components/ui/button"
import Collection from "@/components/shared/Collection"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
const page = async() => {
  const {sessionClaims}= await auth(); 
  const userId=sessionClaims?.username
  const eevents=await prisma.event.findMany({
    include:{
      host:true,
      category:true
    }
  });
  const user=await prisma.user.findUnique({where:{username:userId}})
  const events=eevents.filter((event)=>event.host.username==userId)
  
  return (
    <>

        <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
          <div className="wrapper flex items-center justify-center sm:justify-between ">            <h3 className="h3-bold text-center md:text-left">My Tickets</h3>
              <Button asChild className="button hidden sm:flex">
                <Link href="/#events">
                  Explore More Events
                </Link>
              </Button>
          </div>

        </section>
        {
          /*
        <section className="wrapper my-8 ">
        <Collection data={events} emptyTitle="No event tickets yet" emptyStateSubtext="No worries- plenty of exciting events to explore" collectionType="My_Tickets" limit={3} page={1} urlParamName="ordersPage" totalPages={2}></Collection>
</section>
        */}
          {user?.canCreateEvents&&
        <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
          <div className="wrapper flex items-center justify-center sm:justify-between ">            <h3 className="h3-bold text-center md:text-left">Events Organized</h3>
              <Button asChild className="button hidden sm:flex">
                <Link href="/events/create">
                  Create New Event
                </Link>
              </Button>
          </div>
        <section className="wrapper my-8 ">
        <Collection data={events} emptyTitle="No events hosted yet" emptyStateSubtext="Host Some Exciting Events!" collectionType="Events_Organized" limit={6} page={1} urlParamName="eventsPage" totalPages={2}></Collection>
</section>
        </section>
          }
    </>
  )
}

export default page
