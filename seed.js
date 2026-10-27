require('dotenv').config();
const mongoose = require('mongoose');
const CaseStudy = require('./models/CaseStudy');
const Profile = require('./models/Profile');
const Message = require('./models/Message');

const uri = process.env.MONGODB_URI;

const caseStudiesData = [
{
  "title": "LocalRoute: แพลตฟอร์มนำทางระบบขนส่งท้องถิ่น & แผนที่ท่องเที่ยวไทย (Live Web App)",
  "slug": "localroute-transit-travel-hub",
  "category": "mobile",
  "categoryLabel": "🗺️ แอปแผนที่ & ขนส่งสาธารณะ / TransitTech",
  "tagline": "แอป PWA Interactive นำทางรถสองแถวแดง, MRT/BTS และคู่มือท่องเที่ยวไทย พร้อมแผนที่ Leaflet และระบบความปลอดภัยนักท่องเที่ยว",
  "role": "Lead UX/UI Designer & Front-End Developer",
  "roleTags": [
    "UX Research",
    "Interactive Map",
    "Front-End Dev"
  ],
  "timeline": "8 สัปดาห์ (Research, UI System, Leaflet Map Integration & Deploy)",
  "team": "Solo Project (UX/UI Design & Front-End Development โดยสายธาร)",
  "tools": [
    "Figma",
    "Leaflet.js",
    "Tailwind CSS",
    "Vercel",
    "Geolocation API",
    "HTML5 Audio"
  ],
  "liveUrl": "https://easylocalroutedev.vercel.app/",
  "keyMetrics": [
    {
      "label": "ลดเวลาตัดสินใจเลือกพาหนะ",
      "value": "-70%",
      "context": "มีชาร์ตเปรียบเทียบเวลา vs ราคาแบบเรียลไทม์"
    },
    {
      "label": "ความมั่นใจด้านความปลอดภัย",
      "value": "96%",
      "context": "ฟีเจอร์ Safe Ride Share & ปุ่มโทรฉุกเฉินออฟไลน์"
    },
    {
      "label": "ระบบเตือนกันตกรถ / ปลุกก่อนถึง",
      "value": "100%",
      "context": "Wake-Up Alert แจ้งเตือนเมื่อใกล้ถึงปลายทาง"
    },
    {
      "label": "รองรับ 2 ภาษาเต็มรูปแบบ",
      "value": "TH / EN",
      "context": "พร้อมฟังก์ชันพิมพ์แปลและออกเสียงภาษาไทยให้นักท่องเที่ยว"
    }
  ],
  "executiveSummary": {
    "problem": "นักท่องเที่ยวทั้งชาวไทยและต่างชาติมักสับสนกับระบบขนส่งท้องถิ่น เช่น รถสองแถวแดงเชียงใหม่ที่ไม่มีป้ายราคาชัดเจน กังวลเรื่องการโดนโก่งราคา และไม่รู้ว่ารถวิ่งผ่านจุดหมายหรือไม่",
    "solution": "ออกแบบแพลตฟอร์ม LocalRoute รวมข้อมูลเส้นทาง แผนที่อินเทอร์แอคทีฟ Leaflet ตารางวิเคราะห์มิติการบริการ ระบบเปรียบเทียบราคา และเครื่องมือแปลเสียงเพื่อสื่อสารกับคนขับ",
    "impact": "สร้างแอปพลิเคชันจริงที่เปิดใช้งานบน Vercel (https://easylocalroutedev.vercel.app/) มอบประสบการณ์เดินทางที่โปร่งใส มั่นใจ ปลอดภัย และเข้าใจง่าย"
  },
  "discovery": {
    "challenge": "รถสองแถวและขนส่งท้องถิ่นไม่มีสถานีและตารางเวลาตายตัว คนขับมักไม่พูดภาษาอังกฤษ และนักท่องเที่ยวกลัวตกรถหรือถูกคิดราคาเกินจริง",
    "userPersona": {
      "name": "Alex & พลอย, อายุ 26-32 ปี (นักท่องเที่ยว Backpacker & Digital Nomad)",
      "role": "นักเดินทางที่ต้องการสัมผัสวิถีชีวิตท้องถิ่นในราคาประหยัดและปลอดภัย",
      "needs": [
        "รู้ราคามาตรฐานก่อนขึ้นรถ",
        "มีแผนที่บอกตำแหน่งเรียลไทม์ไม่ต้องต่อเน็ต",
        "เครื่องมือสื่อสารภาษาไทยที่เข้าใจง่าย"
      ],
      "painPoints": [
        "โบกรถสองแถวแล้วคนขับบอกราคาเหมาแพงเกินจริง",
        "นั่งรถแล้วเลยจุดหมายเพราะไม่คุ้นทาง",
        "ไม่มีสัญญาณเน็ตเวลาออกนอกตัวเมือง"
      ]
    },
    "researchInsights": [
      "88% ของนักท่องเที่ยวต่างชาติไม่กล้าขึ้นรถสองแถวแดงเพราะกลัวสื่อสารไม่ได้และไม่รู้ราคามาตรฐาน",
      "การมีชาร์ตเปรียบเทียบ 4 ตัวเลือก (สองแถว, MRT/BTS, Grab/Taxi, เหมารถรายวัน) ช่วยลดเวลาตัดสินใจลงได้ 70%",
      "ฟังก์ชัน Wake-Up Alert สั่นเตือนก่อนถึง 500 เมตร เพิ่มความอุ่นใจในการนั่งรถได้ถึง 96%"
    ]
  },
  "strategy": {
    "iaHighlights": [
      "สถาปัตยกรรมข้อมูลแบบ One-Stop Hub: ค้นหาเส้นทาง → เปรียบเทียบพาหนะ → แผนที่ GPS → โหมดฉุกเฉิน",
      "ระบบ Offline-First: ดาวน์โหลดแผนที่และเบอร์โทรฉุกเฉินเก็บไว้ในเครื่องได้ทันที",
      "Quick Phrase Audio: รวมประโยคจำเป็น \"ผ่านประตูท่าแพไหมครับ\", \"จอดตรงนี้ด้วยครับ\" กดฟังเสียงได้ทันที"
    ],
    "userFlowSteps": [
      "เลือกจังหวัดและจุดหมายปลายทาง (เช่น ถนนนิมมานเหมินท์, ท่าแพ)",
      "ดูแผนที่ Leaflet Interactive Map แสดงแนวเส้นทางและสถานีเชื่อมต่อ",
      "เปรียบเทียบตัวเลือกการเดินทาง (เวลา vs ราคา)",
      "กดเริ่มเดินทางพร้อมเปิดระบบเตือน Wake-Up Alert หรือใช้ Phrasebook คุยกับคนขับ"
    ],
    "fastTrackWins": [
      "ปุ่มรายงานโดนโก่งราคา (Report Scam) & Safe Ride Share ส่งพิกัดให้เพื่อนได้ทันที",
      "สลับภาษาไทย / อังกฤษ (TH/EN) ได้ในคลิกเดียว",
      "UI โทนสีเป็นมิตรด้วยฟอนต์ K2D และ Quicksand สไตล์โมเดิร์น"
    ]
  },
  "craftsmanship": {
    "typography": "ใช้ฟอนต์ K2D คู่กับ Quicksand ออกแบบ UI สไตล์โมเดิร์น โค้งมน เป็นมิตรและอ่านง่ายบนหน้าจอมือถือกลางแจ้ง",
    "colorPalette": [
      {
        "name": "Emerald Transit (สีเขียวขนส่ง)",
        "hex": "#10b981"
      },
      {
        "name": "Sky Cyan (สีฟ้าเส้นทาง)",
        "hex": "#0ea5e9"
      },
      {
        "name": "Amber Alert (สีส้มแจ้งเตือน)",
        "hex": "#f59e0b"
      },
      {
        "name": "Rose Emergency (สีแดงฉุกเฉิน)",
        "hex": "#f43f5e"
      }
    ],
    "screens": [
      {
        "title": "Interactive Transit Map",
        "badge": "Leaflet Map",
        "description": "แผนที่ดาวเทียมและเส้นทางเดินรถสองแถวแดง พร้อมหมุดสถานี MRT/BTS"
      },
      {
        "title": "Compare Modal",
        "badge": "Price vs Time",
        "description": "กราฟวิเคราะห์เปรียบเทียบราคาและเวลาของแต่ละพาหนะแบบเรียลไทม์"
      },
      {
        "title": "Tourist Phrasebook",
        "badge": "Audio Assist",
        "description": "การ์ดประโยคภาษาไทยจำเป็นสำหรับการขึ้นรถ พร้อมเสียงพูดและคำอ่านคาราโอเกะ"
      },
      {
        "title": "Emergency & Safety",
        "badge": "Offline Support",
        "description": "เบอร์โทรตำรวจท่องเที่ยวและโรงพยาบาล กดโทรออกได้แม้ไม่มีอินเทอร์เน็ต"
      }
    ]
  },
  "impact": {
    "outcomes": [
      "พัฒนาเป็นเว็บแอปพลิเคชันจริง ใช้งานได้แบบ Responsive บน Vercel: https://easylocalroutedev.vercel.app/",
      "รองรับการใช้งานทั้งนักท่องเที่ยวไทยและต่างชาติด้วยระบบ 2 ภาษา (TH / EN)",
      "นำไปสาธิต Usability Testing ได้คะแนน System Usability Scale (SUS) สูงถึง 92/100",
      "พิสูจน์ทักษะทั้งด้าน UX Research, Product Strategy, UI Design System และ Front-End Engineering ในโปรเจกต์เดียว"
    ],
    "learnings": "การออกแบบแอปพลิเคชันที่ต้องใช้งานจริงท่ามกลางสภาพแวดล้อมที่คาดเดาไม่ได้ (เช่น ขาดสัญญาณเน็ต, นั่งบนรถสองแถวที่สั่น) ทำให้เรียนรู้ว่า ความเรียบง่ายและการทำงานแบบ Offline-First สำคัญกว่าฟีเจอร์ที่ซับซ้อน"
  }
},
  {
    title: 'รีดีไซน์แอป FinTech FlowPay: ปรับโฉม KYC เพิ่มยอดเปิดบัญชีสำเร็จ +38.4%',
    slug: 'flowpay-fintech-onboarding',
    category: 'mobile',
    categoryLabel: '📱 แอปมือถือ / FinTech',
    tagline: 'เปลี่ยนขั้นตอนยืนยันตัวตนที่ยุ่งยาก 12 สเต็ป ให้กลายเป็นโฟลว์น่ารัก เป็นมิตร เหลือเพียง 4 ขั้นตอน',
    role: 'Solo UX/UI Designer & Researcher',
    roleTags: ['UX Research', 'UI Design'],
    timeline: '6 สัปดาห์ (ค้นหาปัญหาจนถึงส่งมอบทีม Dev)',
    team: '1 Product Manager, 2 Mobile Devs, 1 Compliance, 1 UX/UI Designer (ตัวฉันเอง)',
    tools: ['Figma', 'FigJam', 'Maze Testing', 'UserZoom', 'ProtoPie'],
    keyMetrics: [
      { label: 'ผู้ใช้ผ่าน KYC สำเร็จ', value: '+38.4%', context: 'เพิ่มขึ้นจาก 54% เป็น 92.4%' },
      { label: 'ลดอัตราการเลิกทำกลางคัน', value: '-45.2%', context: 'ลดจุดติดขัดตอนถ่ายรูปบัตรประชาชน' },
      { label: 'เวลาที่ใช้ยืนยันตัวตน', value: '2.1 นาที', context: 'จากเดิมต้องใช้เวลากว่า 6.5 นาที' },
      { label: 'คะแนนความพึงพอใจ (CSAT)', value: '4.8 / 5', context: 'จากผลสำรวจผู้ใช้จริงหลังเปิดตัว' }
    ],
    executiveSummary: {
      problem: 'ผู้ใช้งานรู้สึกกังวลและสับสนกับข้อความแจ้งเตือนทางกฎหมายที่ยาวและแข็งกระด้าง ทำให้เกิดปัญหายกเลิกกลางคันสูงถึง 46% ก่อนที่จะเริ่มฝากเงินใช้งานครั้งแรก',
      solution: 'ออกแบบ Progressive Flow ใหม่ที่ย่อยข้อมูลทีละขั้น เพิ่มกรอบสแกนบัตรอัจฉริยะที่บอกคำแนะนำแบบเรียลไทม์ และใช้คำพูดที่อบอุ่น เป็นมิตร สบายใจ',
      impact: 'ช่วยให้ผู้ใช้งานเปิดบัญชีสำเร็จเพิ่มขึ้น +38.4% ลดภาระงาน Customer Support ไปได้กว่า 60% พร้อมขับเคลื่อนยอดเงินหมุนเวียน $2.4M ในไตรมาสแรก'
    },
    discovery: {
      challenge: 'ฝ่ายกฎหมายต้องการข้อมูลยืนยันตัวตนถึง 8 จุด แต่ผู้ใช้รู้สึกเครียดและกลัวข้อมูลหลุดเมื่อเจอกล้องตรวจจับหน้าที่ไร้การแนะนำ',
      userPersona: {
        name: 'ณภัทร, อายุ 28 ปี (พนักงานออฟฟิศมือใหม่หัดลงทุน)',
        role: 'ผู้ใช้งานทั่วไปที่ชอบความรวดเร็วและปลอดภัย',
        needs: ['เห็นแถบความคืบหน้าที่ชัดเจน', 'คำชี้แจงภาษาง่ายๆ ไม่ใช้ศัพท์เทคนิคกฎหมาย', 'กล้องถ่ายรูปที่คอยบอกว่าบัตรชัดหรือยัง'],
        painPoints: ['ถ่ายรูปแล้วกล้องแจ้งเตือนว่าไม่ชัดแต่ไม่บอกว่าต้องขยับยังไง', 'สลับหน้าจอไปเช็กเลขแล้วข้อมูลที่กรอกไว้หายหมด', 'ไม่มั่นใจว่าทำไมต้องขอข้อมูลส่วนตัวเยอะขนาดนี้']
      },
      researchInsights: [
        'จากการทำ Heuristic Evaluation พบปัญหา Error Prevention และ Recovery ในระดับรุนแรงถึง 7 จุด',
        '65% ของผู้ทดสอบวางบัตรเอียงและมีแสงสะท้อน เพราะกรอบเดิมไม่มีไกด์ไลน์บอกระยะโฟกัส',
        'การเปลี่ยนข้อความอธิบายให้ฟังดูน่ารักและเป็นมิตร เพิ่มอัตราการยินยอมให้เข้าถึงกล้องขึ้นเป็น 98%'
      ]
    },
    strategy: {
      iaHighlights: [
        'รวม 12 ขั้นตอนย่อยให้เหลือ 4 สเต็ปหลัก: 1. ข้อมูลบัตร 2. สแกนใบหน้ายิ้มหวาน 3. ตั้งรหัส PIN 4. พร้อมใช้งานทันที!',
        'ระบบ Auto-Save บันทึกข้อมูลอัตโนมัติ สลับไปดูแอปอื่นแล้วกลับมาทำต่อได้ทันที',
        'ออกแบบ Progress Bar สไตล์ 3D นุ่มฟู แสดงให้เห็นว่าใกล้เสร็จแล้วนะ!'
      ],
      userFlowSteps: [
        'หน้าต้อนรับน่ารักสดใส → กรอกเบอร์รับ OTP อัตโนมัติ',
        'สแกนบัตรประชาชนด้วย Smart Camera พร้อมเส้นไกด์ตรวจจับขอบบัตร',
        'สแกนหน้า Liveness พร้อมคำชม "ยิ้มสวยมากค่ะ!" เพิ่มความผ่อนคลาย',
        'สำเร็จเรียบร้อย! เอฟเฟกต์ Confetti ฉลองเข้าสู่กระเป๋าเงินทันที'
      ],
      fastTrackWins: [
        'Progress Indicator สไตล์ 3D ลดความวิตกกังวลของผู้ใช้ลง 70%',
        'กล่องช่วยเหลือแบบ Contextual Tooltip ตอบข้อสงสัยได้ใน 1 แท็ป',
        'ตัดทอนฟิลด์ที่ไม่จำเป็นออก 50% ทำให้กรอกเสร็จไวขึ้นเท่าตัว'
      ]
    },
    craftsmanship: {
      typography: 'ใช้ฟอนต์ Prompt คู่กับ Plus Jakarta Sans เน้นความสะอาดตา อ่านง่ายสบายใจ และเป็นมิตรกับผู้ใช้งานทุกช่วงวัย',
      colorPalette: [
        { name: 'Mint Energy (สีเขียวมิ้นต์สดใส)', hex: '#22c55e' },
        { name: 'Cream Peach (สีพีชอบอุ่น)', hex: '#ffedd5' },
        { name: 'Playful Purple (สีม่วงสดใส)', hex: '#a855f7' },
        { name: 'Deep Navy Soft (สีกรมท่านุ่มลึก)', hex: '#0f172a' }
      ],
      microInteractions: [
        'กรอบสแกนบัตรเปลี่ยนสีพร้อมอนิเมชัน Pulse นุ่มๆ เมื่อจับโฟกัสภาพชัดเจน',
        'ปุ่มยืนยันมีมิติ 3D เด้งตอบสนองการกด (Haptic Visual Feedback)',
        'พลุ Confetti น่ารักๆ ระเบิดฉลองเมื่อผู้ใช้ผ่านขั้นตอนสุดท้าย'
      ],
      screens: [
        { title: 'กล้องสแกนอัจฉริยะ', description: 'มีกรอบแนะนำแสงสะท้อนและระยะห่างแบบเรียลไทม์ พร้อมการ์ตูนช่วยแนะนำ', badge: 'Smart Camera', accentColor: '#22c55e' },
        { title: 'สแกนใบหน้ายิ้มหวาน', description: 'ลดความตึงเครียดด้วยข้อความน่ารัก "กระพริบตาและยิ้มหน่อยนะคะ"', badge: 'Friendly UI', accentColor: '#06b6d4' },
        { title: 'ตั้งรหัส PIN ปลอดภัย', description: 'แป้นตัวเลขขนาดใหญ่ กดง่าย สัมผัสนุ่ม รองรับ Face ID/สแกนนิ้ว', badge: 'Security UX', accentColor: '#a855f7' },
        { title: 'ฉลองเปิดบัญชีสำเร็จ', description: 'หน้าต้อนรับพร้อมใช้จ่าย แสดงยอดเงินโบนัสพร้อมเริ่มทำรายการได้ทันที', badge: 'Delight UX', accentColor: '#22c55e' }
      ]
    },
    impact: {
      outcomes: [
        'อัตราการยืนยันตัวตนสำเร็จพุ่งสูงจาก 54% ขึ้นเป็น 92.4% ภายใน 30 วันแรก',
        'คะแนนรีวิวบน App Store และ Play Store ขยับขึ้นจาก 3.7 เป็น 4.8 ดาว',
        'ได้รับรางวัลไฮไลต์ "Best Mobile UX Design 2024" สาย FinTech'
      ],
      learnings: 'แอปการเงินไม่จำเป็นต้องดูน่าเบื่อหรือน่ากลัว การใส่ความน่ารัก ความอบอุ่น และการสื่อสารที่จริงใจ จะช่วยสร้างความไว้วางใจให้กับผู้ใช้งานได้ดียิ่งขึ้น'
    },
    figmaUrl: 'https://figma.com',
    liveDemoUrl: 'https://figma.com',
    featured: true,
    displayOrder: 1
  },
  {
    title: 'NovaCloud B2B SaaS: สร้าง Design System ช่วยทีม Dev ส่งงานไวขึ้น 2.4 เท่า',
    slug: 'novacloud-enterprise-saas-design-system',
    category: 'saas',
    categoryLabel: '💻 ระบบ SaaS / Design System',
    tagline: 'รวบรวมและจัดระเบียบหน้าจอองค์กร 14 โมดูล ให้เป็นหนึ่งเดียวด้วย Design Tokens และมาตรฐานความเข้าถึงระดับสากล',
    role: 'Design System Lead & Senior UX Architect',
    roleTags: ['UX Research', 'Design System'],
    timeline: '10 สัปดาห์',
    team: '1 Head of Product, 6 Fullstack Devs, 1 UX/UI Designer (ตัวฉันเอง)',
    tools: ['Figma Design Tokens', 'Storybook', 'Zeroheight', 'FigJam'],
    keyMetrics: [
      { label: 'Dev ส่งงานไวขึ้น', value: '2.4 เท่า', context: 'ลดเวลาประเมิน Sprint และแก้บั๊ก UI' },
      { label: 'มาตรฐาน Accessibility', value: '100% AA', context: 'ผ่านการตรวจรับรองมาตรฐานสากล' },
      { label: 'ชุดคอมโพเนนต์', value: '120+ Tokens', context: 'ใช้ร่วมกันทั้งทีม Web, React และ Vue' },
      { label: 'ลดความซ้ำซ้อนในดีไซน์', value: '-88%', context: 'สำรวจพบจากระบบเดิมก่อนรื้อโครงสร้าง' }
    ],
    executiveSummary: {
      problem: 'วิศวกรและนักออกแบบทำงานช้าลงอย่างเห็นได้ชัด เพราะปุ่ม ตาราง และสีในระบบเดิมกระจัดกระจาย ขาดเอกสารอ้างอิง และผู้ใช้ที่ตาบอดสีมองกราฟไม่ออก',
      solution: 'สร้าง Design System ใน Figma ที่เชื่อมโยงด้วย Design Tokens เข้ากับ Storybook โดยยึดมาตรฐาน WCAG 2.1 AA ทุกชิ้นงาน',
      impact: 'ทีม Dev พัฒนาฟีเจอร์ใหม่ได้เร็วขึ้น 2.4 เท่า และตัดปัญหางานดีไซน์ไม่ตรงปกออกไปได้อย่างหมดจด'
    },
    discovery: {
      challenge: 'แดชบอร์ดระดับ Enterprise แสดงผลข้อมูลมหาศาล หากดีไซน์แน่นเกินไปจะทำให้เกิด Cognitive Fatigue (ตาล้าและสับสน)',
      userPersona: {
        name: 'พี่ชาติชาย, อายุ 42 ปี (Lead Cloud DevOps)',
        role: 'ผู้ดูแลระบบเซิร์ฟเวอร์ที่ต้องเฝ้าดูหน้าจอตลอดทั้งวัน',
        needs: ['กวาดสายตามองสถานะเซิร์ฟเวอร์ได้ใน 3 วินาที', 'ปรับแต่งคอลัมน์ตารางได้ตามใจชอบ', 'สีและไอคอนที่บอกระดับความรุนแรงชัดเจน'],
        painPoints: ['ตารางมีมากกว่า 25 คอลัมน์โดยไม่จัดกลุ่ม', 'ปุ่ม Action วางไม่เป็นระเบียบ', 'สีกราฟเขียว-แดงกลืนกันแยกยาก']
      },
      researchInsights: [
        'พบรูปแบบปุ่มที่ทำหน้าที่เดียวกันแต่ดีไซน์ต่างกันถึง 43 แบบในระบบเดิม',
        'การจัดกลุ่มคอมโพเนนต์ด้วย Atomic Design ช่วยให้ทั้งดีไซเนอร์และโปรแกรมเมอร์คุยภาษาเดียวกัน',
        'ผู้ใช้งาน 100% ชอบระบบปรับความหนาแน่นหน้าจอ (Compact / Comfortable)'
      ]
    },
    strategy: {
      iaHighlights: [
        'วางโครงสร้าง 3 ระดับ: Foundations (สี, ฟอนต์, สเปซซิ่ง 3D) → Core Components → Complex Tables & Data Viz',
        'เพิ่มระบบทางลัด Command Palette (Cmd + K) สำหรับ Power Users',
        'รองรับทั้งธีมสว่างสดใส (Warm Clean) และธีมดาร์กถนอมสายตา'
      ],
      userFlowSteps: [
        'กดปุ่มลัดค้นหาด่วน → ปรากฏตัวกรองอัจฉริยะ',
        'ปักหมุดคอลัมน์สำคัญพร้อมการพรีวิวข้อมูลสด',
        'กดดาวน์โหลดรายงาน Excel / PDF ได้ในคลิกเดียว'
      ],
      fastTrackWins: [
        'Dev สามารถดึงคอมโพเนนต์พร้อมเขียนโค้ดได้ในไม่กี่นาที',
        'ตารางข้อมูลรองรับการซูมและแสดงผลตามขนาดหน้าจออย่างลื่นไหล',
        'ไอคอนและสีกราฟผ่านการทดสอบเรื่องความคมชัดทุกมุมมอง'
      ]
    },
    craftsmanship: {
      typography: 'JetBrains Mono สำหรับตัวเลขสถิติ และ Prompt สำหรับเนื้อหาและเมนู เพื่อให้อ่านเข้าใจง่ายไม่สับสน',
      colorPalette: [
        { name: 'Core Slate 900', hex: '#0f172a' },
        { name: 'Electric Violet', hex: '#8b5cf6' },
        { name: 'Accessible Mint', hex: '#10b981' },
        { name: 'Alert Peach', hex: '#f97316' }
      ],
      microInteractions: [
        'เมาส์ Hover บนการ์ดแสดงเส้นกราฟ Sparkline เคลื่อนไหวนุ่มนวล',
        'ปุ่มสลับแท็บมีเส้นไฮไลต์เคลื่อนที่แบบสปริงอย่างเป็นธรรมชาติ',
        'การ์ดสถิติตอบสนองต่อการคลิกด้วยมิติ 3D นุ่มนวล'
      ],
      screens: [
        { title: 'แดชบอร์ดศูนย์กลางระบบ', description: 'มองเห็นสถานะเซิร์ฟเวอร์ทั่วโลกด้วยแผนผังสีที่แยกแยะง่าย', badge: 'Data Viz', accentColor: '#8b5cf6' },
        { title: 'คลังดีไซน์โทเค็น (Tokens)', description: 'จัดเก็บสไตล์สี ระยะห่าง และตัวแปร CSS ที่ซิงก์ตรงกับโค้ด React', badge: 'Design System', accentColor: '#10b981' },
        { title: 'ตัวกรองข้อมูลหลายเงื่อนไข', description: 'หน้าต่างกรองข้อมูลที่ค้นหาได้อย่างรวดเร็วและบันทึกมุมมองไว้ได้', badge: 'UX Architecture', accentColor: '#06b6d4' }
      ]
    },
    impact: {
      outcomes: [
        'ผ่านการตรวจประเมิน Accessibility Audit 100% ปราศจากข้อผิดพลาด',
        'ลดการเปิดบั๊กเรื่องความผิดพลาดของ UI ลงกว่า 58%',
        'ถูกนำไปใช้ต่อยอดในโปรเจกต์อื่นๆ ในองค์กรถึง 3 ผลิตภัณฑ์'
      ],
      learnings: 'Design System ที่ดีไม่ใช่แค่งานวาดคอมโพเนนต์ให้สวย แต่คือการสร้างเครื่องมือทำงานร่วมกันที่ทำให้ทีม Engineer และ Product รู้สึกสนุกและทำงานง่ายขึ้น'
    },
    figmaUrl: 'https://figma.com',
    liveDemoUrl: 'https://figma.com',
    featured: true,
    displayOrder: 2
  },
  {
    title: 'รีดีไซน์แอป E-commerce OmniCart: หน้าจ่ายเงิน One-Page กู้ยอดขาย $1.2M/เดือน',
    slug: 'omnicart-ecommerce-checkout-redesign',
    category: 'ecommerce',
    categoryLabel: '🛍️ อีคอมเมิร์ซ / เว็บและแอป',
    tagline: 'ลดการทิ้งตะกร้าสินค้าด้วยการเปลี่ยนฟอร์ม 5 หน้าสุดน่าเบื่อ ให้กลายเป็น One-Page จบใน 45 วินาที พร้อม PromptPay & Apple Pay',
    role: 'Lead UX Researcher & Interaction Designer',
    roleTags: ['UX Research', 'UI Design'],
    timeline: '4 สัปดาห์',
    team: '1 E-Commerce Growth Manager, 2 Web Devs, 1 UX/UI Designer (ตัวฉันเอง)',
    tools: ['Figma', 'Hotjar Heatmaps', 'Google Analytics 4', 'Lookback'],
    keyMetrics: [
      { label: 'อัตราการสั่งซื้อสำเร็จ', value: '+28.5%', context: 'วัดจากยอดซื้อผ่านเบราว์เซอร์มือถือ' },
      { label: 'ลดการทิ้งตะกร้าสินค้า', value: '-34.0%', context: 'ลดจาก 68% เหลือเพียง 34%' },
      { label: 'เวลาที่ใช้จ่ายเงิน', value: '45 วินาที', context: 'จากเดิมเฉลี่ย 2 นาที 40 วินาที' },
      { label: 'รายได้ที่กู้คืนได้', value: '+$1.2M/เดือน', context: 'ยอดขายที่เพิ่มขึ้นอย่างเห็นได้ชัด' }
    ],
    executiveSummary: {
      problem: 'ลูกค้ากว่า 68% กดออกจากหน้าเว็บทันทีหลังใส่สินค้าลงตะกร้า เพราะต้องกดผ่านถึง 5 หน้า บังคับสมัครสมาชิก และไม่ยอมบอกค่าจัดส่งล่วงหน้า',
      solution: 'ออกแบบหน้าชำระเงินแบบ Accordion หน้าเดียว กรอกรหัสไปรษณีย์แล้วเติมที่อยู่อัตโนมัติ พร้อมตัวเลือก PromptPay สแกนจ่ายได้ทันทีไม่ต้องสลับแอป',
      impact: 'ดันอัตรา Conversion เพิ่มขึ้นทันที +28.5% กู้ยอดขายที่เคยหลุดมือไปได้กว่า 1.2 ล้านดอลลาร์สหรัฐฯ ต่อเดือน'
    },
    discovery: {
      challenge: 'ผู้ซื้อสินค้าบนมือถือมักจะสั่งซื้อระหว่างเดินทาง หากขั้นตอนยาวเกินไปหรือพิมพ์ยากจะทำให้ตัดสินใจยกเลิกทันที',
      userPersona: {
        name: 'น้องเมย์, อายุ 26 ปี (นักช็อปออนไลน์ตัวยง)',
        role: 'ชอบซื้อของช่วงเซลและกดจ่ายเงินผ่านมือถือ',
        needs: ['ซื้อแบบ Guest Checkout ไม่ต้องจำรหัสผ่าน', 'เห็นค่าจัดส่งชัดเจนตั้งแต่แรก', 'สแกน QR Code PromptPay หรือแตะสแกนนิ้วได้เลย'],
        painPoints: ['ซื้อของชิ้นเดียวแต่บังคับให้ตั้งรหัสผ่านใหม่', 'ช่องกรอกที่อยู่บนมือถือเล็ก กดพลาดบ่อย', 'พอกดปุ่มย้อนกลับแล้วของในตะกร้าหายเกลี้ยง']
      },
      researchInsights: [
        'จากการดู Heatmap บน Hotjar พบว่าผู้ใช้ 52% กดยกเลิกเมื่อเจอหน้าบังคับสมัครสมาชิก',
        'การใส่รหัสไปรษณีย์แล้วระบบดึงตำบล อำเภอ จังหวัด อัตโนมัติ ช่วยลดความผิดพลาดในการกรอกได้ถึง 85%',
        'ความโปร่งใสเรื่องค่าจัดส่งช่วยสร้างความรู้สึกปลอดภัยและลดความลังเลใจได้อย่างมีนัยสำคัญ'
      ]
    },
    strategy: {
      iaHighlights: [
        'ยุบ 5 หน้าจอเดิมให้เหลือแค่ 1 หน้า โดยแบ่งเป็น 3 การ์ด: 1. ที่อยู่จัดส่ง 2. วิธีส่ง 3. ช่องทางชำระเงิน',
        'รองรับ Guest Checkout พร้อมปุ่มเช็กบ็อกซ์น่ารัก "จำข้อมูลไว้สำหรับการซื้อครั้งถัดไป"',
        'แถบสรุปยอดรวมด้านล่างแบบ Sticky ลอยติดหน้าจอ แสดงส่วนลดและราคาสุทธิเสมอ'
      ],
      userFlowSteps: [
        'คลิกเปิดกระเป๋าช็อปปิ้ง → กดปุ่ม "ชำระเงินด่วน"',
        'พิมพ์รหัสไปรษณีย์ 5 หลัก → ที่อยู่ขึ้นให้เลือกทันที',
        'เลือกจ่ายด้วย PromptPay QR หรือสแกนใบหน้าผ่าน Apple Pay → สำเร็จ!'
      ],
      fastTrackWins: [
        'ลดจำนวนช่องกรอกข้อมูลจาก 18 ช่อง เหลือเพียง 6 ช่องที่จำเป็น',
        'เด้งคีย์บอร์ดตัวเลขให้อัตโนมัติเมื่อกดช่องเบอร์โทรและรหัสไปรษณีย์',
        'มีตราประทับความปลอดภัย Bank-Grade ยืนยันความมั่นใจ'
      ]
    },
    craftsmanship: {
      typography: 'ฟอนต์ Prompt ชัดเจน สบายตา พร้อมตัวเลขอารบิกที่ออกแบบมาให้อ่านราคาสินค้าได้ถูกต้องแม่นยำ',
      colorPalette: [
        { name: 'Warm Midnight', hex: '#0a0d14' },
        { name: 'Emerald Spark', hex: '#10b981' },
        { name: 'Warm Amber Highlight', hex: '#f59e0b' },
        { name: 'Soft Surface Slate', hex: '#1e293b' }
      ],
      microInteractions: [
        'เมื่อกรอกแต่ละการ์ดเสร็จ การ์ดจะพับเก็บอย่างนุ่มนวลพร้อมติ๊กถูกสีเขียว',
        'ช่องใส่โค้ดส่วนลดมีอนิเมชันตรวจเช็กแบบเด้งดึ๋งเมื่อใส่โค้ดถูกต้อง',
        'ปุ่มคัดลอกเลขออเดอร์มีเอฟเฟกต์เปลี่ยนเป็น "คัดลอกแล้วค่ะ!" พร้อมสั่นเบาๆ'
      ],
      screens: [
        { title: 'หน้าชำระเงิน One-Page', description: 'รวมทุกสเต็ปไว้ในหน้าจอเดียว เห็นความคืบหน้าตลอดเวลา', badge: 'One-Page UX', accentColor: '#10b981' },
        { title: 'หน้าต่างสแกน PromptPay', description: 'QR Code แบบไดนามิก พร้อมเวลานับถอยหลังและการแจ้งเตือนอัตโนมัติ', badge: 'Payment UX', accentColor: '#06b6d4' },
        { title: 'หน้าติดตามพัสดุแสนน่ารัก', description: 'แผนภาพติดตามสถานะการจัดส่งแบบอินเทอร์แอคทีฟ พร้อมปุ่มทักไลน์ร้าน', badge: 'Post-Purchase', accentColor: '#8b5cf6' }
      ]
    },
    impact: {
      outcomes: [
        'อัตราการชำระเงินสำเร็จบนสมาร์ทโฟนพุ่งขึ้น +28.5% หลังเปิด A/B Test แค่ 14 วัน',
        'เวลาเฉลี่ยในการสั่งซื้อลดลงจาก 2 นาที 40 วินาที เหลือเพียง 45 วินาที',
        'ผู้ใช้งานประเมินความพึงพอใจสูงถึง 94% โดยบอกว่าง่ายและน่ารักมาก'
      ],
      learnings: 'ความโปร่งใสคือหัวใจของ Conversion ยิ่งทำให้ลูกค้ารู้สึกว่าควบคุมทุกอย่างได้ง่ายและไม่ถูกยัดเยียด ความมั่นใจในการซื้อก็จะตามมาเอง'
    },
    figmaUrl: 'https://figma.com',
    liveDemoUrl: 'https://figma.com',
    featured: true,
    displayOrder: 3
  },
  {
    title: 'HealthSync แอปสุขภาพผู้สูงอายุ: ดันอัตราทานยาตรงเวลาพุ่ง +62% (WCAG AAA)',
    slug: 'healthsync-senior-accessible-telehealth',
    category: 'mobile',
    categoryLabel: '👵 สุขภาพ / ออกแบบเพื่อทุกคน (WCAG AAA)',
    tagline: 'ออกแบบเพื่อนคู่คิดในการดูแลสุขภาพและปรึกษาคุณหมอออนไลน์ สำหรับคุณลุงคุณป้า เน้นใช้งานง่าย ปุ่มใหญ่ สีชัด อบอุ่นหัวใจ',
    role: 'Solo UX Researcher & Accessibility Specialist',
    roleTags: ['UX Research', 'Inclusive Design'],
    timeline: '8 สัปดาห์',
    team: '2 แพทย์ที่ปรึกษา, 2 Mobile Devs, 1 UX/UI Designer (ตัวฉันเอง)',
    tools: ['Figma', 'Stark Accessibility', 'Miro', 'In-Person Shadowing'],
    keyMetrics: [
      { label: 'อัตราทานยาตรงเวลา', value: '+62.0%', context: 'กลุ่มผู้สูงอายุทดสอบ (อายุ 60-78 ปี)' },
      { label: 'คะแนนการใช้งาน (SUS)', value: '94 / 100', context: 'วัดผลด้วยแบบประเมิน System Usability Scale' },
      { label: 'อัตราส่วน Contrast Ratio', value: '7.1:1 (AAA)', context: 'ตัวหนังสือคมชัดสูงสุดตามเกณฑ์สากล' },
      { label: 'อัตราโทรหาหมอสำเร็จ', value: '98.5%', context: 'สามารถกดคุยสายได้สำเร็จโดยไม่ต้องมีลูกหลานช่วย' }
    ],
    executiveSummary: {
      problem: 'ผู้สูงอายุที่มีโรคประจำตัวมักลืมทานยาหรือกดเข้าห้องคุยวิดีโอกับคุณหมอไม่ถูก เพราะปุ่มมีขนาดเล็กเกินไป ตัวหนังสือสีเทาซีดจาง และเมนูหลายชั้นที่ชวนงง',
      solution: 'สร้างสรรค์แอปที่เน้นความเข้าถึงง่าย (Accessibility-First) ปุ่มกดใหญ่พิเศษ 56px พร้อมระบบเสียงภาษาไทยบอกชื่อยา และการ์ดแสดงภาพเม็ดยาของจริง',
      impact: 'ช่วยให้ผู้สูงอายุทานยาตรงเวลาเพิ่มขึ้นถึง +62% และได้คะแนนความง่ายในการใช้งานระดับ 94/100 (ระดับสูงสุดในกลุ่มแอปการแพทย์)'
    },
    discovery: {
      challenge: 'ข้อจำกัดทางกายภาพ เช่น สายตายาว ตาต้อกระจก และอาการมือสั่น ทำให้ไม่สามารถใช้งานดีไซน์แบบมินิมอลทั่วไปได้',
      userPersona: {
        name: 'ลุงสมชาย, อายุ 68 ปี (ข้าราชการบำนาญ มีโรคเบาหวานและความดัน)',
        role: 'อยู่บ้านแถวนนทบุรี ชอบคุยกับคุณหมอประจำ',
        needs: ['ตัวหนังสือตัวโตๆ ไม่ต้องเพ่ง', 'เห็นภาพเม็ดยาสีเดียวกับในซองยาจริง', 'ปุ่มโทรหาหมอปุ่มเดียว กดแล้วต่อสายทันที'],
        painPoints: ['ตัวหนังสือสีเทาอ่อนมองไม่เห็น', 'มือสั่นแล้วกดโดนปุ่มผิด', 'เมนูซ่อนอยู่ในขีด 3 ขีดหาไม่เจอ']
      },
      researchInsights: [
        'ลงพื้นที่ไปนั่งสังเกตพฤติกรรมคุณลุงคุณป้าถึงที่บ้าน 8 ครอบครัว',
        'พบว่า 100% ของผู้สูงอายุจำ "สีและรูปทรงของเม็ดยา" ได้แม่นยำกว่าชื่อทางเคมีบนฉลาก',
        'ปุ่มที่มีมิติ 3D (มีเงาและขอบนูน) ช่วยให้ผู้สูงอายุรู้ได้ทันทีว่า "ตรงนี้กดได้นะ" ดีกว่าปุ่มแบนเรียบ'
      ]
    },
    strategy: {
      iaHighlights: [
        'ใช้โครงสร้างแบบแบนราบ ไม่ซ่อนเมนู ทุกอย่างอยู่ในการ์ดขนาดใหญ่บนหน้าแรก',
        'จัดตารางยาตามช่วงเวลาของวัน: เช้า • กลางวัน • เย็น • ก่อนนอน',
        'มีปุ่มช่วยเหลือฉุกเฉินสีแดงสด กดครั้งเดียวโทรหาโรงพยาบาลและส่งสัญญาณให้ลูกหลานทันที'
      ],
      userFlowSteps: [
        'มีเสียงกระดิ่งใสๆ ดังเตือนตอนเช้า → แตะปุ่ม "ทานยาเช้า"',
        'เห็นรูปเม็ดยาของจริงขนาดใหญ่ พร้อมคำแนะนำ "ทานหลังอาหาร ดื่มน้ำตามเยอะๆ นะคะ"',
        'กดปุ่ม "ทานเรียบร้อยแล้วจ้า" → หน้าจอแสดงรูปยิ้มหวานชื่นชม'
      ],
      fastTrackWins: [
        'ปุ่มกดทุกปุ่มมีขนาดไม่ต่ำกว่า 56×56 พิกเซล กดง่ายแม้มีอาการมือสั่น',
        'ความคมชัดของสีระดับ 7.1:1 (WCAG AAA สูงสุด)',
        'ใช้ภาษาพูดที่อบอุ่นเหมือนลูกหลานดูแล เช่น เปลี่ยนจาก "ใบสั่งยา" เป็น "ยาที่คุณหมอจัดให้"'
      ]
    },
    craftsmanship: {
      typography: 'ฟอนต์ Prompt ขนาดเริ่มต้นที่ 18px สำหรับเนื้อหา และ 24px สำหรับปุ่มกด เพื่อการมองเห็นที่สบายตาที่สุด',
      colorPalette: [
        { name: 'Deep Navy (น้ำเงินเข้มอ่านง่าย)', hex: '#0f172a' },
        { name: 'Friendly Sky (ฟ้าสดใสสบายใจ)', hex: '#0284c7' },
        { name: 'Warm Lime (เขียวมะนาวสดชื่น)', hex: '#84cc16' },
        { name: 'Care Rose (ชมพูอบอุ่นใส่ใจ)', hex: '#f43f5e' }
      ],
      microInteractions: [
        'ปุ่มกดมีการตอบสนองด้วยการสั่นเบาๆ ให้ความรู้สึกเหมือนกดปุ่มจริง',
        'การ์ดยาที่ถึงเวลาทานจะมีแสงเรืองเตือนนุ่มๆ ไม่ทำให้ตกใจ',
        'สไลด์การ์ดเปลี่ยนช่วงเวลาได้อย่างนุ่มนวล'
      ],
      screens: [
        { title: 'หน้าแรกตารางยาประจำวัน', description: 'เห็นเวลากลุ่มยาและภาพเม็ดยาของจริงได้อย่างชัดเจน', badge: 'Accessibility UI', accentColor: '#84cc16' },
        { title: 'หน้าคุยสายกับคุณหมอ', description: 'มีปุ่มเปิดกล้องและไมค์ขนาดใหญ่ พร้อมตัวเลือกเชิญลูกหลานร่วมฟังด้วย', badge: 'Telehealth', accentColor: '#0284c7' },
        { title: 'ระบบส่งกำลังใจจากลูกหลาน', description: 'ลูกหลานสามารถส่งข้อความสติ๊กเกอร์ให้กำลังใจคุณพ่อคุณแม่ได้', badge: 'Warm Care', accentColor: '#f43f5e' }
      ]
    },
    impact: {
      outcomes: [
        'อัตราการทานยาถูกต้องตามเวลาของกลุ่มทดสอบสูงถึง 91% ตลอดช่วง 90 วัน',
        'ได้รับคะแนน System Usability Scale (SUS) สูงถึง 94/100',
        'ได้รับการทาบทามจากเครือโรงพยาบาลเอกชน 3 แห่งเพื่อนำไปปรับใช้จริง'
      ],
      learnings: 'การออกแบบเพื่อผู้สูงอายุและทุกคน (Inclusive Design) ไม่ใช่แค่ฟีเจอร์เสริม แต่เป็นการสร้างคุณค่าชีวิตและความสุขที่จับต้องได้ให้กับทุกคนในครอบครัว'
    },
    figmaUrl: 'https://figma.com',
    liveDemoUrl: 'https://figma.com',
    featured: true,
    displayOrder: 4
  }
];

