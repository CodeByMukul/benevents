import { IEvent } from "@/types"
import { Button } from "../ui/button"

const Checkout = ({event,userId}:{event:IEvent,userId:string|null|undefined}) => {
  const onCheckout=async()=>{
    console.log("checkout")
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
