import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";

export type Role = "ADMIN" | "STAFF" | "USER";
export const ROLES: Role[] = ["ADMIN", "STAFF", "USER"];

export type Permission =
  | "product:read"
  | "product:write"
  | "product:delete"
  | "user:manage";

const PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: ["product:read", "product:write", "product:delete", "user:manage"],
  STAFF: ["product:read", "product:write"],
  USER: ["product:read"],
};

// หน้าที่: ตรวจสอบค่าบทบาทผู้ใช้
export const isRole = (v: unknown): v is Role =>
  typeof v === "string" && (ROLES as string[]).includes(v);

// หน้าที่: ตรวจสอบสิทธิ์ตามบทบาท
export const can = (role: string | null | undefined, permission: Permission) =>
  isRole(role) && PERMISSIONS[role].includes(permission);

export type CurrentUser = {
  id: string;
  name: string | null | undefined;
  email: string;
  role: Role;
};

// หน้าที่: อ่านข้อมูลผู้ใช้ที่เข้าสู่ระบบ
/** ผู้ใช้ปัจจุบัน (null ถ้ายังไม่ล็อกอิน หรือบัญชีถูกลบแล้ว) */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  const u = session?.user;
  if (!u?.id || !isRole(u.role)) return null;
  return { id: u.id, name: u.name, email: u.email ?? "", role: u.role };
}

// หน้าที่: ตรวจสิทธิ์ก่อนเข้าหน้าหรือทำรายการ
/** ใช้ใน Server Component / Server Action — redirect ถ้าไม่มีสิทธิ์ */
export async function requirePermission(
  permission: Permission,
  callbackUrl = "/products",
): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  if (!can(user.role, permission)) redirect("/unauthorized");
  return user;
}

// หน้าที่: ตรวจสิทธิ์สำหรับ API และคืนข้อผิดพลาด
/** ใช้ใน Route Handler — คืน JSON 401/403 แทนการ redirect */
export async function apiGuard(
  permission: Permission,
): Promise<{ ok: true; user: CurrentUser } | { ok: false; response: NextResponse }> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 }),
    };
  }
  if (!can(user.role, permission)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "ไม่มีสิทธิ์ดำเนินการ" }, { status: 403 }),
    };
  }
  return { ok: true, user };
}
