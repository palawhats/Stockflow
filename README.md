<div align="center">

# 📦 StockFlow

### Manage smarter. Work better.

**ระบบจัดการสินค้าและสต็อก (Product & Inventory Management System)**  
เว็บแอปพลิเคชันสำหรับติดตามสินค้า ดูภาพรวมสต็อก และจัดการสิทธิ์ผู้ใช้งานในรูปแบบ Modern SaaS

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## 📖 เกี่ยวกับโปรเจกต์

**StockFlow** เป็นเว็บแอปพลิเคชันสำหรับบริหารจัดการข้อมูลสินค้าและตรวจสอบจำนวนสินค้าคงเหลือ โดยพัฒนาด้วย **Next.js (App Router)** และ **TypeScript** เชื่อมต่อฐานข้อมูล **SQLite** ผ่าน **Prisma ORM** พร้อมระบบยืนยันตัวตน **Auth.js / NextAuth** และระบบกำหนดสิทธิ์ตามบทบาท (**Role-Based Access Control: RBAC**)

ตัวระบบรองรับทั้งภาษาไทยและ UI แบบ responsive พร้อมโหมด **Light / Dark / System**

## ✨ ฟีเจอร์หลัก

- **Dashboard** — ดูจำนวนสินค้าทั้งหมด สินค้าใกล้หมด/หมดสต็อก มูลค่าสต็อกรวม สินค้าล่าสุด และกราฟแยกตามสถานะ/หมวดหมู่
- **Product Management** — เพิ่ม ดู แก้ไข และลบสินค้า พร้อม SKU, ราคา, จำนวนคงเหลือ, หมวดหมู่ และสถานะสินค้า
- **Search & Filter** — ค้นหาสินค้า กรองหมวดหมู่/สถานะ/สต็อก เรียงลำดับ และแบ่งหน้า
- **Authentication** — สมัครสมาชิกและเข้าสู่ระบบด้วยอีเมล/รหัสผ่าน หรือ GitHub OAuth (หากตั้งค่า)
- **User Management** — ผู้ดูแลระบบดูรายชื่อผู้ใช้และกำหนดบทบาทได้
- **RBAC** — ตรวจสอบสิทธิ์ทั้งฝั่งหน้าจอ Server Actions และ REST API
- **Zod Validation** — ตรวจสอบข้อมูลก่อนบันทึก พร้อมแจ้งข้อผิดพลาดรายฟิลด์
- **REST API** — ให้บริการ GET, POST, PUT และ DELETE สำหรับข้อมูลสินค้า
- **Responsive UI** — Sidebar, เมนูมือถือ, Toast, Dialog และ Light/Dark/System Theme

## 🛠️ เทคโนโลยีที่ใช้

| ส่วน | เทคโนโลยี |
| --- | --- |
| Frontend / Backend | Next.js 16 (App Router), React 19 |
| ภาษา | TypeScript 5 |
| UI / Styling | Tailwind CSS 4 |
| Authentication | Auth.js / NextAuth v5 (Credentials + GitHub OAuth) |
| Authorization | RBAC: `ADMIN`, `STAFF`, `USER` |
| Validation | Zod 4 |
| ORM | Prisma 7 + `@prisma/adapter-better-sqlite3` |
| Database | SQLite |
| Password Hashing | bcryptjs |

## 🚀 การติดตั้งและเริ่มต้นใช้งาน

### 1. สิ่งที่ต้องติดตั้ง

- **Node.js 20.19+** (แนะนำ Node.js 22 LTS)
- **npm** (ติดตั้งพร้อม Node.js)
- **Git** สำหรับดาวน์โหลด Repository

### 2. ดาวน์โหลดโปรเจกต์

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_FOLDER>
```

> แทน `<YOUR_REPOSITORY_URL>` ด้วย URL ของ Repository และเปลี่ยนชื่อโฟลเดอร์ตามที่ Clone ได้จริง หากดาวน์โหลดเป็น ZIP ให้แตกไฟล์และเปิด Terminal ในโฟลเดอร์ที่มี `package.json`

### 3. ติดตั้ง Dependencies

```bash
npm install
```

โปรเจกต์มี `postinstall` สำหรับเรียก `prisma generate` โดยอัตโนมัติ

### 4. สร้างไฟล์ Environment Variables

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux / Git Bash**

```bash
cp .env.example .env
```

แก้ไข `.env` ให้มีค่าที่จำเป็น เช่น

```dotenv
# SQLite database (ไฟล์ dev.db อยู่ที่ root ของโปรเจกต์)
DATABASE_URL="file:./dev.db"

# จำเป็น: กำหนดค่า secret ที่ปลอดภัย
AUTH_SECRET="REPLACE_WITH_A_RANDOM_SECRET"

