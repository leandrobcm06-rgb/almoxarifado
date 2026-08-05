import { cn } from "@/lib/utils";

type SkeletonProps = {
  variant?: "rectangular" | "circular" | "text";
  width?: string | number;
  height?: string | number;
  className?: string;
};

export default function Skeleton({ variant = "rectangular", width, height, className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        variant === "circular" ? "rounded-full" : "rounded-md",
        className
      )}
      style={{ width, height }}
    />
  );
}
