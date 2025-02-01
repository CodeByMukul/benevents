import { handleError } from '@/lib/utils';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.key_id!,
  key_secret: process.env.key_secret!
});

export async function POST(req: Request) {
  try {
    const { sessionClaims } = await auth();
    if (!sessionClaims) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

    const { eventId } = await req.json();
    const event = await prisma.event.findUnique({
      where: { eventId },
      select: { title: true, price: true, isFree: true }
    });

    if (!event) return NextResponse.json({ msg: "Event not found" }, { status: 400 });

    // If the event is free, create a database order without Razorpay
    if (event.isFree) {
      const freeOrder = await prisma.order.create({
        data: {
          stripeId: crypto.randomUUID(), 
          totalAmount: "0",
          eventId,
          buyerId: sessionClaims.sub,
          status:"completed"
        }
      });

      return NextResponse.json({
        orderId: freeOrder.id,
        amount: 0,
        dbOrderId: freeOrder.id,
        message: "Order created for a free event."
      }, { status: 200 });
    }
    else{
    const order = await razorpay.orders.create({
      amount: Number(event.price) * 100,
      currency: "INR",
      receipt: `test-${Date.now()}`,
      notes: {
        eventId,
        name: event.title,
      }
    });

    const newOrder = await prisma.order.create({
      data: {
        stripeId: order.id,
        totalAmount: order.amount.toString(),
        eventId,
        buyerId: sessionClaims.sub
      }
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      dbOrderId: newOrder.id
    }, { status: 200 });
    }
  } catch (e) {
    handleError(e);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}