# ไม่บังคับ: GitHub OAuth
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""

# ไม่บังคับ: รหัสผ่านสำหรับบัญชีตัวอย่างตอน seed
SEED_ADMIN_PASSWORD="CHANGE_ME_ADMIN"
SEED_STAFF_PASSWORD="CHANGE_ME_STAFF"
SEED_USER_PASSWORD="CHANGE_ME_USER"
```

สร้าง `AUTH_SECRET` แบบสุ่มได้ด้วยคำสั่ง:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

คัดลอกค่าที่ได้ไปใส่ใน `AUTH_SECRET` ห้ามใช้ข้อความตัวอย่าง `REPLACE_WITH_A_RANDOM_SECRET` จริง และ**ห้าม Commit ไฟล์ `.env` ลง GitHub**

> หากไม่ต้องการใช้ข้อมูลตัวอย่าง สามารถข้ามขั้นตอน Seed ได้ และสมัครสมาชิกผ่านหน้า `/signup` ได้ตามปกติ (บัญชีใหม่จะเป็น `USER`)

### 5. สร้างฐานข้อมูลและตาราง

```bash
npm run db:migrate
```

คำสั่งนี้เรียก `prisma migrate dev` โดยใช้ SQLite URL ที่ระบุใน `.env`

หากต้องการสร้าง Prisma Client ใหม่ด้วยตนเอง:

```bash
npx prisma generate
```

### 6. เพิ่มข้อมูลเริ่มต้น (ไม่บังคับ)

```bash
npm run db:seed
```

Seed จะสร้าง/ปรับปรุงบัญชีตัวอย่าง 3 บทบาท และเพิ่มสินค้าตัวอย่าง 12 รายการ (หาก SKU นั้นยังไม่มี)

| Role | Email | รหัสผ่าน |
| --- | --- | --- |
| ADMIN | `admin@example.com` | ค่าจาก `SEED_ADMIN_PASSWORD` |
| STAFF | `staff@example.com` | ค่าจาก `SEED_STAFF_PASSWORD` |
| USER | `user@example.com` | ค่าจาก `SEED_USER_PASSWORD` |

> หากไม่ได้กำหนดตัวแปรรหัสผ่าน Seed จะใช้ค่าเริ่มต้นสำหรับการพัฒนา: `Admin@1234`, `Staff@1234`, `User@1234` ตามลำดับ **อย่าใช้บัญชี/รหัสผ่านเหล่านี้ใน Production** การ Seed ซ้ำจะปรับรหัสผ่านของบัญชีตัวอย่างให้เป็นค่าปัจจุบันด้วย

### 7. รันโปรเจกต์

```bash
npm run dev
```

เปิดเว็บไซต์ที่ **http://localhost:3000**

### ตรวจสอบก่อน Build

```bash
npm run lint
npm run build
npm run start
```

`npm run start` ใช้เริ่ม Production Server หลังจาก `npm run build` สำเร็จแล้ว

## 🔐 ตั้งค่า GitHub OAuth (ไม่บังคับ)

1. ไปที่ **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. กำหนด **Homepage URL** เป็น `http://localhost:3000`
3. กำหนด **Authorization callback URL** เป็น `http://localhost:3000/api/auth/callback/github`
4. นำ **Client ID** และ **Client Secret** มาใส่ใน `AUTH_GITHUB_ID` และ `AUTH_GITHUB_SECRET` ภายใน `.env`
5. Restart Development Server

เมื่อกำหนดค่าเรียบร้อย ปุ่ม **เข้าสู่ระบบด้วย GitHub** จะแสดงบนหน้า Login และบัญชี GitHub ใหม่จะเริ่มต้นด้วยบทบาท `USER` โดย ADMIN สามารถเปลี่ยนสิทธิ์ให้ภายหลังได้

> เมื่อ Deploy ไปยังโดเมนจริง ต้องแก้ Homepage URL และ Callback URL ของ OAuth App ให้ตรงกับโดเมนนั้น

## 👥 สิทธิ์การใช้งาน (RBAC)

| ความสามารถ | USER | STAFF | ADMIN |
| --- | :---: | :---: | :---: |
| ดู Dashboard | ✅ | ✅ | ✅ |
| ดู / ค้นหา / กรองสินค้า | ✅ | ✅ | ✅ |
| เพิ่มสินค้า | ❌ | ✅ | ✅ |
| แก้ไขสินค้า | ❌ | ✅ | ✅ |
| ลบสินค้า | ❌ | ❌ | ✅ |
| ดูรายชื่อและแก้ไขบทบาทผู้ใช้ | ❌ | ❌ | ✅ |

