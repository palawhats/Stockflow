"use server";

import { signOut } from "@/app/auth";

// หน้าที่: ออกจากระบบและกลับหน้าเข้าสู่ระบบ
/** ออกจากระบบ (พฤติกรรมเดิมของ Header: ล้าง session แล้วกลับหน้าแรก) */
export async function logout() {
  await signOut({ redirectTo: "/" });
}
