import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";

import prisma from "@/app/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // หน้าที่: ตรวจสอบอีเมลและรหัสผ่าน
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).trim().toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });
        // บัญชี GitHub ไม่มี passwordHash จึงล็อกอินด้วยรหัสผ่านไม่ได้
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(String(credentials.password), user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    // สร้างผู้ใช้ในฐานข้อมูลให้บัญชี GitHub (role เริ่มต้น USER) เพื่อให้ ADMIN จัดการสิทธิ์ได้
    // หน้าที่: บันทึกบัญชี GitHub เมื่อเข้าสู่ระบบ
    async signIn({ user, account }) {
      if (account?.provider === "github") {
        if (!user.email) return false;
        const email = user.email.toLowerCase();
        await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email, name: user.name ?? null, role: "USER" },
        });
      }
      return true;
    },
    // หน้าที่: อัปเดตข้อมูลผู้ใช้และสิทธิ์ใน JWT
    async jwt({ token, user }) {
      if (user?.email) {
        // เพิ่งล็อกอิน: ดึง id/role จริงจากฐานข้อมูล
        const db = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
          select: { id: true, role: true },
        });
        token.id = db?.id;
        token.role = db?.role;
      } else if (token.id) {
        // ทุก request: sync role ล่าสุด ให้การเปลี่ยนสิทธิ์/ลบบัญชีมีผลทันที
        const db = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true },
        });
        token.role = db?.role;
      }
      return token;
    },
    // หน้าที่: ส่งข้อมูลผู้ใช้จาก JWT ไปยังเซสชัน
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = String(token.role ?? "");
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
});
