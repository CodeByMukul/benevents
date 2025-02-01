import { handleError } from '@/lib/utils';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay'
const razorpay=new Razorpay({
  key_id:process.env.key_id!,
  key_secret:process.env.key_secret
})

export async function POST(req:Request){
  try{
    const {sessionClaims} = await auth();
    if(!sessionClaims)return NextResponse.json({msg:"Unauthorized"},{status:401})
    const {eventId}=await req.json();
    const event=await prisma.event.findUnique({
      where:{
        eventId
      }
    })
    if(!event)return NextResponse.json({msg:"Event not found"},{status:400});
    if(!event.price)return NextResponse.json({msg:"Event price not found"},{status:400});
    const order=await razorpay.orders.create({
      amount:event.isFree?0:Number(event.price)*100,
      currency:"INR",
      receipt:`test-${Date.now()}`,
      notes:{
        eventId,
        name:event.title,

      },
    })
    const newOrder=await prisma.order.create({
      data:{
        stripeId:order.id,
        totalAmount:order.amount.toString(),
        eventId,
        buyerId:sessionClaims.sub
      }
    })

    return NextResponse.json({
      orderId:order.id,
      amount:order.amount,
      dbOrderId:newOrder.id
    },{status:200})

  }catch(e){
    handleError(e)
  }
}
/*
 *
  id         Int      @id @default(autoincrement())
  createdAt  DateTime @default(now())
  stripeId   String   @unique
  totalAmount String?
  eventId    String
  event      Event    @relation("EventOrders", fields: [eventId], references: [eventId])
  buyerId    String
  buyer      User     @relation("UserOrders", fields: [buyerId], references: [clerkId])
  */
