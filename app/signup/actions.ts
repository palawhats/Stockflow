"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { fieldErrors, signUpSchema, type FieldErrors } from "@/app/lib/validation";
import { prismaErrorCode } from "@/app/lib/utils";

export type SignUpState = { errors?: FieldErrors; values?: { name: string; email: string } };

// หน้าที่: ตรวจสอบข้อมูลและสมัครสมาชิก
export async function signUp(_prev: SignUpState, formData: FormData): Promise<SignUpState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };
  const values = { name: raw.name, email: raw.email };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const { name, email, password } = parsed.data;
  try {
    await prisma.user.create({
      data: { name, email, passwordHash: await bcrypt.hash(password, 12), role: "USER" },
    });
  } catch (e) {
    if (prismaErrorCode(e) === "P2002") {
      return { errors: { email: ["อีเมลนี้ถูกใช้งานแล้ว"] }, values };
    }
    throw e;
  }
  redirect("/login?registered=1");
}
