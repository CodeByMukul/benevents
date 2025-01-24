import { formatDateTime } from "@/lib/utils"
import DeleteConfirmation from "./DeleteConfirmation"
import Image from "next/image"
import { IEvent } from "@/types"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
type CardProps={
  event:IEvent,
  hasOrderLink?:boolean,
  hidePrice?:boolean
}
const Card = async({event,hasOrderLink,hidePrice}:CardProps) => {
  const {sessionClaims}=await auth()
  const userId=sessionClaims?.sub;
  const isEventCreater=userId===event.host.clerkId;
  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link href={`/events/${event.eventId}`}
      style={{backgroundImage:`url(${event.imageUrl})`}}
      className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-gray-500"
      />
        {/*is event creater */}
        {isEventCreater &&!hidePrice &&(
          <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
            <Link href={`/events/${event.eventId}/update`}>
              <Image src="/assets/icons/edit.svg" alt="edit" height={20} width={20}></Image>

            </Link>
            <DeleteConfirmation eventId={event.eventId}></DeleteConfirmation>
          </div>
        )}
      <Link href={`/events/${event.eventId}`}
      className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4 "
      >
      {!hidePrice&&
        <div className="flex gap-2">
          <span className="p-semibold-14 rounded-full bg-green-100 px-4 py-1 text-green-600">
            {event.isFree?'FREE':`Rs. ${event.price}`}
          </span>
          <p className="p-semibold-14 rounded-full bg-gray-500/10 px-4 py-1 text-grey-500">
            {event.category.name}
          </p>
        </div>
}
      <p className="p-medium-16 p-medium-18 text-grey-500">
        {formatDateTime(event.startDateTime).dateTime}
      </p>      
      <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
        {event.title}
      </p>
      <div className="w-full md:flex-between">
        <p className="p-medium-16 md:p-medium-18 text-slate-500">
          Hosted By:
        </p>
        <p className="p-medium-14 md:p-medium-16 text-gray-600">
          {event.host.firstName} {event.host.lastName}
        </p>
        {hasOrderLink && (
          <Link href={`/orders?eventId=${event.eventId}`} className="flex gap-2">
            <p className=" text-primary-500">
              Order Details
            </p>
            <Image src="/assets/icons/arrow.svg" alt="search" width={10} height={10}>

            </Image>
          </Link>
        )}

      </div>

      </Link>
    </div>
  )
}

export default Card
