import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const GET = async (request: NextRequest) => {
  const client = new PrismaClient();
  const users=await client.user.delete({
    where:{
      username:"this",
      firstName:'this',
      lastName:'this',
      email:'this',
      clerkId:'thisfindMany',
      photo:''
    }
  });
  return NextResponse.json({users})
};
