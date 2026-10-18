import { Badge, type BadgeTone } from "@/components/ui/Badge";

const TONE: Record<string, BadgeTone> = {
  ADMIN: "primary", // Indigo
  STAFF: "teal",
  USER: "neutral", // Slate
};

// หน้าที่: แสดงป้ายบทบาทผู้ใช้
export function RoleBadge({ role }: { role: string }) {
  return <Badge tone={TONE[role] ?? "neutral"}>{role}</Badge>;
}
