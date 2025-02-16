import prisma from "@/lib/prisma"
import { formatDateTime } from "@/lib/utils"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"

async function getTicketData(id: string) {
  return prisma.event.findUnique({
    where: { eventId:id },
  })
  
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const ticket = await getTicketData(params.id)
  if (!ticket) {
    return {}
  }
  return {
    title: `Ticket for ${ticket.title}`,
    description: `Your ticket for ${ticket.title} on ${ticket.startDateTime}`,
    openGraph: {
      images: [`/api/og?ticketId=${params.id}`],
    },
  }
}

export default async function TicketPage({ params }: { params: { id: string } }) {
  const ticket = await getTicketData(params.id)

  //if (!ticket) {
  //  notFound()
  //}

 return (
    <div className="min-h-screen bg-primary-100 bg-dotted-pattern flex items-start justify-center p-4 pt-8 sm:pt-16 md:pt-24">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-sm sm:max-w-md">
        <div className="bg-primary text-white p-4">
          <h1 className="text-xl sm:text-2xl font-bold">{ticket?.title}</h1>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex justify-center mt-6">
            <QRCodeSVG value={`https://example.com/verify/${params.id}`} size={200} />
          </div>
          <p className="text-xs text-center text-gray-500 mt-2">Scan to verify ticket</p>
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
          <p className="text-sm text-gray-600">Ticket ID: {params.id}</p>
          <Image src={ticket?.imageUrl||"https://cdn.pixabay.com/photo/2016/10/23/17/06/calendar-1763587_1280.png"} alt="Event Logo" width={40} height={40} />
        </div>
      </div>
    </div>
  )
}


