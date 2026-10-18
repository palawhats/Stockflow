import { cn } from "@/components/lib/cn";

// หน้าที่: แสดงองค์ประกอบระหว่างรอโหลด
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-md bg-line/70", className)} />;
}
