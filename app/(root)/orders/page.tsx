import Search from '@/components/shared/Search'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import prisma from '@/lib/prisma'
import { formatDateTime, formatPrice } from '@/lib/utils'
import { SearchParamProps } from '@/types'
import { IOrder } from '@/types'
import { auth } from '@clerk/nextjs/server'
import { count } from 'console'
import { notFound, redirect } from 'next/navigation'
const Orders = async ({ searchParams }: SearchParamProps) => {
  const si = await searchParams
  const eventId = (si?.eventId as string);
  const query = (si?.query as string);

  const { sessionClaims } = await auth();
  const userId = sessionClaims?.username;
  const user = await prisma.user.findUnique({
    where: {
      username: userId, canCreateEvents: true, events: {
        some: {
          eventId: eventId
        }
      }
    },
    select: { events: true },
  });
  // if (!user) if (userId != "owner") redirect("/");
  if (!user) if (userId != "owner") return notFound();
  const orders: IOrder[] = await prisma.order.findMany({
    where: {
      eventId: eventId ? eventId : undefined,
      status: "completed",
      OR: [
        {
          buyer: {
            email: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
        {
          buyer: {
            lastName: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
        {
          buyer: {
            firstName: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ],
    },
    include: {
      buyer: true, // Fetch user details
      event: { include: { category: true } }, // Fetch event details
    },
    orderBy: { createdAt: "desc" },
  }); return (
    <>
      <section className=" bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left ">Participants</h3>
        <p className="p-regular-16 text-center sm:text-left wrapper text-primary-500">Total participants: {orders.length}</p>
      </section>

      <section className="wrapper mt-8">
        <Search placeholder="Search buyer name..." />
      </section>

      <section className="wrapper overflow-x-auto">
        <table className="w-full border-collapse border-t">
          <thead>
            <tr className="p-medium-14 border-b text-grey-500">
              <th className="min-w-[100px] py-3 text-left">Order ID</th>
              <th className="min-w-[100px] py-3 text-left">Present</th>
              <th className="min-w-[250px] flex-1 py-3 pr-4 text-left">User Email</th>
              <th className="min-w-[150px] py-3 text-left">Buyer</th>
              <th className="min-w-[100px] py-3 text-left">Booked</th>
              <th className="min-w-[100px] py-3 text-right">Event</th>
              <th className="min-w-[100px] py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length === 0 ? (
              <tr className="border-b">
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              <>
                {orders?.map((row: IOrder) => (
                  <tr
                    key={row.id}
                    className="p-regular-14 lg:p-regular-16 border-b "
                    style={{ boxSizing: 'border-box' }}>
                    <td className="min-w-[100px] py-4 text-primary-500">{row.id}</td>
                    <td className="min-w-[100px] py-3 text-left">{row.used ? "Yes" : "No"}</td>
                    <td className="min-w-[200px] flex-1  flex gap-2 py-4 pr-6">

                      <Avatar className='w-6 h-6'>
                        <AvatarImage src={row.buyer?.photo} />
                        <AvatarFallback>Pic</AvatarFallback>
                      </Avatar>
                      {row.buyer?.email}</td>
                    <td className="min-w-[150px] py-4">{row.buyer?.firstName} {row.buyer?.lastName}</td>
                    <td className="min-w-[100px] py-4">
                      {formatDateTime(row.createdAt).dateTime}
                    </td>
                    <td className="min-w-[100px] py-4 text-right">
                      {row.event?.title}
                    </td>
                    <td className="min-w-[100px] py-4 text-right">
                      {formatPrice(row.totalAmount || "")}
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </section>
    </>
  )
}

export default Orders
