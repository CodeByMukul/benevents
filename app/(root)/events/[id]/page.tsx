
import prisma from "@/lib/prisma";
import CheckoutButton from "@/components/shared/CheckoutButton";
import Link from "next/link";
import Collection from "@/components/shared/Collection";
import Image from "next/image";
import { formatDateTime } from "@/lib/utils";

const page = async ({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ relatedPage?: string; categoryPage?: string }> }) => {
  const { id } = await params;
  const { relatedPage = "1", categoryPage = "1" } = await searchParams;
  const pageSize = 3;

  // Convert pages to numbers
  const relatedPageNum = Number(relatedPage);
  const categoryPageNum = Number(categoryPage);

  // Fetch the main event
  const event = await prisma.event.findUnique({
    where: { eventId: id },
    include: { host: true, category: true,orders:{where:{status:"completed"}}},
  });

  if (!event) {
    return <p className="text-center p-bold-20">Event not found</p>;
  }

  // Fetch total counts for pagination
  const totalRelatedEvents = await prisma.event.count({
    where: {
      startDateTime: { gte: new Date() },
      host: { username: event.host.username },
      NOT: { eventId: event.eventId },
    },
  });

  const totalCategoryEvents = await prisma.event.count({
    where: {
      startDateTime: { gte: new Date() },
      categoryId: event.categoryId,
      NOT: { eventId: event.eventId },
    },
  });

  const totalRelatedPages = Math.ceil(totalRelatedEvents / pageSize);
  const totalCategoryPages = Math.ceil(totalCategoryEvents / pageSize);

  // Fetch events by the same host
  const relatedEvents = await prisma.event.findMany({
    where: {
      startDateTime: { gte: new Date() },
      host: { username: event.host.username },
      NOT: { eventId: event.eventId },
    },
    include: { host: true, category: true },
    orderBy: { startDateTime: "asc" },
    take: pageSize,
    skip: (relatedPageNum - 1) * pageSize,
  });

  // Fetch events in the same category
  const categoryEvents = await prisma.event.findMany({
    where: {
      startDateTime: { gte: new Date() },
      categoryId: event.categoryId,
      NOT: { eventId: event.eventId },
    },
    include: { host: true, category: true },
    orderBy: { startDateTime: "asc" },
    take: pageSize,
    skip: (categoryPageNum - 1) * pageSize,
  });

  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image
            src={event.imageUrl}
            alt="img"
            width={1000}
            height={1000}
            className="h-full min-h-[300] object-cover object-center"
          />
          <div className="flex w-full gap-8 flex-col p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h2 className="h2-bold">{event.title}</h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                    {event.isFree ? "Free" : `₹${event.price}`}
                  </p>
                  <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-gray-500">
                    {event?.category?.name}
                  </p>
                </div>
                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  by{" "}
                  <span className="text-primary-500">
                    {event.host.firstName} {event.host.lastName}
                  </span>
                </p>
              </div>
            </div>
            {/* Checkout / Edit Button */}
            <CheckoutButton event={event} />
            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt="calendar"
                  width={32}
                  height={32}
                />
                <div className="p-medium-16 lg:p-regular-20 flex flex-col flex-wrap items-center">
                  <p>
                    {formatDateTime(event?.startDateTime).dateOnly} -{" "}
                    {formatDateTime(event?.startDateTime).timeOnly}
                  </p>
                  <p className="ml-1">
                    {formatDateTime(event?.endDateTime).dateOnly} -{" "}
                    {formatDateTime(event?.endDateTime).timeOnly}
                  </p>
                </div>
              </div>
              <div className="p-regular-20 flex items-center gap-3">
                <Image
                  src="/assets/icons/location.svg"
                  alt="location"
                  width={32}
                  height={32}
                />
                <p className="p-medium-16 lg:p-regular-20">{event?.location}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-gray-600">What You'll Learn</p>
              <p className="p-medium-16 lg:p-regular-18">{event?.description}</p>
              <Link
                href={event.url!}
                target="_blank"
                className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline"
              >
                {event?.url}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Events */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Related Events</h2>
        <Collection
          data={relatedEvents}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={pageSize}
          page={relatedPageNum}
          totalPages={totalRelatedPages}
          urlParamName="relatedPage"
        />
      </section>

      {/* Events in Same Category */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Events With Tag "{event?.category?.name}"</h2>
        <Collection
          data={categoryEvents}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={pageSize}
          page={categoryPageNum}
          totalPages={totalCategoryPages}
          urlParamName="categoryPage"
        />
      </section>
    </>
  );
};

export default page;

