"use client";

import { useEffect, useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tables } from "@/types_db";
import { getUser } from "@/lib/store/user";
import { cn } from "@/lib/utils";

export function Checkout() {
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<Tables<"users"> | null>(null);

  useEffect(() => {
    getUser().then((ret) => {
      setUser(ret.data);
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
            setTimeout(() => {
              setIsLoading(false);
            }, 5000);
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
