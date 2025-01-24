import Image from "next/image";
import { Button } from "@/components/ui/button";
import Collection from "@/components/shared/Collection";
import Link from "next/link";
import prisma from "@/lib/prisma";
//
export default async function Home() {
  const events=await prisma.event.findMany({
    include:{
      host:true,
      category:true
    }
  });
  console.log(events)
  return (
  <>
    <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0"> {//wrapper makes it so that the content aligns width the max width of navbar
        }
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold ">
              Host, Connect, Participate: All Bennett Events In One Place
            </h1>
            <p className="p-regular-20 md:p-regular-24 ">See what&apos;s happening at Bennett University. Search and join in workshops, hackathons and more.</p>
            <Button className="button w-full sm:w-fit" size="lg" asChild>
              <Link href="#events">Explore Now</Link>
            </Button>

          </div>
         <Image src="/assets/images/hero.png" alt="home" width={1000} height={1000} className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"></Image> 
        </div>

      </section>
      <section id="events" className="wrapper my-8 flex-col flex gap-8 md:gap-12">
        <h2 className="h2-bold ">Current Events</h2>
        <div className="flex w-full flex-col gap-5 md:flex-row ">
          Search
          Category
          Filter
        </div>
        <Collection data={events} emptyTitle="No Events Found" emptyStateSubtext="Come back later" collectionType="All_Events" limit={6} page={1} totalPages={2}></Collection>
        
      </section>
  </>
  );
}
