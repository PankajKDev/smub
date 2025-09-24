"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { authLinks, navLinks } from "@/constants";

export function DesktopNavigation() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <div className="hidden md:flex items-center space-x-8">
      <SignedIn>
        {navLinks.map((item) => {
          const isActive = pathname === item.linkname;

          return (
            <Link
              key={item.name}
              href={item.linkname}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground relative",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {item.name}
              {isActive && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-secondary rounded-full" />
              )}
            </Link>
          );
        })}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <UserButton />
          </div>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
            Premium Active
          </span>
        </div>
      </SignedIn>
      <SignedOut>
        {authLinks.map((item) => (
          <Link
            key={item.name}
            href={item.linkname}
            className="text-sm font-medium transition-colors hover:text-foreground relative"
          >
            {item.name}
          </Link>
        ))}
      </SignedOut>
    </div>
  );
}
