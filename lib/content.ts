export const site = {
  name: "Jacob Binala",
  role: "Web Developer & IT Specialist",
  tagline:
    "Web developer and IT specialist learning to blend technology and usability through hands-on experience.",
  nav: [
    { label: "Work", href: "#work" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
  ],  
  email: "jacobmbinala@gmail.com",
  phone: "5196142946",
  phoneDisplay: "(519) 614-2946",
  links: {
    instagram: "https://www.instagram.com/atjb_design/",
    linkedin: "https://www.linkedin.com/in/adrianteojacobbinala/",
    github: "https://github.com/jacobbinala",
  },
} as const;

export const about = {
  title: "About",
  body: "Versatile IT professional and Web Development graduate with a Bachelor of Science in Information Technology (Cum Laude) and a Fanshawe College diploma (GPA 3.98/4.0). Backed by hands-on experience in hardware troubleshooting, network configuration, and full-stack web development. Passionate about maintaining reliable IT infrastructure while building accessible, high-performance digital experiences."
} as const;

export const skills = {
  title: "Skills",
  groups: [
    {
      label: "Languages & Frameworks",
      items: ["HTML", "CSS", "JavaScript/TypeScript", "React", "Next.js", "PHP", "MySQL"],
    },
    {
      label: "IT Support & Networking",
      items: ["Hardware Troubleshooting", "Software Deployment", "Network Configuration", "System Administration", "Technical Support"],
    },
    {
      label: "Databases",
      items: ["MySQL", "Firebase Firestore"],
    },
    {
      label: "CMS",
      items: ["WordPress", "Content management systems"],
    },
    {
      label: "Design",
      items: ["Adobe Photoshop", "Adobe Illustrator", "Figma"],
    },
    {
      label: "Practices",
      items: ["UI/UX principles", "Responsive design", "Web accessibility basics","IT Helpdesk Workflows"],
    },
    {
      label: "Tools",
      items: ["Git", "GitHub", "VS Code", "Browser DevTools", "AI tools"],
    },
  ],
} as const;

export type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  title: string;
  year: string;
  href?: string;
  hrefLabel?: string;
  bullets: string[];
  images?: ProjectImage[];
};

export const projects = {
  title: "Work",
  items: [
    {
      title: "Harbor — Personal Budget Tracker",
      year: "2026",
      href: "https://harborbudgettracker.vercel.app/",
      hrefLabel: "Live demo",
      bullets: [
        "Built a local-first budget tracker with React, Vite, and Recharts, no backend, all data persists in the browser",
        "Dashboard with income, expenses, and net savings, category donut chart, and six-month cashflow visualization",
        "Full transaction management with search, filters, custom categories, month navigation, and dark mode",
      ],
      images: [
        {
          src: "/images/dashboard.png",
          alt: "Harbor dashboard",
        },
      ],
    },
    
    {
      title: "Ride-N-Go Transport Website",
      year: "2025",
      href: "https://ride-n-go.ca/",
      hrefLabel: "ride-n-go.ca",
      bullets: [
        "Designed and developed a full business website for a transport company using Next.js",
        "Handled all aspects including UI design, development, and deployment",
        "Collaborated directly with the client to meet business requirements and branding goals",
      ],
      images: [
        {
          src: "/images/ride-n-go-website/home.png",
          alt: "Ride-N-Go website home page",
        },
        {
          src: "/images/ride-n-go-website/about.png",
          alt: "Ride-N-Go website about page",
        },
        {
          src: "/images/ride-n-go-website/contact.png",
          alt: "Ride-N-Go website contact page",
        },
      ],
    },
    {
      title: "Ride-N-Go Database Management System",
      year: "2025",
      hrefLabel: "Project details",
      bullets: [
        "Designed and built a web-based database management system using React and Firebase Firestore",
        "Enabled the client to manage business records, bookings, and operational data through a custom admin interface",
        "Implemented real-time data synchronization using Firestore's cloud-based architecture",
      ],
      images: [
        {
          src: "/images/ride-n-go-dms/bookings.png",
          alt: "Ride-N-Go DMS bookings list view",
        },
        {
          src: "/images/ride-n-go-dms/booking.png",
          alt: "Ride-N-Go DMS booking detail view",
        },
        {
          src: "/images/ride-n-go-dms/calendar.png",
          alt: "Ride-N-Go DMS calendar view",
        },
        {
          src: "/images/ride-n-go-dms/settings.png",
          alt: "Ride-N-Go DMS settings view",
        },
      ],
    },
    {
      title: "Portfolio & Graphic Design Projects",
      year: "2023–2025",
      href: "https://jacobmbinala.myportfolio.com/",
      hrefLabel: "Design portfolio",
      bullets: [
        "Created various graphic design works including logo design, poster design, and website mockups",
        "Portfolio of design work available for review",
      ],
      images:[
        {
          src: "/images/graphic-design/image1.png",
          alt: "Graphic design image 1",
        },
        {
          src: "/images/graphic-design/image2.png",
          alt: "Graphic design image 2",
        },
        {
          src: "/images/graphic-design/image3.png",
          alt: "Graphic design image 3",
        },
        {
          src: "/images/graphic-design/image4.png",
          alt: "Graphic design image 4",
        },
        {
          src: "/images/graphic-design/image5.png",
          alt: "Graphic design image 5",
        },
      ]
    },
  ] satisfies Project[],
} as const;

export const experience = {
  title: "Experience",
  items: [
    {
      role: "Web Developer / Website Manager",
      org: "Ride-N-Go Transport",
      dates: "2025",
      bullets: [
        "Designed, developed, and maintained the official company website (Next.js) and a database management system (React + Firebase Firestore) to streamline business operations",
        "Managed site updates, optimized web performance, and ensured database stability and data integrity",
        "Built responsive layouts and interactive features to improve user engagement and access to transport services",
      ],
    },
    {
      role: "IT Support & Graphic Design Intern",
      org: "Mariano Marcos State University, Philippines",
      dates: "Dec 2023 – Nov 2024",
      bullets: [
        "Provided IT support and technical assistance to university staff and departments",
        "Assisted in maintaining and troubleshooting computer systems, software, and network equipment",
        "Developed and managed digital assets including promotional materials, posters, and layouts using Adobe Photoshop and Illustrator",
        "Applied web development and IT knowledge to support departmental digital initiatives",
        "Collaborated with administrative staff to streamline digital workflows and improve operational efficiency",
      ],
    },
  ],
} as const;

export const education = {
  title: "Education",
  items: [
    {
      school: "Fanshawe College, London, ON",
      credential:
        "Web Development and Internet Applications (IWD2) — Post-Secondary Diploma",
      dates: "Jan 2025 – Apr 2026",
      details: [
        "Program GPA: 3.98 / 4.0",
        "Relevant coursework: Front-End Development, Back-End Development, UI/UX Design, Database Management, CMS Development",
      ],
    },
    {
      school: "Mariano Marcos State University, Philippines",
      credential: "Bachelor of Science in Information Technology",
      dates: "Jun 2019 – Jul 2023",
      details: ["Graduated Cum Laude"],
    },
  ],
} as const;

export const languages = {
  title: "Languages",
  body: "CELPIP General (March 2026): Listening 11 · Reading 9 · Writing 8 · Speaking 8 · Average 9 (CLB 9)",
} as const;
