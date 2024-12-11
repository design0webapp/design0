"use client";

import { BadgeCent, Loader2, Menu, Minus, Plus } from "lucide-react";
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
import { useRouter } from "next/navigation";

export function EditNavbar({
  widthSize,
  setWidthSize,
}: {
  widthSize: "full" | "mid" | "mini";
  setWidthSize: (value: "full" | "mid" | "mini") => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignIn, setIsSignIn] = useState<boolean>(false);
  const [user, setUser] = useState<Tables<"users"> | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const checkAuthAndFetchUser = async () => {
    const authRet = await getAuthUser();
    if (authRet.data) {
      setIsSignIn(true);
      const userRet = await getUser();
      if (userRet.data) {
        setUser(userRet.data);
      } else {
        console.log(userRet.error);
      }
    } else {
      setIsSignIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuthAndFetchUser();
    const interval = setInterval(checkAuthAndFetchUser, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSizeChange = (direction: "increase" | "decrease") => {
    const sizes: ("full" | "mid" | "mini")[] = ["full", "mid", "mini"];
    const currentIndex = sizes.indexOf(widthSize);
    if (direction === "increase" && currentIndex > 0) {
      setWidthSize(sizes[currentIndex - 1]);
    } else if (direction === "decrease" && currentIndex < sizes.length - 1) {
      setWidthSize(sizes[currentIndex + 1]);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 flex h-14 items-center">
        <div className="flex items-center space-x-2 w-1/3">
          <Image
            src={"/logo.webp"}
            alt={"logo of design0"}
            width={32}
            height={32}
            className="w-9 h-9"
          />
          <span className="text-xl font-black">Edit</span>
        </div>

        <div className="flex items-center justify-center w-1/3">
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleSizeChange("increase")}
              disabled={widthSize === "full"}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <div className="min-w-[4rem] text-center">
              {widthSize.toUpperCase()}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handleSizeChange("decrease")}
              disabled={widthSize === "mini"}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end w-1/3">
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
                      setIsOpen(false);
                      setIsSignIn(false);
                      setUser(null);
                      router.push("/");
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
