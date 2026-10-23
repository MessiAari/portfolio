"use client";
// Aceternity UI — Floating Navbar (https://ui.aceternity.com/components/floating-navbar)
// Adapted: a full-width ruled bar instead of a glass pill. It hides while you
// scroll down and slides back when you scroll up; the CTA slot holds the theme toggle.
import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  brand,
  navItems,
  action,
  className,
}: {
  brand: React.ReactNode;
  navItems: { name: string; link: string; hideOnMobile?: boolean }[];
  action?: React.ReactNode;
  className?: string;
}) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setAtTop(current < 40);
    if (current < 120) setVisible(true);
    else setVisible(current < previous);
  });

  return (
    <motion.nav
      aria-label="Main"
      initial={{ y: -80 }}
      animate={{ y: visible ? 0 : -80 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 top-0 z-[5000] border-b transition-colors duration-300",
        atTop ? "border-transparent" : "border-border bg-background/90 backdrop-blur-sm",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 md:h-16 md:px-6">
        <a href="#home" className="font-mono text-sm font-medium tracking-tight whitespace-nowrap md:text-base">
          {brand}
        </a>
        <div className="flex items-center gap-3 sm:gap-6">
          <ul className="flex items-center gap-3 text-[13px] sm:gap-6 sm:text-sm">
            {navItems.map((item) => (
              <li key={item.link} className={cn(item.hideOnMobile && "hidden sm:block")}>
                <a
                  href={item.link}
                  className="text-foreground/70 transition-colors hover:text-accent"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          {action}
        </div>
      </div>
    </motion.nav>
  );
};
