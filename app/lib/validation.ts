import { z } from "zod";

// หน้าที่: แปลงค่าว่างเป็น undefined
const emptyToUndefined = (v: unknown) =>
  v === "" || v === null || v === undefined ? undefined : v;

export const productSchema = z.object({
  sku: z
    .string({ error: "กรุณากรอกรหัสสินค้า" })
    .trim()
    .min(1, "กรุณากรอกรหัสสินค้า")
    .max(30, "รหัสสินค้าต้องไม่เกิน 30 ตัวอักษร")
    .regex(/^[A-Za-z0-9._-]+$/, "ใช้ได้เฉพาะ A-Z, 0-9, จุด, ขีดกลาง และขีดล่าง")
    .transform((s) => s.toUpperCase()),
  name: z
    .string({ error: "กรุณากรอกชื่อสินค้า" })
    .trim()
    .min(1, "กรุณากรอกชื่อสินค้า")
    .max(120, "ชื่อสินค้าต้องไม่เกิน 120 ตัวอักษร"),
  description: z
    .string()
    .trim()
    .max(1000, "รายละเอียดต้องไม่เกิน 1,000 ตัวอักษร")
    .nullish()
    .transform((v) => (v ? v : null)),
  category: z
    .string({ error: "กรุณากรอกหมวดหมู่" })
    .trim()
    .min(1, "กรุณากรอกหมวดหมู่")
    .max(50, "หมวดหมู่ต้องไม่เกิน 50 ตัวอักษร"),
  price: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ error: "กรุณากรอกราคาเป็นตัวเลข" })
      .min(0, "ราคาต้องไม่ติดลบ")
      .max(10_000_000, "ราคาต้องไม่เกิน 10,000,000")
      .transform((n) => Math.round(n * 100) / 100),
  ),
  stock: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ error: "กรุณากรอกจำนวนสต็อกเป็นตัวเลข" })
      .int("จำนวนสต็อกต้องเป็นจำนวนเต็ม")
      .min(0, "จำนวนสต็อกต้องไม่ติดลบ")
      .max(1_000_000, "จำนวนสต็อกต้องไม่เกิน 1,000,000"),
  ),
  unit: z
    .string()
    .trim()
    .min(1, "กรุณากรอกหน่วยนับ")
    .max(20, "หน่วยนับต้องไม่เกิน 20 ตัวอักษร")
    .default("ชิ้น"),
  isActive: z.boolean().default(true),
});

export type ProductInput = z.output<typeof productSchema>;

export type FieldErrors = Record<string, string[] | undefined>;

export type ProductFormState = {
  errors?: FieldErrors;
  /** ค่าที่ผู้ใช้กรอก — ใช้เติมกลับเข้าฟอร์มเมื่อ validation ไม่ผ่าน */
  values?: Record<string, string>;
};

// หน้าที่: แยกข้อความข้อผิดพลาดตามช่องข้อมูล
export const fieldErrors = (error: z.ZodError): FieldErrors =>
  z.flattenError(error).fieldErrors as FieldErrors;

const TEXT_FIELDS = ["sku", "name", "description", "category", "price", "stock", "unit"] as const;

// หน้าที่: อ่านค่าฟอร์มสินค้าเป็นข้อความ
/** FormData -> ค่าข้อความของแต่ละช่อง (+ isActive เป็น "on" | "") */
export function formToValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const key of TEXT_FIELDS) values[key] = String(formData.get(key) ?? "");
  values.isActive = formData.get("isActive") === "on" ? "on" : "";
  return values;
}

// หน้าที่: ตรวจสอบข้อมูลสินค้าในฟอร์ม
export const parseProductForm = (values: Record<string, string>) =>
  productSchema.safeParse({ ...values, isActive: values.isActive === "on" });

export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, "กรุณากรอกชื่อ").max(80, "ชื่อต้องไม่เกิน 80 ตัวอักษร"),
    email: z.string().trim().toLowerCase().pipe(z.email("รูปแบบอีเมลไม่ถูกต้อง")),
    password: z
      .string()
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      .max(72, "รหัสผ่านต้องไม่เกิน 72 ตัวอักษร")
      .regex(/[A-Za-z]/, "รหัสผ่านต้องมีตัวอักษรอย่างน้อย 1 ตัว")
      .regex(/[0-9]/, "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "รหัสผ่านไม่ตรงกัน",
  });
