import { CommonNavbar } from "@/components/common-navbar";
import {
  Clock,
  CreditCard,
  Edit,
  MousePointer,
  Search,
  Smile,
  Target,
  Type,
  Wand2,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

async function StepCard({
  icon,
  image,
  title,
  description,
  emoji,
}: {
  icon: React.ReactNode;
  image: string;
  title: string;
  description: string;
  emoji: string;
}) {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">{icon}</div>
        <CardTitle className="text-xl font-semibold mb-2">
          {title} {emoji}
        </CardTitle>
        <CardDescription className="text-gray-600 mb-4">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          className="mx-auto"
        />
      </CardContent>
    </Card>
  );
}

async function FeatureCard({
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
        <div className="flex items-center mb-4">
          {icon}
          <h3 className="text-xl font-semibold ml-2">{title}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

export default async function FeaturesPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <CommonNavbar pageName={"Features"} />
      <section className="px-2 py-10 sm:py-12 md:py-16 xl:py-20 text-center bg-neutral-100">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">design0 🎨✨</h1>
        <p className="text-xl md:text-2xl">Effortless Design for Everyone.</p>
        <Button asChild={true} className="mt-6">
          <Link href={"/"}>Try design0 Now! 🚀</Link>
        </Button>
      </section>

      <section className="py-4 md:py-8 mx-auto w-[64rem] max-w-full">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8">
          How to Use design0 🚀
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StepCard
            icon={<Search className="w-8 h-8" />}
            image="/features/features-1.webp"
            title="Search & Choose"
            description="Search for an image and select the perfect one for editing"
            emoji="🔍"
          />
          <StepCard
            icon={<MousePointer className="w-8 h-8" />}
            image="/features/features-2.webp"
            title="Mask Edit Area"
            description="Click and drag to mask the area you want to edit"
            emoji="🖱️"
          />
          <StepCard
            icon={<Edit className="w-8 h-8" />}
            image="/features/features-3.webp"
            title="Write Prompt"
            description="Describe what you want to edit in the masked area"
            emoji="✏️"
          />
          <StepCard
            icon={<Clock className="w-8 h-8" />}
            image="/features/features-4.webp"
            title="Get Results"
            description="Wait for the magic to happen and see your edited image"
            emoji="✨"
          />
        </div>
      </section>

      <Separator className={"my-8"} />

      <section className="py-4 md:py-8 mx-auto w-[64rem] max-w-full">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8">
          Key Features 🌟
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-yellow-500" />}
            title="Powerful Image Search"
            description="Find the perfect image to start your creative journey"
          />
          <FeatureCard
            icon={<Target className="w-8 h-8 text-red-500" />}
            title="Precise Masked Editing"
            description="Edit only the areas you want, leaving the rest untouched"
          />
          <FeatureCard
            icon={<Wand2 className="w-8 h-8 text-blue-500" />}
            title="Intelligent Prompt Editing"
            description="Our AI understands and executes your editing instructions perfectly"
          />
          <FeatureCard
            icon={<Smile className="w-8 h-8 text-orange-500" />}
            title="User-Friendly Interface"
            description="Intuitive design for seamless and enjoyable editing experience"
          />
          <FeatureCard
            icon={<Type className="w-8 h-8 text-green-500" />}
            title="Perfect Text Rendering"
            description="Add or edit text with precision and style"
          />
          <FeatureCard
            icon={<CreditCard className="w-8 h-8 text-purple-500" />}
            title="Pay-as-you-go"
            description="Only pay for what you use, no subscription required"
          />
        </div>
      </section>

      <section className="py-4 md:py-8 text-center">
        <Button size="lg" asChild={true}>
          <Link href={"/"}>Try design0 Now! 🚀</Link>
        </Button>
      </section>

      <section className="py-12"></section>
    </main>
  );
}
