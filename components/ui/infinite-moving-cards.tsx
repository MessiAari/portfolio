"use client";
// Aceternity UI — Infinite Moving Cards (https://ui.aceternity.com/components/infinite-moving-cards)
// Adapted: a typographic ticker (words with separators) instead of quote cards,
// and the list is duplicated in React (instead of cloning DOM nodes) for a seamless loop.
import { cn } from "@/lib/utils";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
  itemClassName,
}: {
  items: string[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  itemClassName?: string;
}) => {
  const duration = speed === "fast" ? "30s" : speed === "normal" ? "60s" : "110s";

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={
        {
          "--animation-duration": duration,
          "--animation-direction": direction === "left" ? "forwards" : "reverse",
        } as React.CSSProperties
      }
    >
      <ul
        className={cn(
          "animate-scroll flex w-max min-w-full shrink-0 flex-nowrap gap-6",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {[...items, ...items].map((item, idx) => (
          <li
            key={item + idx}
            aria-hidden={idx >= items.length}
            className={cn("flex shrink-0 items-center gap-6 whitespace-nowrap", itemClassName)}
          >
            {item}
            <span className="text-[0.5em] text-accent">✱</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
