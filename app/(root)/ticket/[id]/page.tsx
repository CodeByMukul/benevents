import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"

async function getTicketData(id: string) {
  return {
    eventName: "Example Event",
    date: "2022-01-01",
    time: "12:00 PM",
    location: "123 Example St, City",
    seat: "A1",
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const ticket = await getTicketData(params.id)
  if (!ticket) {
    return {}
  }
  return {
    title: `Ticket for ${ticket.eventName}`,
    description: `Your ticket for ${ticket.eventName} on ${ticket.date}`,
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
          <h1 className="text-xl sm:text-2xl font-bold">{ticket.eventName}</h1>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex justify-center mt-6">
            <QRCodeSVG value={`https://example.com/verify/${params.id}`} size={200} />
          </div>
          <p className="text-xs text-center text-gray-500 mt-2">Scan to verify ticket</p>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold">{ticket.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="font-semibold">{ticket.time}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-semibold">{ticket.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Seat</p>
            <p className="font-semibold">{ticket.seat}</p>
          </div>
        </div>
        <div className="bg-primary-50 p-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">Ticket ID: {params.id}</p>
          <Image src="/logo.svg" alt="Event Logo" width={40} height={40} />
        </div>
      </div>
    </div>
  )
}


