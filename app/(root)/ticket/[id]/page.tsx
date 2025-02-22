import prisma from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { encryptJson, formatDateTime } from "@/lib/utils"
import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"

export default async function TicketPage({ params }: { params:Promise< { id: string }> }) {
  const {id}=await params;
  const {sessionClaims}=await auth();
  const clerkId=sessionClaims?.id
  if (!clerkId) return <p className="text-center text-red-500">Unauthorized</p>;
  const hasTicket= await prisma.order.findFirst({
    where:{
      eventId:id,
      status:"completed",
      buyerId:clerkId
    },
    include:{
      event:{
        include:{
          host:true
        }
      }
    }
  })

  //I dont know if this increases security but why not
  if (!hasTicket) {
    redirect("/events/"+id)
  }

  const ticket=hasTicket.event;
  const qrData=hasTicket.used?"https://benevents.vercel.app/events"+ticket.eventId:encryptJson({eventId:ticket.eventId,orderId:hasTicket.id})


 return (
    <div className="min-h-screen bg-primary-100 bg-dotted-pattern flex items-start justify-center p-4 pt-8 sm:pt-16 md:pt-24">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-sm sm:max-w-md">
        <div className="bg-primary text-white p-4">
          <h1 className="text-xl sm:text-2xl font-bold">{ticket?.title}</h1>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
                <div className="flex justify-center mt-6 relative"> {/* Relative for positioning overlay */}
                    <QRCodeSVG value={qrData} size={200} className={hasTicket.used? "blur-md" : ""} />
                    {hasTicket.used&& (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-semibold h-fit mt-20 bg-white  text-2xl">
                            Used
                        </div>
                    )}
                </div>         <p className="text-xs text-center text-gray-500 mt-2">Scan to verify ticket</p>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold">{formatDateTime(ticket?.startDateTime!).dateOnly}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="font-semibold">{formatDateTime(ticket?.startDateTime!).timeOnly}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-semibold">{ticket?.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Know more</p>
            <p className="font-thin text-sm">{ticket?.description}</p>
          </div>
        </div>
        <div className="bg-primary-50 p-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">Ticket ID: {id}</p>
          <Avatar className='w-10 h-10 ml-2'>
            <AvatarImage src={ticket.host.photo} />
            <AvatarFallback>host</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}


