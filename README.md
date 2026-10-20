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
## ภาพตัวอย่าง
<img width="1919" height="942" alt="image" src="https://github.com/user-attachments/assets/2906ff2a-c476-4b0b-9707-3d4c616d5098" />
<img width="1919" height="938" alt="image" src="https://github.com/user-attachments/assets/34d64185-6302-4596-b0db-0b013a473dc9" />
<img width="1919" height="943" alt="image" src="https://github.com/user-attachments/assets/703485f8-5a76-426d-9f46-7a2e53388c80" />
<img width="1919" height="942" alt="image" src="https://github.com/user-attachments/assets/ba82124f-b4f9-4529-9c3e-7a69071d518a" />
<img width="1904" height="943" alt="image" src="https://github.com/user-attachments/assets/6ae3aee4-8705-4f80-93c8-72054e8ce5d2" />
<img width="1919" height="941" alt="image" src="https://github.com/user-attachments/assets/1e356b44-a004-4761-9d23-dbe6a19c9c1b" />
<img width="1919" height="941" alt="image" src="https://github.com/user-attachments/assets/c588b595-fa7b-447f-9a3c-409b595561be" />




## ฟีเจอร์หลัก

- **Dashboard** — ดูจำนวนสินค้าทั้งหมด สินค้าใกล้หมด/หมดสต็อก มูลค่าสต็อกรวม สินค้าล่าสุด และกราฟแยกตามสถานะ/หมวดหมู่
- **Product Management** — เพิ่ม ดู แก้ไข และลบสินค้า พร้อม SKU, ราคา, จำนวนคงเหลือ, หมวดหมู่ และสถานะสินค้า
- **Search & Filter** — ค้นหาสินค้า กรองหมวดหมู่/สถานะ/สต็อก เรียงลำดับ และแบ่งหน้า
- **Authentication** — สมัครสมาชิกและเข้าสู่ระบบด้วยอีเมล/รหัสผ่าน หรือ GitHub OAuth (หากตั้งค่า)
- **User Management** — ผู้ดูแลระบบดูรายชื่อผู้ใช้และกำหนดบทบาทได้
- **RBAC** — ตรวจสอบสิทธิ์ทั้งฝั่งหน้าจอ Server Actions และ REST API
- **Zod Validation** — ตรวจสอบข้อมูลก่อนบันทึก พร้อมแจ้งข้อผิดพลาดรายฟิลด์
- **REST API** — ให้บริการ GET, POST, PUT และ DELETE สำหรับข้อมูลสินค้า
- **Responsive UI** — Sidebar, เมนูมือถือ, Toast, Dialog และ Light/Dark/System Theme

## สิ่งที่ต้องติดตั้ง

- **Node.js 20.19+** (แนะนำ Node.js 22 LTS)
- **npm** (ติดตั้งพร้อม Node.js)
- **Git** สำหรับดาวน์โหลด Repository

## โครงสร้างโปรเจกต์

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

## คำสั่งที่ใช้งานบ่อย

| คำสั่ง | รายละเอียด |
| --- | --- |
| `npm run dev` | เปิด Development Server |
| `npm run build` | สร้าง Production Build |
| `npm run start` | เปิด Production Server |
| `npm run lint` | ตรวจโค้ดด้วย ESLint |
| `npm run db:migrate` | รัน Prisma Migration (Development) |
| `npm run db:seed` | เพิ่ม/อัปเดตข้อมูลตัวอย่าง |
| `npx prisma generate` | สร้าง Prisma Client |