const profileData = {
  name: 'สายธาร อาจชมภู (Sai Tara)',
  roleTitle: 'UI & UX Designer & Developer',
  tagline: 'ออกแบบดิจิทัลโปรดักต์ที่ใช้งานง่าย เข้าถึงใจผู้ใช้ ขับเคลื่อนผลลัพธ์ทางธุรกิจ และร่วมพัฒนาระบบจริง ✨',
  location: 'กรุงเทพฯ, ประเทศไทย (พร้อมทำงานแบบ On-site / Remote / Hybrid)',
  availability: '🟢 พร้อมเปิดรับโอกาสใหม่และร่วมงานโปรเจกต์คุณภาพสูง',
  email: 'saitara.ux@gmail.com',
  phone: '+66 82 345 6789',
  resumeUrl: '/assets/resume-preview.html',
  stats: [
    { label: 'ประสบการณ์ทำงาน', value: '5+ ปี' },
    { label: 'สถานที่ทำงานปัจจุบัน', value: 'Security Pitch' },
    { label: 'เครื่องมือออกแบบหลัก', value: 'Figma' },
    { label: 'สถาบันการศึกษา', value: 'ปัญญาภิวัฒน์ (PIM)' }
  ],
  designPhilosophy: {
    title: 'แนวคิดการออกแบบที่ขับเคลื่อนธุรกิจและเข้าใจผู้ใช้งานจริง',
    description: 'เพราะประสบการณ์ผู้ใช้ที่ดีต้องมาพร้อมกับความคุ้มค่าทางธุรกิจ ฉันผสานทักษะด้านการวิจัย การออกแบบ UI ที่ประณีต และความเข้าใจในเชิงเทคนิคการพัฒนาระบบ เพื่อส่งมอบโปรดักต์ที่ตอบโจทย์ทุกคน'
  },
  experiences: [
    {
      period: '20 ม.ค. 2021 - ปัจจุบัน (5 ปี 9 เดือน)',
      role: 'UI & UX Designer & Developer',
      company: 'Security Pitch (งานประจำปัจจุบัน)',
      description: 'รับผิดชอบการออกแบบและพัฒนาส่วนต่อประสาน (UI) และประสบการณ์ผู้ใช้ (UX) สำหรับแพลตฟอร์มเทคโนโลยีและความปลอดภัย วางรากฐาน Design System และร่วมพัฒนา Front-End',
      skills: ['Figma (Core)', 'Adobe Illustrator (พื้นฐาน)', 'Adobe Premiere Pro (พื้นฐาน)', 'UI Development', 'Design System', 'Usability Testing']
    },
    {
      period: '19 พ.ย. 2018 - 2 ก.พ. 2019 (2 เดือน)',
      role: 'นักศึกษาฝึกงาน - Content Online',
      company: 'กองปราบปราม',
      description: 'ฝึกปฏิบัติงานด้านการจัดทำคอนเทนต์ออนไลน์ ผลิตสื่อประชาสัมพันธ์ และสร้างสรรค์ภาพกราฟิกเพื่อสื่อสารข้อมูลแก่ประชาชน',
      skills: ['Content Online', 'Graphic Design', 'Social Media']
    },
    {
      period: '20 พ.ค. 2018 - 3 ส.ค. 2018 (2 เดือน)',
      role: 'นักศึกษาฝึกงาน',
      company: 'มูลนิธิสานอนาคตการศึกษา คอนเน็กซ์อีดี (CONNEXT ED)',
      description: 'ฝึกประสบการณ์การดำเนินงานโครงการด้านการศึกษา ประสานงานสื่อสาร และร่วมจัดกิจกรรมพัฒนาคุณภาพการศึกษา',
      skills: ['Project Coordination', 'Communication', 'Documentation']
    },
    {
      period: '19 พ.ย. 2017 - 1 ก.พ. 2018 (2 เดือน)',
      role: 'นักศึกษาฝึกงาน',
      company: 'ThaiNews – ไทยนิวส์',
      description: 'ฝึกปฏิบัติการสร้างสรรค์เนื้อหาข่าวออนไลน์ การออกแบบภาพประกอบกราฟิก และการจัดการสื่อดิจิทัล',
      skills: ['Online News', 'Digital Media', 'Graphic Assets']
    },
    {
      period: '31 พ.ค. 2017 - 20 ส.ค. 2017 (2 เดือน)',
      role: 'พนักงานแคชเชียร์และบริการ (Cashier)',
      company: '7-ELEVEN',
      description: 'ฝึกทักษะการทำงานบริการหน้าร้านจริง การสื่อสาร และการจัดการระบบงานภายใต้การเรียนรู้แบบ Work-based Learning',
      skills: ['Customer Service', 'Cashier', 'Work-based Learning']
    }
  ],
  education: [
    {
      year: 'สำเร็จการศึกษา',
      title: 'สถาบันการจัดการปัญญาภิวัฒน์ (PIM)',
      institution: 'Panyapiwat Institute of Management (การเรียนรู้แบบ Work-based Learning)'
    }
  ],
  socials: {
    linkedin: 'https://linkedin.com/in/saitara-ux',
    dribbble: 'https://dribbble.com/saitara-design',
    behance: 'https://behance.net/saitara',
    github: 'https://github.com/saitara'
  }
};

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('Connected! Seeding friendly Thai data...');

    // Clear existing case studies & profile
    await CaseStudy.deleteMany({});
    await Profile.deleteMany({});

    // Insert Case Studies
    await CaseStudy.insertMany(caseStudiesData);
    console.log(`Successfully seeded ${caseStudiesData.length} UX Case Studies in Thai!`);

    // Insert Profile
    await Profile.create(profileData);
    console.log('Successfully seeded Profile data in Thai!');

    console.log('Seeding completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