> สถิติจำนวนผู้ใช้บน Dashboard แสดงเฉพาะบทบาทที่มีสิทธิ์ `user:manage` (ADMIN)

## 🗂️ หน้าสำคัญในระบบ

| URL | รายละเอียด |
| --- | --- |
| `/` | Landing Page (ยังไม่ Login) / Dashboard (Login แล้ว) |
| `/login` | เข้าสู่ระบบ |
| `/signup` | สมัครสมาชิก |
| `/products` | รายการสินค้า ค้นหา กรองและแบ่งหน้า |
| `/products/new` | เพิ่มสินค้า (STAFF / ADMIN) |
| `/products/[id]/edit` | แก้ไขสินค้า (STAFF / ADMIN) |
| `/admin` | จัดการผู้ใช้และสิทธิ์ (ADMIN) |
| `/unauthorized` | หน้าแจ้งเตือนเมื่อไม่มีสิทธิ์ |

## 🌐 REST API

**Base URL (Development):** `http://localhost:3000`  
API ใช้ **Session Cookie ของ Auth.js** จึงต้องเข้าสู่ระบบก่อนเรียก API ไม่ใช่ API Key หรือ Bearer Token แยกต่างหาก

| Method | Endpoint | รายละเอียด | สิทธิ์ |
| --- | --- | --- | --- |
| `GET` | `/api/products` | รายการสินค้า | USER / STAFF / ADMIN |
| `GET` | `/api/products/:id` | รายละเอียดสินค้า | USER / STAFF / ADMIN |
| `POST` | `/api/products` | เพิ่มสินค้า | STAFF / ADMIN |
| `PUT` | `/api/products/:id` | แก้ไขสินค้า (ส่งข้อมูลครบตาม Schema) | STAFF / ADMIN |
| `DELETE` | `/api/products/:id` | ลบสินค้า | ADMIN |

### Query Parameters ของ `GET /api/products`

| Parameter | ตัวอย่าง | ความหมาย |
| --- | --- | --- |
| `q` | `mouse` | ค้นหาชื่อ, SKU หรือคำอธิบาย |
| `category` | `Electronics` | กรองหมวดหมู่ |
| `status` | `active` / `inactive` | กรองสถานะสินค้า |
| `stock` | `low` / `out` | ใกล้หมด (1–10) / หมด (0) |
| `sort` | `newest`, `name_asc`, `price_asc`, `price_desc`, `stock_asc`, `stock_desc` | เรียงลำดับ |
| `page` | `1` | หน้าที่ต้องการ |
| `pageSize` | `10` | จำนวนรายการต่อหน้า (สูงสุด 100) |

ตัวอย่าง Request:

```http
GET /api/products?q=mouse&stock=low&sort=price_asc&page=1&pageSize=10
```

### ตัวอย่าง JSON สำหรับ POST/PUT

```json
{
  "sku": "ELEC-013",
  "name": "Gaming Mouse",
  "description": "Wireless gaming mouse",
  "category": "Electronics",
  "price": 990,
  "stock": 25,
  "unit": "ชิ้น",
  "isActive": true
}
```

POST ที่สำเร็จจะตอบ `201 Created` โดยมีข้อมูลสินค้าภายใต้ `data`

### ตัวอย่างการเรียก API จาก Browser

เปิด Developer Tools → Console **บนเว็บไซต์ StockFlow ที่ล็อกอินแล้ว** และเรียก:

```javascript
// GET: ดึงรายการสินค้า
const list = await fetch("/api/products?page=1");
console.log(await list.json());

// POST: สร้างสินค้า (ใช้บัญชี STAFF หรือ ADMIN)
const created = await fetch("/api/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sku: "ELEC-013",
    name: "Gaming Mouse",
    category: "Electronics",
    price: 990,
    stock: 25,
    unit: "ชิ้น",
    isActive: true,
  }),
});
console.log(created.status, await created.json());
```

**ใช้งานกับ Postman:** เลือก Method/URL ตามตาราง และตั้ง `Content-Type: application/json` สำหรับ POST/PUT จากนั้นส่ง **Session Cookie จากการเข้าสู่ระบบที่ถูกต้อง** ไปกับ Request ด้วย มิฉะนั้น API จะตอบ `401 Unauthorized` อย่านำ Cookie หรือ Token ที่ใช้งานจริงไปเผยแพร่

### HTTP Status Code

| Status | ความหมาย |
| --- | --- |
| `200` | สำเร็จ |
| `201` | สร้างสินค้าสำเร็จ |
| `400` | JSON หรือ ID ไม่ถูกต้อง |
| `401` | ยังไม่ได้เข้าสู่ระบบ |
| `403` | ไม่มีสิทธิ์ |
| `404` | ไม่พบสินค้า |
| `409` | SKU ซ้ำ |
| `422` | ข้อมูลไม่ผ่าน Zod Validation |

