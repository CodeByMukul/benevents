import { NextResponse ,NextRequest} from 'next/server';
import prisma from '@/lib/prisma';
export const POST = async (req: NextRequest) => {
  
    try {
        const { eventId, orderId } = await req.json(); // Assuming your decrypted data is like this

        if (!eventId || !orderId) {
            return NextResponse.json({ message: 'Missing eventId or orderId' },{status:405});
        }

        // 1. Database Query (Example using Prisma - adapt to your DB):
        // Replace this with your actual database query logic
        const ticket = await prisma.order.findUnique({
            where: { id:orderId,eventId , status:"completed"}, // Example composite key
        });

        if (!ticket) {
            return NextResponse.json({ message: 'Ticket not found' },{status:403});
        }

        // 2. Additional Verification Logic (If Needed):
        // Add any other checks you need here.  For example, you might want to
        // check if the ticket is still valid, if it hasn't been used, etc.

        // Example: Check if the event date is in the future
        const event = await prisma.event.findUnique({where:{eventId:ticket.eventId}})
        if (event && new Date(event.endDateTime) < new Date()) {
            return NextResponse.json({ message: 'This ticket has expired' },{status:200});
        }
        if (ticket.used) {
            return NextResponse.json({ message: 'This ticket has been used' },{status:200});
        }

        // 3. Success Response:
        const updatedTicket = await prisma.order.update({where:{id:orderId},data:{used:true}});
        return NextResponse.json({ success: true, message: 'Ticket is valid' },{status:200});

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ message: 'An error occurred during verification' },{status:500});
    }
}


