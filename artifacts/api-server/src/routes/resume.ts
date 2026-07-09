import { Router, type IRouter } from "express";
import { GetResumeResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const resumeData = {
  name: "P. Ravi Kumar",
  headline: "Computer Science Engineering Graduate",
  contact: {
    phone: "6304480017",
    email: "p.bunny8133@gmail.com",
    location: "Hyderabad, Telangana",
    github: "https://github.com/ravikumar01321",
  },
  summary:
    "Computer Science undergraduate with hands-on training in software development and a track record of building full working systems, from secure banking platforms to AI-driven proctoring tools. Strong fundamentals in programming, databases, and problem-solving, with a drive to build practical, real-world software.",
  workExperience: [
    {
      title: "Student Trainee",
      company: "NSIC Technical Services Centre, ECIL",
      location: "Hyderabad, Telangana",
      dates: "2024 - 2025",
      bullets: [
        "Completed hands-on industrial training in software development, covering the full lifecycle from design to implementation of real-world applications.",
        "Worked with industry-standard tools and technologies to build and debug academic and practical projects under professional guidance.",
        "Strengthened core programming, problem-solving, and debugging skills through structured practical sessions.",
      ],
    },
  ],
  projects: [
    {
      name: "Banking Management System",
      stack: "Java, SQL, DBMS",
      url: "github.com/ravikumar01321",
      description:
        "Built a secure banking application supporting account management, deposits, withdrawals, and transaction history, backed by a relational database design for data integrity and auditability.",
    },
    {
      name: "AI-Based Exam Proctoring System",
      stack: "Python, OpenCV, Machine Learning",
      url: "github.com/ravikumar01321",
      description:
        "Developed an AI-powered proctoring tool that uses real-time computer vision to detect suspicious activity during online exams, helping ensure exam integrity without manual supervision.",
    },
  ],
  skills: [
    { category: "Programming", items: "Java, Python, C" },
    { category: "Web", items: "HTML, CSS, JavaScript" },
    { category: "Database", items: "SQL, DBMS" },
    { category: "Core CS", items: "Data Structures & Algorithms, OOP, Operating Systems, Computer Networks" },
    { category: "Tools", items: "Git, GitHub, VS Code" },
  ],
  education: [
    {
      degree: "B.Tech, Computer Science & Engineering",
      school: "Kommuri Pratap Reddy Institute of Technology",
      location: "Hyderabad, Telangana",
      dates: "2025 - Present",
      detail: "",
    },
    {
      degree: "Diploma in Computer Science & Engineering",
      school: "TKR College of Engineering & Technology",
      location: "Hyderabad, Telangana",
      dates: "Passed Out: 2025",
      detail: "CGPA: 7.77",
    },
    {
      degree: "Schooling",
      school: "Nalanda High School, B.N. Reddy",
      location: "Hyderabad, Telangana",
      dates: "",
      detail: "",
    },
  ],
};

router.get("/resume", (_req, res) => {
  res.json(GetResumeResponse.parse(resumeData));
});

export default router;
