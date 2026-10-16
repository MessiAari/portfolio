"use client";
// Aceternity UI — Infinite Moving Cards (https://ui.aceternity.com/components/infinite-moving-cards)
// Adapted: renders skill chips instead of quotes, and duplicates the list in
// React (instead of cloning DOM nodes) so the loop is seamless.
import { cn } from "@/lib/utils";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: {
  items: string[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const duration = speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";

  return (
    <div
      className={cn(
        "relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]",
        className,
      )}
      style={
        {
          "--animation-duration": duration,
          "--animation-direction": direction === "left" ? "forwards" : "reverse",
        } as React.CSSProperties
      }
    >
      <ul
        className={cn(
          "animate-scroll flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-2",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {[...items, ...items].map((item, idx) => (
          <li
            key={item + idx}
            aria-hidden={idx >= items.length}
            className="shrink-0 rounded-full border border-border bg-card px-5 py-2.5 font-mono text-sm whitespace-nowrap text-foreground/80 shadow-sm"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
