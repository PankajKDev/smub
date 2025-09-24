import Navbar from "@/components/shared/Navbar";
import { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col min-h-screen ">{children}</div>
    </>
  );
}

export default layout;
