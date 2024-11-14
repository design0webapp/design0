"use client";

import { Loader2, Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { getUser, signout } from "@/lib/supabase/auth";
import { useToast } from "@/hooks/use-toast";

export function CommonNavbar({ pageName }: { pageName: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignIn, setIsSignIn] = useState<boolean | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    getUser().then((ret) => {
      if (ret.data) {
        setIsSignIn(true);
      } else {
        setIsSignIn(false);
      }
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src={"/logo.webp"}
            alt={"logo of design0"}
            width={32}
            height={32}
            className="w-9 h-9"
          />
          <span className="text-xl font-black">
            {pageName ? pageName : "Design0"}
          </span>
        </div>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {pageName != null && (
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem>
              <Link href="/features" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Features
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/pricing" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Pricing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4">
                {pageName != null && (
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    Home
                  </Link>
                )}
                <Link href="/features" onClick={() => setIsOpen(false)}>
                  Features
                </Link>
                <Link href="/pricing" onClick={() => setIsOpen(false)}>
                  Pricing
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          {isSignIn === null ? (
            <Button disabled={true} className="w-20">
              <Loader2 className="animate-spin" />
            </Button>
          ) : isSignIn ? (
            <Button
              className="w-20"
              onClick={async () => {
                const { error } = await signout();
                if (error) {
                  toast({
                    title: "Error",
                    description: error,
                    variant: "destructive",
                  });
                }
                setIsSignIn(false);
              }}
            >
              Sign Out
            </Button>
          ) : (
            <Button className="w-20">
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
