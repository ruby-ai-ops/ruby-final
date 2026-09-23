export interface HomeFeatureCard {
  number: string;
  title: string;
  subtitle: string;
  accent: string;
  videoSrc: string;
}

export const HOME_FEATURE_VIDEO_SCALE = {
  resting: 1.16,
  hover: 1.24,
} as const;

export const HOME_FEATURE_CARDS: readonly HomeFeatureCard[] = [
  {
    number: "01",
    title: "Ruby knows how your company works.",
    subtitle:
      "Connects to all your tools and data, your stack becomes the agent's memory.",
    accent: "text-blue-500",
    videoSrc: "/static/landing/home/features/knows-your-company.mp4",
  },
  {
    number: "02",
    title: "Teams stay in sync.",
    subtitle:
      "Built for collaboration across departments, teams, and agents. Ruby is a team sport.",
    accent: "text-rose-500",
    videoSrc: "/static/landing/home/features/team-sport.mp4",
  },
  {
    number: "03",
    title: "Your company gets better at the work it repeats.",
    subtitle:
      "Value grows with every teammate that joins. Skills, knowledge, and expertise flow.",
    accent: "text-green-700",
    videoSrc: "/static/landing/home/features/compounds.mp4",
  },
];
