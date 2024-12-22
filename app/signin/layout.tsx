import { Metadata } from "next";
import { getURL } from "@/lib/helpers";

export async function generateMetadata(): Promise<Metadata> {
  const url = getURL("/signin");
  return {
    title: "Sign In - Design0",
    description: "Sign In to Design0.",
    alternates: {
      canonical: url,
    },
  };
}

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
