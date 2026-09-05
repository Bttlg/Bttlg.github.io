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
    slug: "octagon-exchange",
    name: { mn: "Octagon Exchange", en: "Octagon Exchange" },
    kind: "work",
    role: { mn: "Exchange API, банкны интеграц, frontend", en: "Exchange API, bank integrations, frontend" },
    period: { from: "2021-10", to: "2026-08" },
    summary: {
      mn: "Крипто валютын биржийн API, банкны орлого / зарлагын автоматжуулалт, арилжааны болон нэвтрэлтийн веб.",
      en: "Crypto exchange API, automated bank deposits and withdrawals, trading and identity web apps.",
    },
    highlights: {
      mn: [
        "Хаан, Голомт, ХХБ-тай банкны API интеграц ба cron сервисүүд",
        "Захиалга, хэтэвч, 2FA, WebSocket ханшийн урсгал",
        "trade.octagon.mn, id.octagon.mn Next.js апп-ууд",
      ],
      en: [
        "Bank API integrations and cron services for Khan, Golomt and TDB",
        "Orders, wallets, 2FA and WebSocket price streams",
        "Next.js apps for trade.octagon.mn and id.octagon.mn",
      ],
    },
    stack: ["Java", "Spring Boot", "MongoDB", "Redis", "WebSocket", "Next.js"],
    liveUrl: "https://trade.octagon.mn",
    featured: true,
  },
  {
    slug: "mnpost",
    name: { mn: "MnPost", en: "MnPost" },
    kind: "work",
    role: { mn: "Backend хөгжүүлэгч", en: "Backend developer" },
    period: { from: "2024-09", to: null },
    summary: {
      mn: "Шуудан, логистикийн үйлчилгээний backend ба удирдлагын веб.",
      en: "Backend and admin web app for a postal and logistics service.",
    },
    highlights: {
      mn: ["RabbitMQ мессеж урсгал, 2FA, удирдлагын API", "Next.js 13 удирдлагын frontend"],
      en: ["RabbitMQ messaging, 2FA and admin APIs", "Next.js 13 admin frontend"],
    },
    stack: ["Java 17", "Spring Boot", "MongoDB", "RabbitMQ", "Next.js"],
    liveUrl: "https://mnpost.mn",
    featured: false,
  },
  {
    slug: "yesh",
    name: { mn: "yesh.mn", en: "yesh.mn" },
    kind: "work",
    role: { mn: "Full-stack", en: "Full-stack" },
    period: { from: "2021-03", to: "2025-10" },
    summary: {
      mn: "ЭЕШ-д бэлтгэх онлайн сургалтын платформ: тест, даалгавар, багшийн систем, веб ба мобайл апп.",
      en: "Test-prep platform for the national entrance exam: tests, assignments, teacher tools, web and mobile apps.",
    },
    highlights: {
      mn: ["mobile-api, teacher-api Spring Boot сервисүүд", "Next.js веб ба React Native апп"],
      en: ["Spring Boot mobile-api and teacher-api services", "Next.js web and React Native app"],
    },
    stack: ["Java", "Spring Boot", "MongoDB", "Next.js", "React Native"],
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
    slug: "music-mixer",
    name: { mn: "Music Mixer", en: "Music Mixer" },
    kind: "personal",
    role: { mn: "Full-stack, ганцаараа", en: "Full-stack, solo" },
    // TODO(Тэргэл): Хугацаа ба repo URL (git түүх байхгүй).
    period: { from: "2026-07", to: "2026-07" },
    summary: {
      mn: "Нэг дуу оруулаад хоолой, бөмбөр, басс, хөгжим гэсэн 4 stem-д AI-аар салгаж, тус бүрийн дууг тохируулан синхрон тоглуулдаг веб апп.",
      en: "Upload a song, split it into vocals, drums, bass and other stems with AI, then mix and play them back in sync.",
    },
    highlights: {
      mn: ["Demucs (htdemucs) source separation, FastAPI async job", "Next.js + Web Audio API 4-stem синхрон миксер"],
      en: ["Demucs (htdemucs) source separation behind an async FastAPI job", "Next.js + Web Audio API four-stem synced mixer"],
    },
    stack: ["Python", "FastAPI", "Demucs", "Next.js", "Web Audio API"],
    featured: true,
  },
  {
    slug: "zamch",
    name: { mn: "Замч", en: "Zamch" },
    kind: "personal",
    role: { mn: "Full-stack, ганцаараа", en: "Full-stack, solo" },
    // TODO(Тэргэл): Live URL ба repo URL.
    period: { from: "2026-05", to: "2026-07" },
    summary: {
      mn: "Монголын аяллын замын мэдээлэл: явахаасаа өмнө замын нөхцөл, зогсоол, чиглэлээ мэдэх.",
      en: "Road-trip information for Mongolia: know the road conditions, stops and route before you leave.",
    },
    highlights: {
      mn: ["Next.js 16, Tailwind 4, Supabase", "Leaflet газрын зураг, замын дагуух буудлын тооцоолол"],
      en: ["Next.js 16, Tailwind 4, Supabase", "Leaflet maps with corridor-based stop lookup"],
    },
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Leaflet"],
    featured: false,
  },
  {
    slug: "smart-hr",
    name: { mn: "Smart HR", en: "Smart HR" },
    kind: "personal",
    role: { mn: "Мобайл апп", en: "Mobile app" },
    period: { from: "2026-08", to: "2026-08" },
    summary: {
      mn: "React Native дээр хийсэн хүний нөөцийн мобайл апп.",
      en: "Human-resources mobile app built with React Native.",
    },
    highlights: {
      mn: ["React Native 0.8x, TypeScript, react-navigation"],
      en: ["React Native 0.8x, TypeScript, react-navigation"],
    },
    stack: ["React Native", "TypeScript"],
    featured: false,
  },
  {
    slug: "clickup-telegram-bot",
    name: { mn: "ClickUp → Telegram бот", en: "ClickUp → Telegram bot" },
    kind: "personal",
    role: { mn: "Python бот", en: "Python bot" },
    // TODO(Тэргэл): Хугацааг шалгах.
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
    slug: "spring-boot-initializer",
    name: { mn: "spring-boot-initializer", en: "spring-boot-initializer" },
    kind: "personal",
    role: { mn: "Template", en: "Template" },
    // TODO(Тэргэл): Хугацааг шалгах.
    period: { from: "2022-01", to: "2022-01" },
    summary: {
      mn: "Шинэ Spring Boot төсөл эхлүүлэх зориулалттай эхлэлийн template.",
      en: "Starter template for bootstrapping new Spring Boot projects.",
    },
    highlights: {
      mn: ["Gradle, Spring Boot суурь бүтэц"],
      en: ["Gradle and Spring Boot base structure"],
    },
    stack: ["Java", "Spring Boot", "Gradle"],
    repoUrl: "https://github.com/Bttlg/spring-boot-initializer",
    featured: false,
  },
];
