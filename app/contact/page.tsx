import { CommonNavbar } from "@/components/common-navbar";
import { Metadata } from "next";
import { getURL } from "@/lib/helpers";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const url = getURL("/contact");
  return {
    alternates: {
      canonical: url,
    },
  };
}

export default async function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <CommonNavbar pageName={"Contact"} />
      <div className="flex-1 flex items-center justify-center">
        <Card className="max-w-2xl mx-4">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <CardTitle>Contact Us</CardTitle>
            </div>
            <CardDescription className="text-base">
              You can reach out to us at:{" "}
              <a
                href="mailto:design0webapp@gmail.com"
                className="text-primary hover:underline"
              >
                design0webapp@gmail.com
              </a>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
