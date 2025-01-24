import prisma from "@/lib/prisma";
import { handleError } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST=async(req:NextRequest)=>{
  try{
    const body=await req.json();
    console.log(body)
    const user=await prisma.user.findUnique({
      where:{
        clerkId:body.userId
      }
    })
    if(!user||!user.canCreateEvents)return NextResponse.json({msg:"permission nahi hai apko"},{status:403})
    const cat=await prisma.category.create({
      data:{
        name:body.name
      }
    })
    console.log(cat);
    return NextResponse.json({cat})
  }catch(e){
    handleError(e);
  }
}

export const GET=async(req:NextRequest)=>{
  try{
    const cats=await prisma.category.findMany();
    return NextResponse.json({categories:cats})
  }catch(e){
    handleError(e);
  }

}
