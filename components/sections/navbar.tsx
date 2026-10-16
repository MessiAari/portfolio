"use client";

import { IconCode, IconHome, IconMail, IconSparkles, IconUser } from "@tabler/icons-react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { navItems } from "@/lib/portfolio-data";

const icons: Record<string, React.ReactNode> = {
  Home: <IconHome className="h-5 w-5" />,
  About: <IconUser className="h-5 w-5" />,
  Skills: <IconSparkles className="h-5 w-5" />,
  Projects: <IconCode className="h-5 w-5" />,
  Contact: <IconMail className="h-5 w-5" />,
};

export function Navbar() {
  return (
    <FloatingNav
      navItems={navItems.map((item) => ({ ...item, icon: icons[item.name] }))}
      action={<ThemeToggleButton className="h-9 w-9" />}
    />
  );
}
