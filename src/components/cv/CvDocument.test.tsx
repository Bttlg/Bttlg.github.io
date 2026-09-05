import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CvDocument, defaultCvData } from "./CvDocument";
import { ui, type Education } from "@/content";

const sampleEducation: Education = {
  school: { mn: "МУИС", en: "NUM" },
  degree: { mn: "Бакалавр", en: "B.Sc." },
  period: { from: "2017-09", to: "2021-06" },
};

describe("CvDocument", () => {
  it("renders header, summary, experience, projects and skills", () => {
    render(<CvDocument lang="en" />);
    expect(screen.getByRole("heading", { level: 1, name: defaultCvData.profile.name.en })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: ui.en.cv.summary })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: ui.en.sections.experience })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: ui.en.cv.featuredProjects })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: ui.en.sections.skills })).toBeInTheDocument();
  });

  it("hides education when empty and shows it when present", () => {
    const { unmount } = render(<CvDocument lang="mn" data={{ ...defaultCvData, education: [] }} />);
    expect(screen.queryByRole("heading", { name: ui.mn.sections.education })).toBeNull();
    unmount();

    render(<CvDocument lang="mn" data={{ ...defaultCvData, education: [sampleEducation] }} />);
    expect(screen.getByRole("heading", { name: ui.mn.sections.education })).toBeInTheDocument();
    expect(screen.getByText("МУИС")).toBeInTheDocument();
    expect(screen.getByText("2017.09 – 2021.06")).toBeInTheDocument();
  });

  it("lists featured projects before the rest", () => {
    render(<CvDocument lang="en" />);
    const names = screen.getAllByTestId("cv-project").map((el) => el.textContent);
    const expected = [...defaultCvData.projects]
      .sort((a, b) => Number(b.featured) - Number(a.featured))
      .slice(0, 6)
      .map((p) => p.name.en);
    expect(names).toEqual(expected);
  });
});
