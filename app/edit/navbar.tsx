"use client";

import { BadgeCent, Loader2, Menu } from "lucide-react";
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
import { getAuthUser, signOut } from "@/lib/supabase/auth";
import { useToast } from "@/hooks/use-toast";
import { getUser } from "@/lib/store/user";
import { Tables } from "@/types_db";
import { Separator } from "@/components/ui/separator";

export function EditNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignIn, setIsSignIn] = useState<boolean>(false);
  const [user, setUser] = useState<Tables<"users"> | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    getAuthUser().then((ret) => {
      if (ret.data) {
        setIsSignIn(true);
      } else {
        setIsSignIn(false);
      }
    });
  }, []);
  useEffect(() => {
    if (isSignIn) {
      getUser().then((ret) => {
        setUser(ret.data);
      });
    }
  }, [isSignIn]);

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
          <span className="text-xl font-black">Edit</span>
        </div>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/mydesigns" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  My Designs
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
                <Separator className="my-2" />
                <Link href="/mydesigns" onClick={() => setIsOpen(false)}>
                  My Designs
                </Link>
                <Separator className="my-2" />
                {isSignIn ? (
                  <Button
                    className="w-full"
                    onClick={async () => {
                      const { error } = await signOut();
                      if (error) {
                        toast({
                          title: "Error",
                          description: error,
                          variant: "destructive",
                        });
                      }
                      window.location.reload();
                    }}
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <Link href="/signin">Sign In</Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          {isSignIn ? (
            <Button className="w-18" asChild>
              <Link href="/pricing" className="flex gap-2 items-center">
                <BadgeCent className="w-6 h-6" />
                {user ? (
                  user.credit
                ) : (
                  <Loader2 className="w-6 h-6 animate-spin" />
                )}
              </Link>
            </Button>
          ) : (
            <Button className="w-18" asChild>
              <Link href="/signin" target="_blank">
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
