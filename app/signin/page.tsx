"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signin, signup } from "@/lib/supabase/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CommonNavbar } from "@/components/common-navbar";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignIn) {
      // Handle signin logic here
      const { error } = await signin(email, password);
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Sign in successful",
        });
        router.push("/");
      }
    } else {
      // Handle signup logic here
      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
      }
      const { error } = await signup(email, password);
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description:
            "Sign up successful, please check your email for verification",
        });
        setIsSignIn(true);
      }
    }
  };

  // const handleGoogleAuth = () => {
  //   // Handle Google authentication logic here
  //   console.log(`Google ${isSignIn ? "signin" : "signup"} attempted`);
  // };

  const toggleAuthMode = () => {
    setIsSignIn(!isSignIn);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="min-h-screen flex flex-col">
      <CommonNavbar pageName={"Sign In"} />
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {isSignIn ? "Sign In" : "Sign Up"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {!isSignIn && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full">
              {isSignIn ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-sm text-blue-600 hover:underline"
            >
              {isSignIn
                ? "Don't have an account? Sign up"
                : "Already have an account? Log in"}
            </button>
          </div>
          {isSignIn && (
            <div className="mt-4 text-center">
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          )}
          {/*<div className="mt-6">*/}
          {/*  <Separator className="my-4" />*/}
          {/*  <Button*/}
          {/*    variant="outline"*/}
          {/*    className="w-full"*/}
          {/*    onClick={handleGoogleAuth}*/}
          {/*  >*/}
          {/*    {isSignIn ? "Sign in" : "Sign up"} with Google*/}
          {/*  </Button>*/}
          {/*</div>*/}
        </div>
      </div>
    </main>
  );
}
