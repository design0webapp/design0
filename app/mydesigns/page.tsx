import { CommonNavbar } from "@/components/common-navbar";

export default async function MyDesignsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <CommonNavbar pageName={"My Designs"} />
      <div className="flex items-center justify-center flex-1">
        <p className="text-2xl font-semibold text-gray-600">
          Oops, Still Working... Coming Soon
        </p>
      </div>
    </main>
  );
}
