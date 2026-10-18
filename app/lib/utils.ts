const thb = new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" });
const num = new Intl.NumberFormat("th-TH");

// หน้าที่: จัดรูปแบบจำนวนเงินเป็นเงินบาท
export const formatTHB = (n: number) => thb.format(n);
// หน้าที่: จัดรูปแบบตัวเลขให้อ่านง่าย
export const formatNumber = (n: number) => num.format(n);

// หน้าที่: ตรวจสอบเส้นทางก่อนเปลี่ยนหน้า
/** กัน open redirect: อนุญาตเฉพาะ path ภายในเว็บ */
export function safeRedirect(path: string | null | undefined, fallback = "/products") {
  if (path && path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/\\")) {
    return path;
  }
  return fallback;
}

// หน้าที่: อ่านรหัสข้อผิดพลาดจาก Prisma
export function prismaErrorCode(e: unknown): string | undefined {
  return typeof e === "object" && e !== null && "code" in e
    ? String((e as { code: unknown }).code)
    : undefined;
}

const dateFmt = new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeZone: "Asia/Bangkok" });

// หน้าที่: จัดรูปแบบวันที่สำหรับแสดงผล
export const formatDate = (d: Date) => dateFmt.format(d);
