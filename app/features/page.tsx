import { CommonNavbar } from "@/components/common-navbar";
import { CreditCard, Smile, Target, Type, Wand2, Zap } from "lucide-react";
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
import { Metadata } from "next";
import { getURL } from "@/lib/helpers";

export async function generateMetadata(): Promise<Metadata> {
  const url = getURL("/features");
  return {
    title: "Features - Design0",
    description:
      "Discover Design0's powerful AI-powered image editing features.",
    alternates: {
      canonical: url,
    },
  };
}

async function StepCard({
  image,
  title,
  description,
  emoji,
}: {
  image: string;
  title: string;
  description: string;
  emoji: string;
}) {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>
          <h3>
            {title} {emoji}
          </h3>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          className="w-full"
        />
      </CardContent>
    </Card>
  );
}

async function HowToSection() {
  return (
    <section className="px-2 py-8 md:py-16 mx-auto w-[64rem] max-w-full">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8">
        How to Use Design0 🚀
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StepCard
          image="/features/features-1.webp"
          title="Search & Choose"
          description="Search for an image and select the perfect one for editing"
          emoji="🔍"
        />
        <StepCard
          image="/features/features-2.webp"
          title="Mask Edit Area"
          description="Click and drag to mask the area you want to edit"
          emoji="🖱️"
        />
        <StepCard
          image="/features/features-3.webp"
          title="Write Prompt"
          description="Describe what you want to edit in the masked area"
          emoji="✏️"
        />
        <StepCard
          image="/features/features-4.webp"
          title="Get Results"
          description="Wait for the magic to happen and see your edited image"
          emoji="✨"
        />
      </div>
    </section>
  );
}

async function WhatIsSection() {
  return (
    <section className="py-8 md:py-16 mx-auto w-[64rem] max-w-full">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8">
        What is Design0 🤔
      </h2>
      <p className="px-2 text-gray-700 mt-2 text-justify">
        As a non-professional designer, I frequently need to edit images for
        posters and covers, which can be time-consuming. Finding images that
        match my requirements is challenging, and adding visually appealing
        text—beyond just using basic fonts—is particularly difficult. 🤕
      </p>
      <p className="px-2 text-gray-700 mt-2 text-justify">
        After multiple attempts at learning professional design software, I
        decided to build a tool for myself. 🎉
      </p>
    </section>
  );
}

async function HowToWorkSection() {
  return (
    <section className="px-2 py-8 md:py-16 mx-auto w-[64rem] max-w-full">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8">
        How Does Design0 Work ⚙️
      </h2>
      <p className="px-2  text-gray-700 mt-2 text-justify">
        Design0 integrates with{" "}
        <Link
          href="https://unsplash.com"
          rel="nofollow"
          className="underline"
          target="_blank"
        >
          Unsplash
        </Link>
        , a platform offering a vast collection of free, high-resolution
        photographs. It is a go-to resource for creatives who need quality
        images for websites, presentations, social media, and design projects.
      </p>
      <Image
        src={"/features/unsplash.webp"}
        alt={"Unsplash introduction "}
        width={800}
        height={439}
        className="mx-auto my-8 md:w-2/3 rounded-lg shadow-md"
      />
      <p className="px-2  text-gray-700 mt-2 text-justify">
        Design0 goes beyond basic photo editing by offering advanced
        capabilities. Users can edit specific areas of images with precision,
        especially when it comes to creating stylized text effects. Through our
        integration with{" "}
        <Link
          href="https://ideogram.ai/"
          rel="nofollow"
          className="underline"
          target="_blank"
        >
          Ideogram
        </Link>
        , an innovative AI image generator, users can create text designs that
        transcend conventional font limitations.
      </p>
    </section>
  );
}

async function AchieveCard({
  title,
  prompt,
  image1,
  image2,
}: {
  title: string;
  prompt: string;
  image1: string;
  image2: string;
}) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <b>Prompt:</b> {prompt}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Image
            src={image1}
            alt={`image before '${prompt}'`}
            width={400}
            height={400}
            className="w-full rounded-lg shadow-md"
          />
          <Image
            src={image2}
            alt={`image after '${prompt}'`}
            width={400}
            height={400}
            className="w-full rounded-lg shadow-md"
          />
        </div>
      </CardContent>
    </Card>
  );
}

async function WhatCanAchieveSection() {
  return (
    <section className="px-2 py-8 md:py-16 mx-auto w-[64rem] max-w-full">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8">
        What Can You Achieve with Design0 🎯
      </h2>
      <p className="px-2  text-gray-700 mt-2 text-justify">
        Whether you are working on social media content, marketing materials, or
        personal projects, Design0 provides the tools you need to bring your
        creative vision to life.
      </p>
      <h3 className="text-2xl md:text-3xl font-semibold text-center mt-8">
        Modify Images Your Way
      </h3>
      <AchieveCard
        title={"You can add custom elements based on your description"}
        prompt={"add another bull is fighting"}
        image1={"/features/add-elements-1.webp"}
        image2={"/features/add-elements-2.webp"}
      />
      <AchieveCard
        title={
          "You can also transform existing elements in an image using prompts."
        }
        prompt={"change to house"}
        image1={"/features/change-elements-1.webp"}
        image2={"/features/change-elements-2.webp"}
      />
      <h3 className="text-2xl md:text-3xl font-semibold text-center mt-8">
        Add Amazing Text to Images
      </h3>
      <AchieveCard
        title={
          "You can add sophisticated, visually appealing text limited only by your imagination."
        }
        prompt={
          "add title with plant and flower: 'Planting Guide' in real style"
        }
        image1={"/features/add-text-1.webp"}
        image2={"/features/add-text-2.webp"}
      />
      <AchieveCard
        title={
          "You can even create objects with custom text rendered onto them."
        }
        prompt={"add a flying balloon with text: 'Hope'"}
        image1={"/features/object-with-text-1.webp"}
        image2={"/features/object-with-text-2.webp"}
      />
    </section>
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
      <CardHeader className="flex flex-row items-center">
        {icon}
        <CardTitle className="text-xl font-semibold ml-2">
          <h3>{title}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

async function FeaturesSection() {
  return (
    <section className="px-2 py-8 md:py-16 mx-auto w-[64rem] max-w-full">
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
  );
}

export default async function FeaturesPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <CommonNavbar pageName={"Features"} />
      <section className="px-2 py-10 sm:py-12 md:py-16 xl:py-20 text-center bg-neutral-100">
        <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold tracking-tighter">
          Design0 🎨
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-neutral-600 font-light">
          Effortless Image Editor for Everyone
        </p>
        <Button variant="outline" asChild className="mt-8 animate-bounce">
          <Link href={"/"}>Try Design0 Now!</Link>
        </Button>
      </section>

      <HowToSection />
      <Separator />
      <WhatIsSection />
      <Separator />
      <WhatCanAchieveSection />
      <Separator />
      <HowToWorkSection />
      <Separator />
      <FeaturesSection />

      <section className="py-4 md:py-8 text-center">
        <Button size="lg" asChild>
          <Link href={"/"}>Try Design0 Now!</Link>
        </Button>
      </section>

      <section className="py-12"></section>
    </main>
  );
}
