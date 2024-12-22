import { CommonNavbar } from "@/components/common-navbar";
import { Metadata } from "next";
import { getURL } from "@/lib/helpers";

export async function generateMetadata(): Promise<Metadata> {
  const url = getURL("/privacy-policy");
  return {
    title: "Privacy Policy - Design0",
    description: "Privacy Policy for Design0.",
    alternates: {
      canonical: url,
    },
  };
}

export default async function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <CommonNavbar pageName={"Terms of Service"} />
      <iframe
        src="https://app.enzuzo.com/policies/privacy/7f077ee0-9da4-11ef-9a09-cfa0436b8aa0"
        className="max-w-full min-h-screen"
      />
    </main>
  );
}
