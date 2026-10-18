// หน้าที่: รวมชื่อคลาส CSS ที่ใช้งานได้
/** รวมชื่อคลาส โดยข้ามค่าที่ไม่จริง */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
