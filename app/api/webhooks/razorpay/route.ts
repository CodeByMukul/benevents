import { NextRequest, NextResponse } from "next/server";
import crypto, { sign } from 'crypto'
import { json } from "stream/consumers";
import prisma from "@/lib/prisma";

export async function POST(req:NextRequest){
  try{
   const body=await req.text();
   const signature=req.headers.get("x-razorpay-signature")
   const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_WEBHOOK_SECRET!).update(body).digest("hex")
   if(signature!==expectedSignature)return NextResponse.json({
     msg:"Invalid Signature"
   },{
     status:400
   })
  
   const event=JSON.parse(body);
   if(event.event==="payment.captured"){
     const payment=event.payload.payment.entity;
     const order=prisma.order.update({
       where:{
         stripeId:payment.order_id
       },
       data:{
         status:"completed"
       }
     })
     console.log(order);
     return NextResponse.json({msg:"Payment completed"},{status:200})
   }
   if(event.event==="payment.failed"){
     const payment=event.payload.payment.entity;
     const order=prisma.order.delete({
       where:{
         stripeId:payment.order_id
       },
     })
     console.log(order);
     return NextResponse.json({msg:"Payment completed"},{status:200})
   }

  }catch(e){
    console.log(e);
    return NextResponse.json({msg:"something went wrong"},{status:400})
  }

}
