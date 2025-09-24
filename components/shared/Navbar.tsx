import React from "react";
import { MobileNavigation } from "../ui/MobileNavigation";
import { DesktopNavigation } from "../ui/DesktopNavigation";

function Navbar() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <MobileNavigation />
            <h1 className="text-lg font-bold text-primary">
              Smart academic hub
            </h1>
          </div>
          <DesktopNavigation />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
