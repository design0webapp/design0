import { CommonNavbar } from "@/components/common-navbar";
import { Metadata } from "next";
import { getURL } from "@/lib/helpers";

export async function generateMetadata(): Promise<Metadata> {
  const url = getURL("/terms-of-service");
  return {
    alternates: {
      canonical: url,
    },
  };
}

export default async function TermsOfServicePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <CommonNavbar pageName={"Terms of Service"} />
      <iframe
        src="https://app.enzuzo.com/policies/tos/7f077ee0-9da4-11ef-9a09-cfa0436b8aa0"
        className="max-w-full min-h-screen"
      />
    </main>
  );
}
