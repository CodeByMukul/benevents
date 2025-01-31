import Image from "next/image";
import CategoryFilter from "@/components/shared/CategoryFilter";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import Collection from "@/components/shared/Collection";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function Home({ searchParams }: { searchParams: Promise<any> }) {
  let { query, category, page } = await searchParams;
  page = Number(page) || 1;
  const perPage = 6; // Number of events per page

  query = query?.toLowerCase() || "";
  category = category?.toLowerCase() || "";

  // Count total events matching the filters (without pagination)
  const totalEvents = await prisma.event.count({
    where: {
      startDateTime: { gte: new Date() },
      AND: [
        {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { host: { firstName: { contains: query, mode: "insensitive" } } }
          ]
        },
        category ? { category: { name: { equals: category, mode: "insensitive" } } } : {}
      ]
    },
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalEvents / perPage);

  // Fetch paginated events
  const events = await prisma.event.findMany({
    where: {
      startDateTime: { gte: new Date() },
      AND: [
        {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { host: { firstName: { contains: query, mode: "insensitive" } } }
          ]
        },
        category ? { category: { name: { equals: category, mode: "insensitive" } } } : {}
      ]
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: {
      startDateTime: "asc",
    },
    include: {
      host: true,
      category: true,
    },
  });

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">Host, Connect, Participate: All Bennett Events In One Place</h1>
            <p className="p-regular-20 md:p-regular-24">
              See what&apos;s happening at Bennett University. Search and join in workshops, hackathons, and more.
            </p>
            <Button className="button w-full sm:w-fit" size="lg" asChild>
              <Link href="#events">Explore Now</Link>
            </Button>
          </div>
          <Image
            src="/assets/images/hero.png"
            alt="home"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>
      <section id="events" className="wrapper my-8 flex-col flex gap-8 md:gap-12">
        <h2 className="h2-bold">Current Events</h2>
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search placeholder="Search title..." />
          <CategoryFilter />
        </div>
        <Collection
          data={events}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={perPage}
          page={page}
          totalPages={totalPages}
        />
      </section>
    </>
  );
}

