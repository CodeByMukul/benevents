import { Button } from "@/components/ui/button";
import Collection from "@/components/shared/Collection";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Search from "@/components/shared/Search";
import { Suspense } from "react";

// Loading components for better UX during data fetching
const TicketsLoading = () => (
  <div className="w-full h-32 bg-gray-200 animate-pulse rounded-md" />
);

const EventsLoading = () => (
  <div className="w-full h-32 bg-gray-200 animate-pulse rounded-md" />
);

// Define types based on the original code
type User = {
  canCreateEvents: boolean;
  clerkId: string;
};

type SearchParamsProps = {
  searchParams: Promise<{
    eventsPage?: string;
    myEventsPage?: string;
    query?: string;
  }>;
};

type TicketsProps = {
  userId: string;
  pageSize: number;
  myEventsPage: number;
  user: User | null;
};

type EventsProps = {
  userId: string;
  pageSize: number;
  eventsPage: number;
  query: string;
};

// Separate components for data fetching
const MyTickets = async ({ userId, pageSize, myEventsPage, user }: TicketsProps) => {
  // Fetch total count of purchased events (My Tickets)
  const totalMyEvents = await prisma.order.count({
    where: {
      buyerId: user?.clerkId,
      status: "completed",
    },
  });

  const totalMyEventsPages = Math.ceil(totalMyEvents / pageSize);

  // Fetch My Tickets (purchased events)
  const myOrders = await prisma.order.findMany({
    where: {
      buyerId: user?.clerkId,
      status: "completed",
    },
    include: {
      event: {
        include: {
          host: true,
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: pageSize,
    skip: (myEventsPage - 1) * pageSize,
  });

  const myEvents = myOrders.map((order) => order.event) || [];

  return (
    <Collection
      data={myEvents}
      emptyTitle="No events purchased yet"
      emptyStateSubtext="Explore and buy tickets to amazing events!"
      collectionType="My_Tickets"
      limit={pageSize}
      page={myEventsPage}
      urlParamName="myEventsPage"
      totalPages={totalMyEventsPages}
    />
  );
};

const OrganizedEvents = async ({ userId, pageSize, eventsPage, query }: EventsProps) => {
  // Fetch total event count for pagination (Organized Events)
  const totalEvents = await prisma.event.count({
    where: {
      host: { username: userId },
      AND: [
        {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { host: { firstName: { contains: query, mode: "insensitive" } } },
          ],
        },
      ],
    },
  });

  const totalPages = Math.ceil(totalEvents / pageSize);

  // Fetch events organized by the user
  const events = await prisma.event.findMany({
    where: {
      host: { username: userId },
      AND: [
        {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { host: { firstName: { contains: query, mode: "insensitive" } } },
          ],
        },
      ],
    },
    include: { host: true, category: true },
    orderBy: { createdAt: "desc" },
    take: pageSize,
    skip: (eventsPage - 1) * pageSize,
  });

  return (
    <Collection
      data={events || []}
      emptyTitle="No events hosted yet"
      emptyStateSubtext="Host Some Exciting Events!"
      collectionType="Events_Organized"
      limit={pageSize}
      page={eventsPage}
      urlParamName="eventsPage"
      totalPages={totalPages}
    />
  );
};

// Main Page Component - optimized with streaming
const Page = async ({ searchParams }: SearchParamsProps) => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.username as string;

  if (!userId) return <p className="text-center text-red-500">Unauthorized</p>;
  const searchParamss=await searchParams;
  const { eventsPage: eventsPageParam = "1", myEventsPage: myEventsPageParam = "1", query = "" } = searchParamss;
  const eventsPage = Math.max(1, Number(eventsPageParam) || 1);
  const myEventsPage = Math.max(1, Number(myEventsPageParam) || 1);
  const pageSize = 3;

  // Fetch just the user permissions - lightweight query
  const user = await prisma.user.findUnique({
    where: { username: userId },
    select: { canCreateEvents: true, clerkId: true },
  });

  return (
    <>
      {/* My Tickets Section - Fast initial layout */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center md:text-left">My Tickets</h3>
          <Button asChild className="button hidden sm:flex">
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
        <section className="wrapper my-8">
          <Suspense fallback={<TicketsLoading />}>
            <MyTickets userId={userId} pageSize={pageSize} myEventsPage={myEventsPage} user={user} />
          </Suspense>
        </section>
      </section>

      {/* Events Organized Section - Conditionally rendered */}
      {user?.canCreateEvents && (
        <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
          <div className="wrapper flex items-center justify-center sm:justify-between">
            <h3 className="h3-bold text-center md:text-left">Events Organized</h3>
            <Button asChild className="button hidden sm:flex">
              <Link href="/events/create">Create New Event</Link>
            </Button>
          </div>
          <div className="wrapper flex w-1/2 flex-col gap-5 md:flex-row">
            <Search placeholder="Search title..." />
          </div>
          <section className="wrapper my-8">
            <Suspense fallback={<EventsLoading />}>
              <OrganizedEvents userId={userId} pageSize={pageSize} eventsPage={eventsPage} query={query} />
            </Suspense>
          </section>
        </section>
      )}
    </>
  );
};

export default Page;
