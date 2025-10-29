import React from "react";
import { UserButton } from "@clerk/clerk-react";
export const Header = () => {
  return (
    <>
      <header className="sticky top-0 z-50 w-full px-6 py-4 bg-pink-100 border-b shadow-sm flex justify-between">
        <h1 className="text-2xl font-serif italic text-pink-600 tracking-wide">
          MyCutu 💖
        </h1>
        <UserButton afterSignOutUrl="/" />
      </header>
    </>
  );
};
