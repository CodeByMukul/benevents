import { IEvent } from "@/types"
import { Button } from "../ui/button"
import Razorpay from "razorpay"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import prisma from "@/lib/prisma"
import axios from "axios"

const Checkout = ({event,userId}:{event:IEvent,userId:string|null|undefined}) => {
  const router=useRouter();
  const onCheckout=async()=>{
    console.log("checkout")
    const res=await axios.post('/api/order',{eventId:event.eventId})
    const options = {
        key: process.env.key_id,
        amount:event.price,
        currency: "INR",
        name: "Benevents",
        description: `${event.title} `,
        order_id: res.data.orderId,
        handler: function () {
          router.push("/profile");
        },
        prefill: {
          email: userId,
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
  }
  return (
    <form action={onCheckout}>
      <Button type="submit" role="link" size="lg" className="button sm:w-fit">
        {event.isFree?'Join for free':'Buy Ticket'}
      </Button>
    </form>
  )
}

export default Checkout
