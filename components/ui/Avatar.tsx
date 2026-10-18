import { cn } from "@/components/lib/cn";

// หน้าที่: เลือกอักษรย่อสำหรับรูปโปรไฟล์
export function initialOf(name: string | null | undefined, email?: string): string {
  const source = (name?.trim() || email?.trim() || "?").normalize("NFC");
  return (Array.from(source)[0] ?? "?").toUpperCase();
}

// หน้าที่: แสดงรูปโปรไฟล์แบบตัวอักษร
export function Avatar({
  name,
  email,
  size = 36,
  className,
}: {
  name: string | null | undefined;
  email?: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary-text",
        className,
      )}
    >
      {initialOf(name, email)}
    </span>
  );
}
