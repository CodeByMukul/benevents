"use client";
import { Button } from "../ui/button";
import Link from "next/link";
import { SignedIn,SignedOut } from "@clerk/nextjs";
import Checkout from "./Checkout";
import { IEvent } from "@/types"
import { useAuth, useUser } from "@clerk/nextjs";
const CheckoutButton = ({event}:{event:IEvent}) => {
  const {userId}=useAuth();
  const closedEvent=new Date(event.startDateTime)<new Date();
  return (
    <div className="flex items-center gap-3">
      {/*cannot buy past events*/}
      {
        closedEvent?
          <p>Sorry, tickets are no longer available.</p>
          :(
            <>
            <SignedOut>
              <Button className="button rounded-full " size="lg" asChild>
                <Link href="/sign-in">
                  Get Tickets
                </Link>

              </Button>
            </SignedOut>
            <SignedIn>
              <Checkout event={event} userId={userId}/>
            </SignedIn>
            </>
          )
      }
    </div>
  )
}

export default CheckoutButton
