import Link from "next/link";
import { Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export async function Footer() {
  return (
    <footer className="bg-muted">
      <div className="container px-4 py-8 md:py-12 text-muted-foreground">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Palette className="h-6 w-6" />
              <span className="text-lg font-semibold text-foreground">
                Design0
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Design with no pain. Create beautiful designs effortlessly.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/features"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© 2024 Design0. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Button variant="ghost" size="sm" asChild>
              <Link href="https://twitter.com/design0">Twitter</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="https://instagram.com/design0">Github</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
