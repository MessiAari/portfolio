"use client";
// Aceternity UI — Floating Navbar (https://ui.aceternity.com/components/floating-navbar)
// Adapted: visible at the top of the page, hides while scrolling down, comes back
// when scrolling up; the CTA slot holds the theme toggle; icons on mobile.
import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems,
  action,
  className,
}: {
  navItems: { name: string; link: string; icon?: React.ReactNode }[];
  action?: React.ReactNode;
  className?: string;
}) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (current < 120) setVisible(true);
    else setVisible(current < previous);
  });

  return (
    <motion.nav
      aria-label="Main"
      initial={{ opacity: 0, y: -100 }}
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "fixed inset-x-0 top-4 z-[5000] mx-auto flex max-w-fit items-center justify-center",
        className,
      )}
    >
      <div className="flex items-center justify-center gap-1 rounded-full border border-border bg-background/70 px-2 py-1.5 shadow-lg shadow-black/10 backdrop-blur-md sm:gap-2">
        <a
          href="#home"
          className="hidden rounded-full px-3 py-2 font-serif text-lg italic text-foreground md:block"
        >
          Aari
        </a>
        <div className="flex items-center gap-0.5 sm:gap-1">
          {navItems.map((navItem) => (
            <a
              key={navItem.link}
              href={navItem.link}
              aria-label={navItem.name}
              className="relative flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-foreground/5 hover:text-foreground sm:px-4"
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block">{navItem.name}</span>
            </a>
          ))}
        </div>
        <div className="h-5 w-px bg-border" />
        {action}
      </div>
    </motion.nav>
  );
};
