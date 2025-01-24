import { NextResponse ,NextRequest} from 'next/server';
import prisma from '@/lib/prisma';
export const POST = async (req: NextRequest) => {
  const eventId = await req.json();
  try {
    const delEvent= await prisma.event.delete({
      where:{
        eventId:eventId.eventId
      }
    })
        

    return NextResponse.json(delEvent);
  } catch (e) {
    // Improved error handling
    if (e instanceof Error) {
      console.error("Error creating event:", e.message);
    } else {
      console.error("Unexpected error:", e);
    }
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
};

