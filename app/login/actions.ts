"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn } from "@/app/auth";
import { safeRedirect } from "@/app/lib/utils";

export type LoginState = { error?: string };

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1),
});

// หน้าที่: เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน
export async function loginWithCredentials(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "กรุณากรอกอีเมลและรหัสผ่านให้ถูกต้อง" };

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: safeRedirect(formData.get("callbackUrl")?.toString()),
    });
  } catch (e) {
    if (e instanceof AuthError) return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
    throw e; // redirect ของ Next.js ต้อง throw ต่อ
  }
  return {};
}

// หน้าที่: เข้าสู่ระบบผ่าน GitHub
export async function loginWithGithub(formData: FormData) {
  await signIn("github", {
    redirectTo: safeRedirect(formData.get("callbackUrl")?.toString()),
  });
}
