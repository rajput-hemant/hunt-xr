import Link from "next/link";

import { Bitcoin } from "lucide-react";

import Button from "../ui/button";
import { Header } from "./header";

export function Navbar() {
  return (
    <Header>
      <div className="relative flex w-full items-center justify-between rounded-full py-2">
        <div className="flex w-full items-center gap-2">
          <div className="flex aspect-square size-14 items-center justify-center rounded-full border border-foreground">
            <Bitcoin className="size-8" />
          </div>

          <Link
            href="/"
            className="text-lg font-semibold sm:text-xl md:text-2xl"
          >
            Hunt XR
          </Link>
        </div>

        <nav className="hidden w-full items-center justify-end gap-2 md:flex">
          <Button href="/login" round size="lg">
            <span>Login</span>
          </Button>
        </nav>
      </div>
    </Header>
  );
}
