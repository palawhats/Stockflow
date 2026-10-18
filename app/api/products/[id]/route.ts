import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { apiGuard } from "@/app/lib/rbac";
import { fieldErrors, productSchema } from "@/app/lib/validation";
import { prismaErrorCode } from "@/app/lib/utils";

type Ctx = { params: Promise<{ id: string }> };

// หน้าที่: อ่านและตรวจสอบรหัสสินค้าจาก URL
async function parseId(ctx: Ctx) {
  const { id } = await ctx.params;
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// หน้าที่: สร้างคำตอบเมื่อรหัสสินค้าไม่ถูกต้อง
const badId = () => NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
// หน้าที่: สร้างคำตอบเมื่อไม่พบสินค้า
const notFound = () => NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });

// GET /api/products/:id
// หน้าที่: ดึงรายละเอียดสินค้าตามรหัส
export async function GET(_req: NextRequest, ctx: Ctx) {
  const guard = await apiGuard("product:read");
  if (!guard.ok) return guard.response;
  const id = await parseId(ctx);
  if (!id) return badId();

  const product = await prisma.product.findUnique({ where: { id } });
  return product ? NextResponse.json({ data: product }) : notFound();
}

// PUT /api/products/:id  (ส่งข้อมูลครบทุกฟิลด์)
// หน้าที่: แก้ไขข้อมูลสินค้าตามรหัส
export async function PUT(req: NextRequest, ctx: Ctx) {
  const guard = await apiGuard("product:write");
  if (!guard.ok) return guard.response;
  const id = await parseId(ctx);
  if (!id) return badId();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON ไม่ถูกต้อง" }, { status: 400 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "ข้อมูลไม่ถูกต้อง", errors: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  try {
    const product = await prisma.product.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ data: product });
  } catch (e) {
    const code = prismaErrorCode(e);
    if (code === "P2025") return notFound();
    if (code === "P2002") {
      return NextResponse.json({ error: "รหัสสินค้านี้ถูกใช้แล้ว" }, { status: 409 });
    }
    throw e;
  }
}

// DELETE /api/products/:id  (เฉพาะ ADMIN)
// หน้าที่: ลบสินค้าตามรหัส
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const guard = await apiGuard("product:delete");
  if (!guard.ok) return guard.response;
  const id = await parseId(ctx);
  if (!id) return badId();

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    if (prismaErrorCode(e) === "P2025") return notFound();
    throw e;
  }
}
