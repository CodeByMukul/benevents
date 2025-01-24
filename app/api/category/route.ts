import prisma from "@/lib/prisma";
import { handleError } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST=async(req:NextRequest)=>{
  try{
    const body=await req.json();
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
