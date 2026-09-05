import type { Experience } from "./types";

export const experience: Experience[] = [
  {
    id: "egeree",
    // TODO(Тэргэл): Компанийн албан нэр (e-geree.mn-ийг эзэмшдэг ХХК) ба албан тушаал.
    company: { mn: "e-geree.mn", en: "e-geree.mn" },
    url: "https://e-geree.mn",
    role: { mn: "Full-stack хөгжүүлэгч (backend гол)", en: "Full-stack Developer (backend-focused)" },
    period: { from: "2023-03", to: null },
    summary: {
      mn: "Байгууллага, иргэдэд зориулсан цахим гэрээ байгуулах, цахим гарын үсгээр баталгаажуулах платформ. Backend микросервисүүд, төлбөр ба банкны интеграц, Next.js frontend-ийг хөгжүүлсэн.",
      en: "Platform for creating and digitally signing contracts for businesses and citizens. Built the backend microservices, payment and bank integrations, and the Next.js frontend.",
    },
    highlights: {
      mn: [
        "Auth, notification, PDF generator, SSO, 2FA гэх мэт 10+ Spring Boot микросервисийн архитектур ба хөгжүүлэлт (backend-д 2400+ commit)",
        "Цахим гарын үсэг, ХУР (XYP) төрийн мэдээлэл солилцооны систем, банкны төлбөрийн интеграц",
        "Next.js 13 → 16 шилжилт, OpenTelemetry ажиглалт нэвтрүүлсэн",
      ],
      en: [
        "Designed and built 10+ Spring Boot microservices: auth, notifications, PDF generation, SSO, 2FA and more (2,400+ backend commits)",
        "Integrated digital signatures, the XYP government data-exchange system and bank payments",
        "Led the Next.js 13 → 16 migration and introduced OpenTelemetry observability",
      ],
    },
    stack: ["Java 21", "Spring Boot", "Spring Cloud", "MongoDB", "Redis", "RabbitMQ", "AWS S3/SQS/SNS", "Azure Blob", "Next.js", "OpenTelemetry"],
  },
  {
    id: "octagon",
    // TODO(Тэргэл): Компанийн албан нэр, албан тушаал, дууссан огноо (эсвэл to: null).
    company: { mn: "Octagon", en: "Octagon" },
    url: "https://octagon.mn",
    role: { mn: "Full-stack хөгжүүлэгч", en: "Full-stack Developer" },
    period: { from: "2021-10", to: "2026-08" },
    summary: {
      mn: "Монголын крипто валютын бирж. Арилжааны API, банкны интеграц, хэрэглэгчийн таних систем болон веб frontend-үүдийг хөгжүүлсэн.",
      en: "Mongolian cryptocurrency exchange. Built the exchange API, bank integrations, the identity service and the web frontends.",
    },
    highlights: {
      mn: [
        "Хаан, Голомт, ХХБ банкуудтай орлого / зарлагын автомат интеграц",
        "Exchange API: захиалга, хэтэвч, 2FA, WebSocket бодит цагийн ханш",
        "trade.octagon.mn, id.octagon.mn, NFT маркетплэйс frontend-үүд (Next.js)",
      ],
      en: [
        "Automated deposit / withdrawal integrations with Khan, Golomt and TDB banks",
        "Exchange API: orders, wallets, 2FA and real-time WebSocket price feeds",
        "Next.js frontends for trade.octagon.mn, id.octagon.mn and an NFT marketplace",
      ],
    },
    stack: ["Java 17/21", "Spring Boot", "MongoDB", "Redis", "WebSocket", "Next.js", "Docker"],
  },
  {
    id: "mnpost",
    // TODO(Тэргэл): «MnPost» нь Монгол Шуудан мөн үү, албан нэр, албан тушаал.
    company: { mn: "MnPost", en: "MnPost" },
    url: "https://mnpost.mn",
    role: { mn: "Backend хөгжүүлэгч", en: "Backend Developer" },
    period: { from: "2024-09", to: null },
    summary: {
      mn: "Шуудан, логистикийн үйлчилгээний систем. Backend-ийн үндсэн хөгжүүлэгч, удирдлагын веб апп.",
      en: "Postal and logistics service system. Primary backend developer, plus the admin web app.",
    },
    highlights: {
      mn: [
        "Backend-ийн үндсэн хөгжүүлэгч (1000+ commit)",
        "RabbitMQ дээр суурилсан мессеж урсгал, 2FA, удирдлагын API",
        "Next.js 13 удирдлагын frontend",
      ],
      en: [
        "Primary backend contributor (1,000+ commits)",
        "RabbitMQ-based messaging, 2FA and admin APIs",
        "Next.js 13 admin frontend",
      ],
    },
    stack: ["Java 17", "Spring Boot", "MongoDB", "RabbitMQ", "Next.js"],
  },
  {
    id: "yesh",
    // TODO(Тэргэл): Компанийн албан нэр, албан тушаал, дууссан огноо.
    company: { mn: "yesh.mn", en: "yesh.mn" },
    url: "https://yesh.mn",
    role: { mn: "Full-stack хөгжүүлэгч", en: "Full-stack Developer" },
    period: { from: "2021-03", to: "2025-10" },
    summary: {
      mn: "ЭЕШ-д бэлтгэх онлайн сургалтын платформ: сурагч ба багшийн API, веб болон мобайл апп.",
      en: "Online test-prep platform for Mongolia's national university entrance exam: student and teacher APIs, web and mobile apps.",
    },
    highlights: {
      mn: [
        "mobile-api, teacher-api Spring Boot сервисүүд",
        "yesh.mn веб (Next.js) ба мобайл апп",
        "Тест, даалгавар, үнэлгээний модулиуд",
      ],
      en: [
        "Spring Boot services: mobile-api and teacher-api",
        "yesh.mn web app (Next.js) and the mobile app",
        "Test, assignment and grading modules",
      ],
    },
    stack: ["Java 21", "Spring Boot", "MongoDB", "Next.js", "React Native"],
  },
  {
    id: "smart-transport",
    // TODO(Тэргэл): Захиалагч / компанийн нэр.
    company: { mn: "Smart Transport", en: "Smart Transport" },
    role: { mn: "Мобайл хөгжүүлэгч", en: "Mobile Developer" },
    period: { from: "2024-04", to: "2024-07" },
    summary: {
      mn: "Нийтийн тээврийн мобайл апп (React Native).",
      en: "Public-transport mobile app built with React Native.",
    },
    highlights: {
      mn: ["React Native, react-navigation, Firebase push мэдэгдэл"],
      en: ["React Native, react-navigation, Firebase push notifications"],
    },
    stack: ["React Native", "TypeScript", "Firebase"],
  },
  {
    id: "poweredmn",
    // TODO(Тэргэл): PoweredMN гэж юу вэ, live URL (powered.mn мөн үү?), албан тушаал.
    company: { mn: "PoweredMN", en: "PoweredMN" },
    role: { mn: "Frontend хөгжүүлэгч", en: "Frontend Developer" },
    period: { from: "2022-05", to: "2023-01" },
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
