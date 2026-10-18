import prisma from "@/app/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";

export const LOW_STOCK_THRESHOLD = 10;
export const DEFAULT_PAGE_SIZE = 10;

export const SORT_OPTIONS = {
  newest: { label: "ใหม่ล่าสุด", orderBy: [{ createdAt: "desc" }, { id: "desc" }] },
  name_asc: { label: "ชื่อ A → Z", orderBy: [{ name: "asc" }] },
  price_asc: { label: "ราคา ต่ำ → สูง", orderBy: [{ price: "asc" }] },
  price_desc: { label: "ราคา สูง → ต่ำ", orderBy: [{ price: "desc" }] },
  stock_asc: { label: "สต็อก น้อย → มาก", orderBy: [{ stock: "asc" }] },
  stock_desc: { label: "สต็อก มาก → น้อย", orderBy: [{ stock: "desc" }] },
} satisfies Record<string, { label: string; orderBy: Prisma.ProductOrderByWithRelationInput[] }>;

export type SortKey = keyof typeof SORT_OPTIONS;
export type StatusFilter = "all" | "active" | "inactive";
export type StockFilter = "all" | "low" | "out";

export type ProductQuery = {
  q: string;
  category: string;
  status: StatusFilter;
  stock: StockFilter;
  sort: SortKey;
  page: number;
  pageSize: number;
};

// หน้าที่: แปลงพารามิเตอร์ค้นหาเป็นตัวเลือกกรอง
/** อ่านพารามิเตอร์ค้นหา/กรอง (ใช้ร่วมกันทั้งหน้าเว็บและ API) พร้อม allow-list ค่าที่ยอมรับ */
export function parseProductQuery(
  get: (key: string) => string | null | undefined,
): ProductQuery {
  const status = get("status");
  const stock = get("stock");
  const sort = get("sort");
  const page = Number.parseInt(get("page") ?? "", 10);
  const pageSize = Number.parseInt(get("pageSize") ?? "", 10);
  return {
    q: (get("q") ?? "").trim().slice(0, 100),
    category: (get("category") ?? "").trim().slice(0, 50),
    status: status === "active" || status === "inactive" ? status : "all",
    stock: stock === "low" || stock === "out" ? stock : "all",
    sort: sort && sort in SORT_OPTIONS ? (sort as SortKey) : "newest",
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize:
      Number.isFinite(pageSize) && pageSize > 0 ? Math.min(pageSize, 100) : DEFAULT_PAGE_SIZE,
  };
}

// หน้าที่: สร้างเงื่อนไขค้นหาสินค้าในฐานข้อมูล
function buildWhere(q: ProductQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};
  if (q.q) {
    // SQLite: LIKE ไม่แยกตัวพิมพ์เล็ก/ใหญ่ของ ASCII อยู่แล้ว (ห้ามใช้ mode: "insensitive")
    where.OR = [
      { name: { contains: q.q } },
      { sku: { contains: q.q } },
      { description: { contains: q.q } },
    ];
  }
  if (q.category) where.category = q.category;
  if (q.status === "active") where.isActive = true;
  if (q.status === "inactive") where.isActive = false;
  if (q.stock === "out") where.stock = 0;
  if (q.stock === "low") where.stock = { gt: 0, lte: LOW_STOCK_THRESHOLD };
  return where;
}

// หน้าที่: ดึงรายการสินค้าพร้อมกรองและแบ่งหน้า
export async function listProducts(q: ProductQuery) {
  const where = buildWhere(q);
  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / q.pageSize));
  const page = Math.min(q.page, totalPages);
  const items = await prisma.product.findMany({
    where,
    orderBy: SORT_OPTIONS[q.sort].orderBy,
    skip: (page - 1) * q.pageSize,
    take: q.pageSize,
  });
  return { items, total, page, pageSize: q.pageSize, totalPages };
}

// หน้าที่: ดึงรายชื่อหมวดหมู่สินค้า
export async function listCategories() {
  const rows = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category);
}

// หน้าที่: คำนวณสถิติภาพรวมสินค้า
export async function getProductStats() {
  const [total, active, low, out, all] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { stock: { gt: 0, lte: LOW_STOCK_THRESHOLD } } }),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.product.findMany({ select: { price: true, stock: true } }),
  ]);
  const inventoryValue = all.reduce((sum, p) => sum + p.price * p.stock, 0);
  return { total, active, low, out, inventoryValue };
}
