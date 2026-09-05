import type { Experience } from "./types";

export const experience: Experience[] = [
  {
    id: "egeree",
    // TODO(Баттулга): Компанийн албан нэр (e-geree.mn-ийг эзэмшдэг ХХК) ба албан тушаал.
    company: { mn: "e-geree.mn", en: "e-geree.mn" },
    url: "https://e-geree.mn",
    role: { mn: "Full-stack хөгжүүлэгч (backend гол)", en: "Full-stack Developer (backend-focused)" },
    period: { from: "2023-03", to: null },
    summary: {
      mn: "Байгууллага, иргэдэд зориулсан цахим гэрээ байгуулах, цахим гарын үсгээр баталгаажуулах платформ. Backend микросервисүүд, төлбөр ба банкны интеграц, Next.js frontend-ийн үндсэн хөгжүүлэгч.",
      en: "Platform for creating and digitally signing contracts for businesses and citizens. Primary developer of the backend microservices, payment and bank integrations, and the Next.js frontend.",
    },
    highlights: {
      mn: [
        "Auth, notification, PDF generator, SSO, 2FA гэх мэт 10+ Spring Boot микросервисийн архитектур ба хөгжүүлэлт (backend-д 2100+ commit)",
        "Цахим гарын үсэг, ХУР (XYP) төрийн мэдээлэл солилцооны систем, банкны төлбөрийн интеграц",
        "e-geree.mn веб frontend-ийг ганцаараа хөгжүүлж (1000+ commit), Next.js 13 → 16 шилжилт, OpenTelemetry ажиглалт нэвтрүүлсэн",
      ],
      en: [
        "Designed and built 10+ Spring Boot microservices: auth, notifications, PDF generation, SSO, 2FA and more (2,100+ backend commits)",
        "Integrated digital signatures, the XYP government data-exchange system and bank payments",
        "Sole developer of the e-geree.mn web frontend (1,000+ commits); led the Next.js 13 → 16 migration and introduced OpenTelemetry observability",
      ],
    },
    stack: ["Java 21", "Spring Boot", "Spring Cloud", "MongoDB", "Redis", "RabbitMQ", "AWS S3/SQS/SNS", "Azure Blob", "Next.js", "OpenTelemetry"],
  },
  {
    id: "octagon",
    // TODO(Баттулга): Компанийн албан нэр, албан тушаал, дууссан огноо (эсвэл to: null).
    company: { mn: "Octagon", en: "Octagon" },
    url: "https://octagon.mn",
    role: { mn: "Frontend → full-stack хөгжүүлэгч", en: "Frontend → Full-stack Developer" },
    period: { from: "2022-04", to: "2026-08" },
    summary: {
      mn: "Монголын крипто валютын бирж. NFT маркетплэйс, хэрэглэгчийн таних систем, арилжааны веб frontend-үүдийг хөгжүүлж, 2025 оноос exchange API-ийн backend хөгжүүлэлтэд оролцсон.",
      en: "Mongolian cryptocurrency exchange. Built the NFT marketplace, identity and trading web frontends, and from 2025 contributed to the exchange API backend.",
    },
    highlights: {
      mn: [
        "nft.octagon.mn NFT маркетплэйс, id.octagon.mn нэвтрэлт, trade.octagon.mn арилжааны Next.js апп-ууд",
        "Exchange API (Java 21, Spring Boot, MongoDB) дээр 100+ commit: захиалга, хэтэвч, аюулгүй байдлын модулиуд",
        "Docker дээр суурилсан staging / production deploy урсгал",
      ],
      en: [
        "Next.js apps: nft.octagon.mn NFT marketplace, id.octagon.mn identity, trade.octagon.mn trading",
        "100+ commits to the exchange API (Java 21, Spring Boot, MongoDB): orders, wallets, security modules",
        "Docker-based staging / production deployment flow",
      ],
    },
    stack: ["Next.js", "React", "TypeScript", "Java 21", "Spring Boot", "MongoDB", "Docker"],
  },
  {
    id: "mnpost",
    // TODO(Баттулга): «MnPost» нь Монгол Шуудан мөн үү, албан нэр, албан тушаал.
    company: { mn: "MnPost", en: "MnPost" },
    url: "https://mnpost.mn",
    role: { mn: "Full-stack хөгжүүлэгч", en: "Full-stack Developer" },
    period: { from: "2025-02", to: null },
    summary: {
      mn: "Шуудан, логистикийн үйлчилгээний систем. Backend сервисүүд ба удирдлагын веб апп-ын хөгжүүлэлт.",
      en: "Postal and logistics service system. Development of backend services and the admin web app.",
    },
    highlights: {
      mn: [
        "Spring Boot backend: RabbitMQ мессеж урсгал, 2FA, удирдлагын API (170+ commit)",
        "Next.js 13 удирдлагын frontend (160+ commit)",
      ],
      en: [
        "Spring Boot backend: RabbitMQ messaging, 2FA and admin APIs (170+ commits)",
        "Next.js 13 admin frontend (160+ commits)",
      ],
    },
    stack: ["Java 17", "Spring Boot", "MongoDB", "RabbitMQ", "Next.js"],
  },
  {
    id: "yesh",
    // TODO(Баттулга): Компанийн албан нэр, албан тушаал, дууссан огноо.
    company: { mn: "yesh.mn", en: "yesh.mn" },
    url: "https://yesh.mn",
    role: { mn: "Frontend хөгжүүлэгч", en: "Frontend Developer" },
    period: { from: "2022-06", to: "2025-05" },
    summary: {
      mn: "ЭЕШ-д бэлтгэх онлайн сургалтын платформ. Веб frontend болон backend API-д оролцсон.",
      en: "Online test-prep platform for Mongolia's national university entrance exam. Worked on the web frontend and contributed to the backend APIs.",
    },
    highlights: {
      mn: ["yesh.mn веб (Next.js 12, SEO тохиргоо)", "mobile-api, teacher-api Spring Boot сервисүүдэд хувь нэмэр"],
      en: ["yesh.mn web app (Next.js 12 with SEO setup)", "Contributions to the mobile-api and teacher-api Spring Boot services"],
    },
    stack: ["Next.js", "React", "Java", "Spring Boot", "MongoDB"],
  },
  {
    id: "poweredmn",
    // TODO(Баттулга): PoweredMN гэж юу вэ, live URL (powered.mn мөн үү?), албан тушаал.
    company: { mn: "PoweredMN", en: "PoweredMN" },
    role: { mn: "Frontend хөгжүүлэгч", en: "Frontend Developer" },
    period: { from: "2022-06", to: "2023-01" },
    summary: {
      mn: "Next.js дээр хийсэн вебсайт.",
      en: "Website built with Next.js.",
    },
    highlights: {
      mn: ["Next.js 13, SEO тохиргоо"],
      en: ["Next.js 13 with SEO setup"],
    },
    stack: ["Next.js", "React"],
  },
];
