import type { Profile } from "./types";

export const profile: Profile = {
  name: { mn: "Баттулга Батжаргал", en: "Battulga Batjargal" },
  title: { mn: "Full-stack хөгжүүлэгч", en: "Full-stack Developer" },
  tagline: {
    mn: "Финтек, цахим гэрээ, шуудан логистикийн системүүдийг Java / Spring Boot backend-ээс Next.js веб, мобайл апп хүртэл бүтнээр нь хийдэг.",
    en: "I build fintech, e-contract and postal-logistics systems end to end: from Java / Spring Boot backends to Next.js web and mobile apps.",
  },
  location: { mn: "Улаанбаатар, Монгол", en: "Ulaanbaatar, Mongolia" },
  email: "btjrglbttlg@gmail.com",
  github: "https://github.com/Bttlg",
  linkedin: "https://www.linkedin.com/in/battulga-batjargal-858657358/",
  about: {
    mn: [
      "2022 оноос хойш Монголын финтек, цахим үйлчилгээний салбарт full-stack хөгжүүлэгчээр ажиллаж байна. Крипто биржийн веб бүтээгдэхүүнүүд, цахим гэрээний платформ, шуудан логистикийн системүүдийн backend болон frontend-ийг хөгжүүлсэн.",
      "Гол хүч нь Java / Spring Boot микросервис, MongoDB, Redis, RabbitMQ дээр суурилсан backend. Түүн дээрээ Next.js / React frontend болон React Native, SwiftUI мобайл апп хөгжүүлдэг.",
      "Чөлөөт цагаараа өөрт хэрэгтэй жижиг бүтээгдэхүүн хийх дуртай: Улаанбаатарын автобусны бодит цагийн iOS апп, дууг stem-үүдэд салгаж миксддэг веб апп гэх мэт.",
    ],
    en: [
      "Since 2022 I have worked as a full-stack developer in Mongolia's fintech and digital-services sector, building the backends and frontends of a crypto exchange's web products, an e-contract platform and postal-logistics systems.",
      "My core is Java / Spring Boot microservices on MongoDB, Redis and RabbitMQ. On top of that I build Next.js / React frontends and React Native or SwiftUI mobile apps.",
      "In my spare time I like building small products I need myself: a real-time iOS app for Ulaanbaatar buses, a web app that splits songs into stems and mixes them, and more.",
    ],
  },
  facts: [
    { label: { mn: "Байршил", en: "Location" }, value: { mn: "Улаанбаатар", en: "Ulaanbaatar" } },
    // TODO(Баттулга): Одоо голчлон юу хийж байгаагаа шалгах.
    { label: { mn: "Одоо", en: "Currently" }, value: { mn: "e-geree.mn, MnPost", en: "e-geree.mn, MnPost" } },
    { label: { mn: "Хэл", en: "Languages" }, value: { mn: "Монгол, Англи", en: "Mongolian, English" } },
  ],
};
