import type { SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  {
    id: "backend",
    label: { mn: "Backend", en: "Backend" },
    items: ["Java", "Spring Boot", "Spring Cloud", "Spring Security / JWT", "MongoDB", "Redis", "RabbitMQ", "gRPC", "WebSocket", "REST / OpenAPI", "MapStruct", "Feign", "Resilience4j"],
  },
  {
    id: "frontend",
    label: { mn: "Frontend", en: "Frontend" },
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "React Query", "react-hook-form", "socket.io", "Chart.js / Recharts", "next-intl"],
  },
  {
    id: "mobile",
    label: { mn: "Мобайл", en: "Mobile" },
    items: ["React Native", "Swift / SwiftUI", "MapKit", "Firebase"],
  },
  {
    id: "infra",
    label: { mn: "Cloud / Infra", en: "Cloud / Infra" },
    items: ["AWS (S3, SQS, SNS)", "Azure Blob", "OpenTelemetry"],
  },
  {
    id: "tools",
    label: { mn: "Бусад", en: "Other" },
    items: ["Git", "Gradle", "Python"],
  },
];
