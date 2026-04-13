export type ProjectCategory = "Construction" | "Outreach" | "Education" | "Relief";

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  status: "Ongoing" | "Completed" | "Upcoming";
  year: string;
  lead: string;
  summary: string;
  body: string;
  goal: string | null;
  raised: string | null;
  images: string[];
}

export const projects: Project[] = [
  {
    slug: "sanctuary-expansion",
    title: "Sanctuary Expansion",
    category: "Construction",
    status: "Ongoing",
    year: "2024",
    lead: "Deacon Philip Okafor",
    summary: "Expanding our main auditorium to seat 2,000 worshippers and adding a dedicated children's wing.",
    body: "Our congregation has grown beyond the capacity of our current building. This project will double the seating in the main auditorium, add a dedicated children's wing with four classrooms, and upgrade our sound and lighting systems. Construction began in January 2024 and is expected to be completed by December 2025.",
    goal: "₦120,000,000",
    raised: "₦74,000,000",
    images: [
      "/church.jpeg",
      "/church1.jpeg",
      "/church2.jpeg",
    ],
  },
  {
    slug: "rumuola-feeding-program",
    title: "Rumuola Feeding Program",
    category: "Outreach",
    status: "Ongoing",
    year: "2022",
    lead: "Sis. Grace Nwosu",
    summary: "Weekly hot meals for over 300 families in the Rumuola community every Saturday morning.",
    body: "Every Saturday at 9 AM, our volunteers prepare and distribute hot meals to families in need across the Rumuola neighbourhood. What started as a pandemic response in 2020 has grown into one of our most consistent outreach efforts. We serve over 300 families weekly and have distributed more than 50,000 meals to date.",
    goal: null,
    raised: null,
    images: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80",
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80",
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&q=80",
    ],
  },
  {
    slug: "scholarship-fund-2024",
    title: "Scholarship Fund 2024",
    category: "Education",
    status: "Completed",
    year: "2024",
    lead: "Pastor Ruth Adeyemi",
    summary: "Full university scholarships awarded to 12 young people from our congregation and the wider community.",
    body: "In 2024, we awarded full scholarships covering tuition, accommodation, and books to 12 students — 8 from our congregation and 4 from the wider Port Harcourt community. Recipients were selected based on academic merit and financial need. We are committed to investing in the next generation of leaders.",
    goal: "₦18,000,000",
    raised: "₦18,000,000",
    images: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80",
    ],
  },
  {
    slug: "flood-relief-2023",
    title: "Flood Relief Response 2023",
    category: "Relief",
    status: "Completed",
    year: "2023",
    lead: "Bro. Emeka Obi",
    summary: "Emergency relief for over 500 families displaced by the 2023 Rivers State flooding.",
    body: "When flooding devastated parts of Rivers State in October 2023, our church mobilised within 48 hours. We distributed food packs, clean water, clothing, and temporary shelter materials to over 500 displaced families across three local government areas. This project was funded entirely by the generosity of our congregation and partner churches.",
    goal: "₦25,000,000",
    raised: "₦27,400,000",
    images: [
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1200&q=80",
      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&q=80",
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=80",
    ],
  },
  {
    slug: "prison-bible-distribution",
    title: "Prison Bible Distribution",
    category: "Outreach",
    status: "Completed",
    year: "2023",
    lead: "Deacon Samuel Eze",
    summary: "Distributing 1,000 Bibles to inmates across five correctional facilities in Rivers State.",
    body: "Working alongside our Prison Outreach Ministry, we sourced and distributed 1,000 Bibles to inmates across five correctional facilities in Rivers State. Each Bible was inscribed with a personal message of hope. Many recipients have since written back to share how the Word has transformed their time of incarceration.",
    goal: "₦4,500,000",
    raised: "₦4,500,000",
    images: [
      "https://images.unsplash.com/photo-1472905981516-5ac09f35b7f4?w=1200&q=80",
      "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=1200&q=80",
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&q=80",
    ],
  },
  {
    slug: "youth-skills-centre",
    title: "Youth Skills Centre",
    category: "Education",
    status: "Upcoming",
    year: "2025",
    lead: "Bro. Chidi Nkemdirim",
    summary: "A vocational training centre for young people aged 16–30, offering skills in tech, trades, and entrepreneurship.",
    body: "Launching in Q2 2025, the Youth Skills Centre will offer free and subsidised training in software development, electrical installation, fashion design, and small business management. The centre will be housed in our new building and is expected to train 200 young people in its first year.",
    goal: "₦35,000,000",
    raised: "₦8,200,000",
    images: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
    ],
  },
];
