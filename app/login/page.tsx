import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/rbac";
import { safeRedirect } from "@/app/lib/utils";
import { AuthShell } from "@/components/auth/AuthShell";
import LoginForm from "./login-form";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

// หน้าที่: แสดงหน้าเข้าสู่ระบบ
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; registered?: string }>;
}) {
  const sp = await searchParams;
  const callbackUrl = safeRedirect(sp.callbackUrl);
  if (await getCurrentUser()) redirect(callbackUrl);

  return (
    <AuthShell>
      <LoginForm
        callbackUrl={callbackUrl}
        registered={Boolean(sp.registered)}
        githubEnabled={Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET)}
      />
    </AuthShell>
  );
}
