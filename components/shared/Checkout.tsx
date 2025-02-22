import { useState } from "react";
import { IEvent } from "@/types";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

const Checkout = ({ event, userId }: { event: IEvent; userId: string | null | undefined }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // @ts-ignore
  const bought = event.orders?.some((obj) => obj.buyerId === userId);

  const onCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post("/api/order", { eventId: event.eventId });

      if (!event.isFree) {
        const options = {
          key: process.env.key_id,
          amount: event.price,
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
        rzp.on("payment.failed", () => setLoading(false));
      } else {
        router.push("/profile");
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onCheckout}>
      {bought ? (
        <Button disabled size="lg" className="button sm:w-fit">
          Bought
        </Button>
      ) : (
        <Button type="submit" role="link" size="lg" className="button sm:w-fit" disabled={loading}>
          {loading ? "Buying..." : event.isFree ? "Join for free" : "Buy Ticket"}
        </Button>
      )}
    </form>
  );
};

export default Checkout;

