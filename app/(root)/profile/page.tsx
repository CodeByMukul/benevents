
import { Button } from "@/components/ui/button";
import Collection from "@/components/shared/Collection";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const page = async ({ searchParams }: { searchParams: Promise<{ eventsPage?: string }> }) => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.username;
  const sp=await searchParams;
  const eventsPage = Number(sp.eventsPage) || 1;

  if (!userId) return <p className="text-center text-red-500">Unauthorized</p>;

  // Fetch the logged-in user
  const user = await prisma.user.findUnique({
    where: { username: userId },
    select: { canCreateEvents: true },
  });

  // Fetch total event count for pagination
  const totalEvents = await prisma.event.count({
    where: { host: { username: userId } },
  });

  const totalPages = Math.ceil(totalEvents / 3);

  // Fetch events organized by the user
  const events = await prisma.event.findMany({
    where: { host: { username: userId } },
    include: { host: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    skip: (eventsPage - 1) * 3,
  });

  return (
    <>
      {/* My Tickets Section */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center md:text-left">My Tickets</h3>
          <Button asChild className="button hidden sm:flex">
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
      </section>

      {/* Events Organized Section */}
      {user?.canCreateEvents && (
        <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
          <div className="wrapper flex items-center justify-center sm:justify-between">
            <h3 className="h3-bold text-center md:text-left">Events Organized</h3>
            <Button asChild className="button hidden sm:flex">
              <Link href="/events/create">Create New Event</Link>
            </Button>
          </div>
          <section className="wrapper my-8">
            <Collection
              data={events}
              emptyTitle="No events hosted yet"
              emptyStateSubtext="Host Some Exciting Events!"
              collectionType="Events_Organized"
              limit={3}
              page={eventsPage}
              urlParamName="eventsPage"
              totalPages={totalPages}
            />
          </section>
        </section>
      )}
    </>
  );
};

export default page;