## ✅ กฎการตรวจสอบข้อมูลด้วย Zod

| ฟิลด์ | เงื่อนไข |
| --- | --- |
| `sku` | จำเป็น, ไม่เกิน 30 ตัว, ใช้ A-Z / 0-9 / `.` / `_` / `-` (แปลงเป็นตัวใหญ่) และห้ามซ้ำ |
| `name` | จำเป็น, ไม่เกิน 120 ตัวอักษร |
| `description` | ไม่บังคับ, ไม่เกิน 1,000 ตัวอักษร |
| `category` | จำเป็น, ไม่เกิน 50 ตัวอักษร |
| `price` | ตัวเลขตั้งแต่ 0 ถึง 10,000,000 (ทศนิยม 2 ตำแหน่ง) |
| `stock` | จำนวนเต็ม 0 ถึง 1,000,000 |
| `unit` | ไม่เกิน 20 ตัวอักษร ค่าเริ่มต้น `ชิ้น` |
| `isActive` | Boolean ค่าเริ่มต้น `true` |

## 📁 โครงสร้างโปรเจกต์

```text
stockflow/
├── app/
│   ├── page.tsx                   # Landing / Dashboard
│   ├── layout.tsx                 # Root Layout
│   ├── globals.css                # Design tokens / Theme
│   ├── auth.ts                    # Auth.js configuration
│   ├── login/                     # เข้าสู่ระบบ
│   ├── signup/                    # สมัครสมาชิก
│   ├── products/                  # หน้าสินค้าและ Server Actions
│   ├── admin/                     # จัดการผู้ใช้
│   ├── api/
│   │   ├── auth/[...nextauth]/    # Auth.js routes
│   │   └── products/              # REST API สำหรับสินค้า
│   └── lib/                       # Prisma, RBAC, Zod, Query, Dashboard
├── components/
│   ├── brand/                     # Logo
│   ├── layout/                    # Sidebar / Topbar / Shell
│   ├── ui/                        # Reusable components
│   ├── dashboard/                 # KPI cards / Charts
│   ├── products/                  # ตาราง / Filter / Pagination
│   ├── users/                     # User table
│   └── theme/                     # Light / Dark / System
├── prisma/
│   ├── schema.prisma              # User / Product models
│   ├── migrations/                # SQL migrations
│   └── seed.ts                    # Sample users / products
├── .env.example                   # Environment template
├── .gitignore
├── package.json
├── prisma.config.ts
└── README.md
```

> หมายเหตุ: ชื่อโฟลเดอร์เมื่อแตกไฟล์ ZIP ที่ใช้พัฒนาอาจเป็น `product-hub` แต่ชื่อโปรเจกต์ใน `package.json` คือ `stockflow`

## 🧩 คำสั่งที่ใช้งานบ่อย

| คำสั่ง | รายละเอียด |
| --- | --- |
| `npm run dev` | เปิด Development Server |
| `npm run build` | สร้าง Production Build |
| `npm run start` | เปิด Production Server |
| `npm run lint` | ตรวจโค้ดด้วย ESLint |
| `npm run db:migrate` | รัน Prisma Migration (Development) |
| `npm run db:seed` | เพิ่ม/อัปเดตข้อมูลตัวอย่าง |
| `npx prisma generate` | สร้าง Prisma Client |

## 🛡️ ข้อควรระวังก่อนนำขึ้น GitHub

- **ห้าม Commit** ไฟล์ `.env`, `.env.local`, ฐานข้อมูล `*.db`, ไฟล์ Build และ `node_modules/`
- โปรเจกต์มี `.gitignore` สำหรับไฟล์เหล่านี้อยู่แล้ว แต่ต้องตรวจสอบว่ามีไฟล์ใดถูก Track ไว้ก่อนหน้านี้หรือไม่
- หากเคยเผยแพร่ `AUTH_SECRET`, GitHub Client Secret หรือรหัสผ่านใด ๆ ให้เปลี่ยนค่าใหม่ก่อนใช้งานจริง
- `prisma/seed.ts` มีบัญชีทดสอบซึ่งควรใช้เฉพาะในสภาพแวดล้อมพัฒนา
- ควรใช้ฐานข้อมูลและกระบวนการจัดการ Secret ที่เหมาะสมก่อนเปิดระบบให้ผู้ใช้ภายนอกใช้งานจริง

## 📝 หมายเหตุ

โปรเจกต์นี้พัฒนาต่อยอดจากชื่อเดิม **Product Hub / Prodexa** และเปลี่ยนเป็น **StockFlow** โดยรักษาความสามารถด้าน Product Management, Authentication, RBAC และ REST API ไว้
