"use client";

import { useEffect, useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tables } from "@/types_db";
import { getUser } from "@/lib/store/user";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function Checkout() {
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<Tables<"users"> | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    getUser().then((ret) => {
      if (ret.data) {
        setUser(ret.data);
      } else {
        console.log(ret.error);
      }
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <p
        className={cn(
          "font-bold mt-6 mb-10",
          user ? "text-2xl" : "text-muted-foreground",
        )}
      >
        {user
          ? "Current Credits: " + user.credit
          : "Ops, you are not signed in."}
      </p>
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={quantity}
          className="w-auto"
          onChange={(e) => {
            const num = Number(e.target.value);
            setQuantity(num < 1 ? 1 : num);
          }}
        />
        <Button
          disabled={isLoading || !user}
          onClick={async () => {
            setIsLoading(true);
            try {
              if (!user) {
                toast({
                  title: "Error",
                  description: "You are not signed in.",
                  variant: "destructive",
                });
                return;
              }
              // create checkout session
              const sessionId = await (
                await import("@/lib/stripe/checkout")
              ).checkoutWithStripe(
                {
                  id: user.id,
                  email: user.email!,
                },
                quantity,
              );
              const stripe = await (
                await import("@/lib/stripe/client")
              ).getStripe();
              stripe?.redirectToCheckout({ sessionId });
            } catch (error) {
              console.log(error);
              toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
              });
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
          Checkout
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        You will receive <b>{(quantity + Math.floor(quantity / 5)) * 10}</b>{" "}
        credits
      </p>
    </div>
  );
}
