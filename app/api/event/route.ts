import { NextResponse ,NextRequest} from 'next/server';
import { PrismaClient } from '@prisma/client';

export const POST = async (req: NextRequest) => {
  const prisma=new PrismaClient();
  const values = await req.json();
  console.log("Received values:", values);
  if(values.isFree==true)values.price="0";

  const { id,categoryId, ...eventData } = values; // Destructure to get user ID and event data
  try {
    const newEvent = await prisma.event.create({
      data: {
        ...eventData,
        category:{
          connect:{id:categoryId}
        },
        host:{
          connect:{
            clerkId:id
          }
        }
        
      },
    });

    return NextResponse.json(newEvent);
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

