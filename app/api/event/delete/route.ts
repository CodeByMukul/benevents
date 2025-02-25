import { NextResponse ,NextRequest} from 'next/server';
import prisma from '@/lib/prisma';
import {UTApi} from 'uploadthing/server';
export const POST = async (req: NextRequest) => {
  const utapi=new UTApi();
  const eventId = await req.json();
  try {
    const user=await prisma.user.findUnique({
      where:{
        clerkId:eventId.userId
      }
    })
    if(!user||!user.canCreateEvents)return NextResponse.json({msg:"Auth me issue sa aagya thoda"},{status:403})
    const delEvent= await prisma.event.delete({
      where:{
        eventId:eventId.eventId
      }
    })
    const fileKey = delEvent.imageUrl?.split('/').pop(); 
    await utapi.deleteFiles(fileKey||"");
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

