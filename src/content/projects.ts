import type { Project } from "./types";

export const projects: Project[] = [
  // ---------- Ажлын ----------
  {
    slug: "e-geree",
    name: { mn: "e-geree.mn", en: "e-geree.mn" },
    kind: "work",
    role: { mn: "Backend архитектур, full-stack", en: "Backend architecture, full-stack" },
    period: { from: "2023-03", to: null },
    summary: {
      mn: "Цахим гэрээ байгуулах, цахим гарын үсгээр баталгаажуулах платформ. Auth, notification, PDF, SSO, 2FA микросервисүүд, ХУР ба банкны интеграц, Next.js frontend.",
      en: "E-contract platform with digital signatures. Auth, notification, PDF, SSO and 2FA microservices, XYP and bank integrations, Next.js frontend.",
    },
    highlights: {
      mn: [
        "Spring Cloud микросервисүүд, RabbitMQ, Redis, AWS SQS/SNS дээр асинхрон урсгал",
        "PDF үүсгэх, цахим гарын үсэг, гэрээний callback-ийн middleware-үүд",
        "Next.js 16, OpenTelemetry-тэй frontend",
      ],
      en: [
        "Spring Cloud microservices with async flows on RabbitMQ, Redis and AWS SQS/SNS",
        "Middleware for PDF generation, digital signatures and contract callbacks",
        "Next.js 16 frontend instrumented with OpenTelemetry",
      ],
    },
    stack: ["Java 21", "Spring Boot", "MongoDB", "Redis", "RabbitMQ", "AWS", "Next.js"],
    liveUrl: "https://e-geree.mn",
    featured: true,
  },
  {
    slug: "octagon",
    name: { mn: "Octagon веб бүтээгдэхүүнүүд", en: "Octagon web products" },
    kind: "work",
    role: { mn: "Frontend, exchange API", en: "Frontend, exchange API" },
    period: { from: "2022-04", to: "2026-08" },
    summary: {
      mn: "Крипто биржийн NFT маркетплэйс, нэвтрэлтийн систем, арилжааны веб апп-ууд; дараа нь exchange API-ийн backend модулиуд.",
      en: "Crypto exchange NFT marketplace, identity and trading web apps; later, exchange API backend modules.",
    },
    highlights: {
      mn: [
        "nft.octagon.mn, id.octagon.mn, trade.octagon.mn — Next.js, i18n, real-time ханш",
        "Exchange API: захиалга, хэтэвч, аюулгүй байдлын модулиуд (Java 21, Spring Boot)",
      ],
      en: [
        "nft.octagon.mn, id.octagon.mn, trade.octagon.mn — Next.js, i18n, real-time prices",
        "Exchange API: orders, wallets, security modules (Java 21, Spring Boot)",
      ],
    },
    stack: ["Next.js", "TypeScript", "Java", "Spring Boot", "MongoDB"],
    liveUrl: "https://octagon.mn/",
    featured: true,
  },
  {
    slug: "yesh",
    name: { mn: "yesh.mn", en: "yesh.mn" },
    kind: "work",
    role: { mn: "Frontend", en: "Frontend" },
    period: { from: "2022-06", to: "2025-05" },
    summary: {
      mn: "ЭЕШ-д бэлтгэх онлайн сургалтын платформын веб frontend; backend API-д хувь нэмэр.",
      en: "Web frontend of a test-prep platform for the national entrance exam; contributions to the backend APIs.",
    },
    highlights: {
      mn: ["Next.js 12 веб, SEO тохиргоо", "mobile-api, teacher-api Spring Boot сервисүүд"],
      en: ["Next.js 12 web app with SEO setup", "mobile-api and teacher-api Spring Boot services"],
    },
    stack: ["Next.js", "React", "Java", "Spring Boot", "MongoDB"],
    liveUrl: "https://yesh.mn",
    featured: false,
  },

  // ---------- Хувийн / OSS ----------
  {
    slug: "ub-bus-tracker",
    name: { mn: "УБ Автобус", en: "UB Bus" },
    kind: "personal",
    role: { mn: "iOS апп, ганцаараа", en: "iOS app, solo" },
    period: { from: "2026-08", to: "2026-08" },
    summary: {
      mn: "Улаанбаатарын нийтийн тээврийн бодит цагийн iOS апп: ойролцоох буудлууд, автобус хэдэн минутын дараа ирэх, газрын зураг дээр хөдөлж буй автобус.",
      en: "Real-time iOS app for Ulaanbaatar public transport: nearby stops, minutes until arrival, buses moving live on the map.",
    },
    highlights: {
      mn: ["SwiftUI + MapKit, GPS-ээр хамгийн ойрын 5 буудал", "Чиглэл, буудлаар хайх, дуртай чиглэл хадгалах"],
      en: ["SwiftUI + MapKit, nearest 5 stops via GPS", "Search by route or stop, save favourite routes"],
    },
    stack: ["Swift", "SwiftUI", "MapKit"],
    featured: true,
  },
  {
    slug: "clickup-telegram-bot",
    name: { mn: "ClickUp → Telegram бот", en: "ClickUp → Telegram bot" },
    kind: "personal",
    role: { mn: "Python бот", en: "Python bot" },
    period: { from: "2026-05", to: "2026-05" },
    summary: {
      mn: "ClickUp-ийн таскийн өөрчлөлтийг Telegram руу мэдэгдэл болгон илгээдэг бот.",
      en: "Bot that forwards ClickUp task changes to Telegram as notifications.",
    },
    highlights: {
      mn: ["ClickUp API, Telegram Bot API"],
      en: ["ClickUp API, Telegram Bot API"],
    },
    stack: ["Python"],
    repoUrl: "https://github.com/Bttlg/ClickUp-Telegram-Bot",
    featured: false,
  },
  {
    slug: "data-transfer",
    name: { mn: "Data-transfer", en: "Data-transfer" },
    kind: "personal",
    role: { mn: "Frontend, ганцаараа", en: "Frontend, solo" },
    // TODO(Баттулга): Тайлбарыг шалгах (repo-ийн хамаарлаас P2P файл дамжуулалт гэж дүгнэсэн).
    period: { from: "2022-09", to: "2022-09" },
    summary: {
      mn: "Браузер хооронд серверт хадгалахгүйгээр P2P (WebRTC) файл дамжуулдаг веб апп; QR кодоор холбогдоно.",
      en: "Browser-to-browser P2P (WebRTC) file transfer web app with no server-side storage; peers connect via QR code.",
    },
    highlights: {
      mn: ["Vue.js, p2pt, simple-peer-files, StreamSaver"],
      en: ["Vue.js, p2pt, simple-peer-files, StreamSaver"],
    },
    stack: ["Vue.js", "WebRTC", "JavaScript"],
    repoUrl: "https://github.com/Bttlg/Data-transfer",
    featured: false,
  },
];
