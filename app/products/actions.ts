"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/app/lib/prisma";
import { requirePermission } from "@/app/lib/rbac";
import {
  fieldErrors,
  formToValues,
  parseProductForm,
  type ProductFormState,
} from "@/app/lib/validation";
import { prismaErrorCode } from "@/app/lib/utils";

const DUPLICATE_SKU = "รหัสสินค้านี้ถูกใช้แล้ว";

// หน้าที่: ตรวจสอบและบันทึกสินค้าใหม่
export async function createProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const user = await requirePermission("product:write", "/products/new");
  const values = formToValues(formData);
  const parsed = parseProductForm(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  try {
    await prisma.product.create({ data: { ...parsed.data, createdById: user.id } });
  } catch (e) {
    if (prismaErrorCode(e) === "P2002") return { errors: { sku: [DUPLICATE_SKU] }, values };
    throw e;
  }
  revalidatePath("/products");
  revalidatePath("/admin");
  redirect("/products?saved=created");
}

// หน้าที่: ตรวจสอบและแก้ไขข้อมูลสินค้า
export async function updateProduct(
  id: number,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requirePermission("product:write", `/products/${id}/edit`);
  const values = formToValues(formData);
  const parsed = parseProductForm(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  try {
    await prisma.product.update({ where: { id }, data: parsed.data });
  } catch (e) {
    const code = prismaErrorCode(e);
    if (code === "P2002") return { errors: { sku: [DUPLICATE_SKU] }, values };
    if (code === "P2025") redirect("/products");
    throw e;
  }
  revalidatePath("/products");
  revalidatePath("/admin");
  redirect("/products?saved=updated");
}

// หน้าที่: ลบสินค้าโดยตรวจสิทธิ์ผู้ใช้
export async function deleteProduct(id: number) {
  await requirePermission("product:delete");
  try {
    await prisma.product.delete({ where: { id } });
  } catch (e) {
    if (prismaErrorCode(e) !== "P2025") throw e; // ถูกลบไปแล้ว — ไม่ต้องทำอะไร
  }
  revalidatePath("/products");
  revalidatePath("/admin");
  redirect("/products?saved=deleted");
}
