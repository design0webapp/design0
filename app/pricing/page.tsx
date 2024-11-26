import { CommonNavbar } from "@/components/common-navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BadgeCent,
  CreditCard,
  Gift,
  Image as ImageIcon,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";
import React, { Suspense } from "react";
import { Checkout } from "@/app/pricing/checkout";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import { getURL } from "@/lib/helpers";

export async function generateMetadata(): Promise<Metadata> {
  const url = getURL("/pricing");
  return {
    alternates: {
      canonical: url,
    },
  };
}

export default async function PricingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <CommonNavbar pageName={"Pricing"} />
      <div className="px-2 py-8 md:py-12 xl:py-16 mx-auto w-[80rem] max-w-full flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-2">
          <BadgeCent className="w-12 h-12" />
          <span>Pricing & Credits</span>
        </h1>

        <div className="w-full grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                <h2>Your Credits</h2>
              </CardTitle>
              <CardDescription>
                Check your balance and buy more credits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton />}>
                <Checkout />
              </Suspense>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                <h2>Our Pricing Model</h2>
              </CardTitle>
              <CardDescription>Flexible pay-as-you-go credits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <Sparkles className="inline mr-2" /> Flex pay-as-you-go credits
                model
              </p>
              <p>
                <Gift className="inline mr-2" /> 6 free credits for new users
              </p>
              <p>
                <CreditCard className="inline mr-2" /> $1 for 10 credits
              </p>
              <p>
                <Rocket className="inline mr-2" /> Bonus 10 credits for every $5
                spent
              </p>
              <p>
                <ImageIcon className="inline mr-2" /> Image edit turbo model: 2
                credits per action
              </p>
              <p>
                <Zap className="inline mr-2" /> More exciting features coming
                soon!
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 w-full">
          <CardHeader>
            <CardTitle className="text-2xl">
              <h2>Why Choose Design0</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 mb-2" />}
              title="Flexibility"
              description="Pay only for what you use with our credit system."
            />
            <FeatureCard
              icon={<Gift className="h-8 w-8 mb-2" />}
              title="Free Start"
              description="Begin your journey with 6 free credits on sign-up."
            />
            <FeatureCard
              icon={<Rocket className="h-8 w-8 mb-2" />}
              title="Bonus Credits"
              description="Get extra credits with larger purchases."
            />
            <FeatureCard
              icon={<ImageIcon className="h-8 w-8 mb-2" />}
              title="Powerful Editing"
              description="Use our turbo model for advanced image editing."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 mb-2" />}
              title="Constant Innovation"
              description="New features and improvements added regularly."
            />
            <FeatureCard
              icon={<CreditCard className="h-8 w-8 mb-2" />}
              title="Affordable"
              description="Start with as little as $1 for 10 credits."
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3 className="flex items-center gap-2">
            {icon} <span>{title}</span>
          </h3>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
