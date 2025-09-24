"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Home, BookOpen, Dumbbell, CreditCard, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { authLinks } from "@/constants";

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Recipe", href: "/recipe", icon: BookOpen },
  { name: "Workout", href: "/workout", icon: Dumbbell },
];

export function MobileNavigation() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const user = useUser();

  if (!isMobile) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-accent/20 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b border-border">
            <SheetTitle className="text-left">
              <span className="text-2xl font-bold text-primary">IngredAI</span>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              <SignedIn>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-accent/10",
                          isActive
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                        {item.name}
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-secondary rounded-full animate-pulse" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </SignedIn>
              <SignedOut>
                {authLinks.map((item) => {
                  const isActive = pathname === item.linkname;

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.linkname}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-accent/10",
                          isActive
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </SignedOut>
            </ul>
          </nav>
          <SignedIn>
            <div className="p-6 border-t border-border">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                <div className="w-10 bg-background h-10  rounded-full flex items-center justify-center">
                  <UserButton />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {user.user?.fullName}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      Premium Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SignedIn>
        </div>
      </SheetContent>
    </Sheet>
  );
}
