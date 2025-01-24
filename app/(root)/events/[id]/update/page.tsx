import EventForm from "@/components/shared/EventForm"
import { auth } from "@clerk/nextjs/server"
const page = async() => {
   const {sessionClaims}=await auth();
    const clerkId=sessionClaims?.clerkId as string;
  return (
  <>
  <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
      <h3 className="wrapper h3-bold text-center sm:text-left">Update Event</h3>
    </section>
    <div className="wrapper my-8 ">
        <EventForm clerkId={clerkId} type="Update">
        </EventForm>
      </div></>
  )
}

export default page
