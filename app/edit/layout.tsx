import { Metadata } from "next";
import { getURL } from "@/lib/helpers";

export async function generateMetadata(): Promise<Metadata> {
  const url = getURL("/edit");
  return {
    title: "Edit - Design0",
    description: "Edit your design.",
    alternates: {
      canonical: url,
    },
  };
}

export default function EditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
