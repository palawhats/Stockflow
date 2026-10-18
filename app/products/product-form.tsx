"use client";

import { useActionState } from "react";
import type { ProductFormState } from "@/app/lib/validation";
import { Icon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, inputClass, textareaClass } from "@/components/ui/Field";

export type ProductDefaults = {
  sku: string;
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  unit: string;
  isActive: boolean;
};

export const EMPTY_PRODUCT: ProductDefaults = {
  sku: "",
  name: "",
  description: "",
  category: "",
  price: "",
  stock: "0",
  unit: "ชิ้น",
  isActive: true,
};

// หน้าที่: แสดงฟอร์มเพิ่มหรือแก้ไขสินค้า
export default function ProductForm({
  action,
  defaults = EMPTY_PRODUCT,
  categories,
  submitLabel,
}: {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  defaults?: ProductDefaults;
  categories: string[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, {});
  const e = state.errors ?? {};
  const hasErrors = Object.values(e).some((m) => m && m.length > 0);
  // ถ้า validation ไม่ผ่าน ให้ใช้ค่าที่ผู้ใช้เพิ่งกรอก (React รีเซ็ตฟอร์มหลัง action)
  const v = state.values;
  // หน้าที่: เลือกค่าที่แสดงในช่องกรอกสินค้า
  const val = (k: keyof ProductDefaults) => (v ? (v[k] ?? "") : String(defaults[k]));
  const active = v ? v.isActive === "on" : defaults.isActive;

  return (
    <Card>
      <form action={formAction} className="space-y-5 p-5 sm:p-6" aria-busy={pending} noValidate>
        {hasErrors && (
          <p role="alert" className="flex items-start gap-2 rounded-lg bg-danger-soft p-3 text-sm text-danger-text">
            <Icon name="alertCircle" size={16} className="mt-0.5 shrink-0" />
            ข้อมูลบางช่องไม่ถูกต้อง กรุณาตรวจสอบและลองอีกครั้ง
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="รหัสสินค้า (SKU)" error={e.sku?.[0]}>
            {(c) => (
              <input {...c} name="sku" defaultValue={val("sku")} placeholder="เช่น ELEC-001" className={inputClass} disabled={pending} />
            )}
          </Field>
          <Field label="ชื่อสินค้า" error={e.name?.[0]}>
            {(c) => <input {...c} name="name" defaultValue={val("name")} className={inputClass} disabled={pending} />}
          </Field>
        </div>

        <Field label="รายละเอียด (ไม่บังคับ)" error={e.description?.[0]}>
          {(c) => (
            <textarea {...c} name="description" rows={3} defaultValue={val("description")} className={textareaClass} disabled={pending} />
          )}
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="หมวดหมู่" error={e.category?.[0]}>
            {(c) => (
              <>
                <input
                  {...c}
                  name="category"
                  list="category-list"
                  defaultValue={val("category")}
                  placeholder="เลือกหรือพิมพ์หมวดใหม่"
                  className={inputClass}
                  disabled={pending}
                />
                <datalist id="category-list">
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </>
            )}
          </Field>
          <Field label="หน่วยนับ" error={e.unit?.[0]}>
            {(c) => <input {...c} name="unit" defaultValue={val("unit")} className={inputClass} disabled={pending} />}
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="ราคา (บาท)" error={e.price?.[0]}>
            {(c) => (
              <input
                {...c}
                name="price"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                defaultValue={val("price")}
                className={inputClass}
                disabled={pending}
              />
            )}
          </Field>
          <Field label="จำนวนสต็อก" error={e.stock?.[0]}>
            {(c) => (
              <input
                {...c}
                name="stock"
                type="number"
                inputMode="numeric"
                step="1"
                min="0"
                defaultValue={val("stock")}
                className={inputClass}
                disabled={pending}
              />
            )}
          </Field>
        </div>

        <label className="flex min-h-10 items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={active}
            disabled={pending}
            className="size-4 rounded border-line accent-primary"
          />
          เปิดขายสินค้านี้
        </label>

        <div className="flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end">
          <ButtonLink href="/products" variant="secondary">
            ยกเลิก
          </ButtonLink>
          <Button type="submit" disabled={pending}>
            {pending ? "กำลังบันทึก..." : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
