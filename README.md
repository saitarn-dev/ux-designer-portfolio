# 🎨 Fast-Track UX/UI Designer Portfolio — Mid-Level UX/UI Designer & Researcher

เว็บไซต์พอร์ตโฟลิโอส่วนตัวระดับ **Mid-Level UX/UI Designer & Researcher** ที่ออกแบบภายใต้แนวคิด **"Fast-Track Experience"** เพื่อแก้ปัญหา Pain Point ให้กับ Recruiter และ Hiring Manager ที่มีเวลาตรวจพอร์ตเฉลี่ยเพียง 2-3 นาที ให้สามารถเข้าถึงกระบวนการคิด (UX Process) และความประณีตในการออกแบบ (UI Craftsmanship) ได้ภายใน **ไม่เกิน 3 คลิก (≤ 3 Clicks)** โดยไม่มีทางตัน (No Dead Ends)

ได้รับแรงบันดาลใจจากสไตล์โมเดิร์น ดาร์กโทน ของ [Matias Personal Portfolio](https://bestwpware.com/html/tf/matias-php/?storefront=envato-elements) พร้อมระบบฐานข้อมูล **MongoDB Atlas** แบบเรียลไทม์

---

## 🌟 จุดเด่นและแนวคิดการออกแบบ (UX & Design Highlights)

### 1. Project Overview & Target Audience
- **Target Audience:** Hiring Managers, Tech Recruiters, และ Design Directors
- **Fast-Track Guarantee:** โครงสร้างข้อมูลแบบ Bento Grid และ Snapshot 60 วินาที ช่วยให้เข้าใจ Problem, Solution, และ Metric ทันทีในหน้าแรก
- **No Dead Ends:** ทุกจุดมี Actionable Path เช่น ปุ่ม Quick Resume Preview, ปุ่ม Copy Email พร้อมแอนิเมชันตอบสนองทันที

### 2. The Problem & Discovery (UX Process)
- แสดงกระบวนการคิดอย่างเป็นระบบ 4 ขั้นตอน: **Discover → Define → Design → Deliver**
- เคสสตัดดี้แต่ละชิ้นเจาะลึกทั้ง:
  - **User Persona & Empathy:** ปัญหาจริงของผู้ใช้และ Pain Points
  - **Information Architecture (IA) & User Flow:** การจัดลำดับขั้นตอน
  - **UI Craftsmanship & Micro-interactions:** ระบบ Design Tokens, ฟอนต์, พาเลตสีที่ผ่านเกณฑ์ WCAG 2.1 AA Accessibility
  - **Business Impact & Metrics:** วัดผลได้จริง (เช่น KYC Completion +38.4%, Checkout Drop-off -45%)

### 3. Design & Craftsmanship
- **Color Palette:** Dark Slate Obsidian (`#07090e`, `#121927`) พร้อมแสงเรือง Emerald (`#10b981`) และ Cyan (`#06b6d4`)
- **Typography:** Plus Jakarta Sans, Inter และรองรับภาษาไทยด้วย Prompt
- **Micro-interactions:**
  - Card Hover Glow & Scale
  - ปุ่ม **"Copy Email"** เปลี่ยนเป็น **"✓ Copied!"** พร้อม Toast Notification
  - Live Case Study Modal (เปิด-ปิดด้วยปุ่ม Esc หรือคลิกข้างนอก)
  - Quick Resume Preview Modal (พร้อมปุ่มสั่งพิมพ์/บันทึก PDF ทันที)

---

## 🗄️ การเชื่อมต่อกับฐานข้อมูล MongoDB Atlas

- **Database Host:** `oummy.vesxwvh.mongodb.net`
- **Database Name:** `portfolio_db`
- **User:** `saitarartchompoo_db_user`
- **Collections:**
  - `casestudies`: จัดเก็บข้อมูล Case Study เชิงลึก (Persona, IA, Screens, Metrics)
  - `profiles`: จัดเก็บข้อมูลประวัติ, ทักษะ, สถิติ, และไทม์ไลน์การทำงาน
  - `messages`: บันทึกข้อความและข้อเสนอร่วมงานจาก Recruiter ที่ส่งผ่านหน้าเว็บแบบ Real-time

---

## 🚀 วิธีการรันโปรเจกต์ (How to Run)

1. เข้าไปยังโฟลเดอร์โปรเจกต์:
   ```bash
   cd C:\Users\Administrator\.gemini\antigravity\scratch\ux-designer-portfolio
   ```

2. ติดตั้ง Dependencies (หากยังไม่ได้ติดตั้ง):
   ```bash
   npm install
   ```

3. นำเข้าข้อมูลเริ่มต้นลงใน MongoDB (Seeding):
   ```bash
   node seed.js
   ```

4. สตาร์ทเว็บเซิร์ฟเวอร์:
   ```bash
   node server.js
   ```

5. เปิดเบราว์เซอร์เข้าชมที่:
   **[http://localhost:3000](http://localhost:3000)**

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```
ux-designer-portfolio/
├── .env                     # MongoDB Connection String & Port
├── server.js                # Express Server & MongoDB API Routes
├── seed.js                  # Database Seeder (Case Studies & Profile)
├── package.json             # NPM dependencies (express, mongoose, cors, dotenv)
├── models/
│   ├── CaseStudy.js         # Mongoose Schema สำหรับ Case Studies
│   ├── Message.js           # Mongoose Schema สำหรับ Recruiter Messages
│   └── Profile.js           # Mongoose Schema สำหรับ User Profile
└── public/
    ├── index.html           # หน้าเว็บหลัก Single Page Portfolio
    ├── css/
    │   └── style.css        # สไตล์ธีม Matias, WCAG Contrast, Micro-interactions
    └── js/
        └── app.js           # Frontend Logic, MongoDB Fetch, Modals, Copy Toast
```
