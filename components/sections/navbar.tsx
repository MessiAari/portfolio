"use client";

import { FloatingNav } from "@/components/ui/floating-navbar";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { navItems, profile } from "@/lib/portfolio-data";

export function Navbar() {
  return (
    <FloatingNav
      brand={
        <>
          <span className="sm:hidden">A.K.</span>
          <span className="hidden sm:inline">{profile.name}</span>
        </>
      }
      // "Home" is the brand link on phones, so it only shows as text on wider screens.
      navItems={navItems.map((item) => ({ ...item, hideOnMobile: item.name === "Home" }))}
      action={<ThemeToggleButton className="h-8 w-8 p-1.5" />}
    />
  );
}
