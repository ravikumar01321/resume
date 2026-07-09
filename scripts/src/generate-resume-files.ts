/**
 * Generates a one-page PDF + DOCX resume plus a resume-data.json consumed by
 * the web preview, all from a single source of truth (getResumeData()).
 */
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
} from "docx";
import fs from "fs";
import path from "path";

// --- Interfaces ---
interface ResumeRole {
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
}

interface ResumeProject {
  name: string;
  stack: string;
  url: string;
  description: string;
}

interface ResumeEducation {
  degree: string;
  school: string;
  location: string;
  dates: string;
  detail: string;
}

interface Spacing {
  sectionGap: number;
  roleGap: number;
  bulletGap: number;
  lineHeight: number;
  bodyFontSize: number;
  headlineFontSize: number;
}

interface ResumeData {
  name: string;
  headline: string;
  contact: { phone: string; email: string; location: string; github: string };
  summary: string;
  workExperience: ResumeRole[];
  projects: ResumeProject[];
  skills: { category: string; items: string }[];
  education: ResumeEducation[];
  spacing: Spacing;
}

// --- Constants ---
const PAGE_W = 612; // US Letter width in points
const PAGE_H = 792; // US Letter height in points
const MARGIN = 36; // 0.5 inch margins
const CONTENT_W = PAGE_W - 2 * MARGIN;
const TARGET_Y = PAGE_H - MARGIN;

const BASE_SPACING: Spacing = {
  sectionGap: 10,
  roleGap: 5,
  bulletGap: 2,
  lineHeight: 13,
  bodyFontSize: 9.5,
  headlineFontSize: 11,
};

const INK = rgb(0.1, 0.11, 0.16);
const ACCENT = rgb(0.09, 0.32, 0.48);
const MUTED = rgb(0.38, 0.4, 0.45);

// --- Unit converters (DOCX) ---
const ptToHalfPt = (pt: number) => Math.round(pt * 2); // TextRun.size
const ptToTwip = (pt: number) => Math.round(pt * 20); // spacing/margins

// --- Resume data ---
function getResumeData(): Omit<ResumeData, "spacing"> {
  return {
    name: "P. Ravi Kumar",
    headline: "Computer Science Engineering Graduate",
    contact: {
      phone: "6304480017",
      email: "p.bunny8133@gmail.com",
      location: "Hyderabad, Telangana",
      github: "https://github.com/ravikumar01321",
    },
    summary:
      "Third-year Computer Science undergraduate who turns coursework into working software -- a full-stack banking system and a computer-vision exam proctoring tool -- rather than leaving it on paper. Trained hands-on in industrial software development at NSIC-ECIL and comfortable owning a project end-to-end, from database design to a working demo.",
    workExperience: [
      {
        title: "Student Trainee -- Software Development",
        company: "NSIC Technical Services Centre, ECIL",
        location: "Hyderabad, Telangana",
        dates: "2024 - 2025",
        bullets: [
          "Completed a structured industrial training program covering the full software development lifecycle, from requirements and design to implementation and testing of real applications.",
          "Built and debugged multiple academic and practical projects using industry-standard tools, applying professional coding and version-control practices.",
          "Sharpened problem-solving and debugging discipline through daily hands-on lab sessions under engineer supervision.",
        ],
      },
    ],
    projects: [
      {
        name: "Banking Management System",
        stack: "Java, SQL, DBMS",
        url: "github.com/ravikumar01321",
        description:
          "Designed and built a full banking application covering account creation, deposits, withdrawals, and transaction history, backed by a normalized relational schema for data integrity, auditability, and fast lookups.",
      },
      {
        name: "AI-Based Exam Proctoring System",
        stack: "Python, OpenCV, Machine Learning",
        url: "github.com/ravikumar01321",
        description:
          "Built an AI-powered proctoring tool using real-time computer vision to flag suspicious behavior during online exams, enabling reliable, unattended exam monitoring at scale.",
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
        dates: "2025 - 2028 (Expected)",
        detail: "Currently in 3rd Year",
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
}

// --- Text measuring / wrapping helpers ---
function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, fontSize) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function centerText(page: PDFPage, text: string, y: number, font: PDFFont, size: number, color = INK) {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: (PAGE_W - width) / 2, y: PAGE_H - y, size, font, color });
}

// --- PDF rendering ---
async function renderPDF(
  data: Omit<ResumeData, "spacing">,
  spacing: Spacing,
): Promise<{ pdfDoc: PDFDocument; finalY: number }> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const { bodyFontSize, headlineFontSize, lineHeight, sectionGap, roleGap, bulletGap } = spacing;

  let y = MARGIN;

  const drawLine = (yPos: number, color = INK, width = 1) => {
    page.drawLine({
      start: { x: MARGIN, y: PAGE_H - yPos },
      end: { x: PAGE_W - MARGIN, y: PAGE_H - yPos },
      thickness: width,
      color,
    });
  };

  const drawText = (
    text: string,
    x: number,
    yPos: number,
    font: PDFFont,
    size: number,
    color = INK,
  ) => {
    page.drawText(text, { x, y: PAGE_H - yPos, size, font, color });
  };

  const drawBullet = (text: string, indent = 8) => {
    const bulletX = MARGIN + indent;
    const textX = bulletX + 9;
    const maxWidth = CONTENT_W - indent - 9;
    const lines = wrapText(text, regular, bodyFontSize, maxWidth);
    lines.forEach((line, idx) => {
      if (idx === 0) drawText("-", bulletX, y, regular, bodyFontSize, MUTED);
      drawText(line, textX, y, regular, bodyFontSize);
      y += lineHeight;
    });
    y += bulletGap;
  };

  // Header
  y += 18;
  centerText(page, data.name, y, bold, 21);
  y += headlineFontSize + 8;
  centerText(page, data.headline, y, regular, headlineFontSize, ACCENT);
  y += lineHeight;

  const contactParts = [data.contact.phone, data.contact.email, data.contact.location, data.contact.github].filter(
    Boolean,
  );
  centerText(page, contactParts.join("   |   "), y, regular, 9, MUTED);
  y += lineHeight + 2;

  drawLine(y, ACCENT, 1.3);
  y += lineHeight;

  // Summary
  const summaryLines = wrapText(data.summary, regular, bodyFontSize, CONTENT_W);
  for (const line of summaryLines) {
    drawText(line, MARGIN, y, regular, bodyFontSize);
    y += lineHeight;
  }

  const renderSectionHeader = (title: string) => {
    y += sectionGap;
    drawText(title.toUpperCase(), MARGIN, y, bold, 11.5, ACCENT);
    y += 3;
    drawLine(y, ACCENT, 0.75);
    y += lineHeight;
  };

  // Work experience
  renderSectionHeader("Work Experience");
  data.workExperience.forEach((role, i) => {
    drawText(role.title, MARGIN, y, bold, bodyFontSize + 0.5);
    const dateWidth = italic.widthOfTextAtSize(role.dates, bodyFontSize);
    drawText(role.dates, PAGE_W - MARGIN - dateWidth, y, italic, bodyFontSize, MUTED);
    y += lineHeight;
    drawText(`${role.company} | ${role.location}`, MARGIN, y, italic, bodyFontSize, MUTED);
    y += lineHeight + bulletGap;
    role.bullets.forEach((b) => drawBullet(b));
    if (i < data.workExperience.length - 1) y += roleGap;
  });

  // Projects
  renderSectionHeader("Projects");
  data.projects.forEach((proj, i) => {
    drawText(`${proj.name}`, MARGIN, y, bold, bodyFontSize + 0.5);
    const stackText = ` (${proj.stack})`;
    const nameWidth = bold.widthOfTextAtSize(proj.name, bodyFontSize + 0.5);
    drawText(stackText, MARGIN + nameWidth, y, italic, bodyFontSize, MUTED);
    y += lineHeight;
    drawText(`GitHub: ${proj.url}`, MARGIN, y, italic, bodyFontSize - 0.5, ACCENT);
    y += lineHeight;
    drawBullet(proj.description, 0);
    if (i < data.projects.length - 1) y += roleGap;
  });

  // Technical Skills
  renderSectionHeader("Technical Skills");
  data.skills.forEach((skill) => {
    const label = `${skill.category}: `;
    drawText(label, MARGIN, y, bold, bodyFontSize);
    const labelWidth = bold.widthOfTextAtSize(label, bodyFontSize);
    const lines = wrapText(skill.items, regular, bodyFontSize, CONTENT_W - labelWidth);
    drawText(lines[0] ?? "", MARGIN + labelWidth, y, regular, bodyFontSize);
    y += lineHeight;
    for (let i = 1; i < lines.length; i++) {
      drawText(lines[i], MARGIN + labelWidth, y, regular, bodyFontSize);
      y += lineHeight;
    }
    y += bulletGap;
  });

  // Education
  renderSectionHeader("Education");
  data.education.forEach((edu, i) => {
    drawText(edu.degree, MARGIN, y, bold, bodyFontSize + 0.5);
    if (edu.dates) {
      const dateWidth = italic.widthOfTextAtSize(edu.dates, bodyFontSize);
      drawText(edu.dates, PAGE_W - MARGIN - dateWidth, y, italic, bodyFontSize, MUTED);
    }
    y += lineHeight;
    const schoolLine = `${edu.school}, ${edu.location}${edu.detail ? "  |  " + edu.detail : ""}`;
    drawText(schoolLine, MARGIN, y, regular, bodyFontSize, MUTED);
    y += lineHeight;
    if (i < data.education.length - 1) y += roleGap;
  });

  return { pdfDoc, finalY: y };
}

// --- DOCX rendering ---
function buildDocx(data: Omit<ResumeData, "spacing">, spacing: Spacing): Document {
  const { bodyFontSize, headlineFontSize, sectionGap } = spacing;
  const accentHex = "17527A";
  const mutedHex = "61666E";
  const inkHex = "1A1C29";

  const sectionHeader = (title: string) =>
    new Paragraph({
      spacing: { before: ptToTwip(sectionGap + 4), after: ptToTwip(4) },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: accentHex, space: 2 },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: ptToHalfPt(11.5),
          color: accentHex,
        }),
      ],
    });

  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: ptToTwip(4) },
      children: [new TextRun({ text: data.name, bold: true, size: ptToHalfPt(21), color: inkHex })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: ptToTwip(4) },
      children: [new TextRun({ text: data.headline, size: ptToHalfPt(headlineFontSize), color: accentHex })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: ptToTwip(8) },
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: accentHex, space: 4 } },
      children: [
        new TextRun({
          text: [data.contact.phone, data.contact.email, data.contact.location, data.contact.github]
            .filter(Boolean)
            .join("   |   "),
          size: ptToHalfPt(9),
          color: mutedHex,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: ptToTwip(4) },
      children: [new TextRun({ text: data.summary, size: ptToHalfPt(bodyFontSize), color: inkHex })],
    }),
    sectionHeader("Work Experience"),
  ];

  data.workExperience.forEach((role) => {
    children.push(
      new Paragraph({
        spacing: { after: 0 },
        children: [
          new TextRun({ text: role.title, bold: true, size: ptToHalfPt(bodyFontSize + 0.5), color: inkHex }),
          new TextRun({ text: `    ${role.dates}`, italics: true, size: ptToHalfPt(bodyFontSize), color: mutedHex }),
        ],
      }),
      new Paragraph({
        spacing: { after: ptToTwip(3) },
        children: [
          new TextRun({
            text: `${role.company} | ${role.location}`,
            italics: true,
            size: ptToHalfPt(bodyFontSize),
            color: mutedHex,
          }),
        ],
      }),
    );
    role.bullets.forEach((b) => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: ptToTwip(2) },
          children: [new TextRun({ text: b, size: ptToHalfPt(bodyFontSize), color: inkHex })],
        }),
      );
    });
  });

  children.push(sectionHeader("Projects"));
  data.projects.forEach((proj) => {
    children.push(
      new Paragraph({
        spacing: { after: 0 },
        children: [
          new TextRun({ text: proj.name, bold: true, size: ptToHalfPt(bodyFontSize + 0.5), color: inkHex }),
          new TextRun({ text: ` (${proj.stack})`, italics: true, size: ptToHalfPt(bodyFontSize), color: mutedHex }),
        ],
      }),
      new Paragraph({
        spacing: { after: ptToTwip(2) },
        children: [
          new TextRun({
            text: `GitHub: ${proj.url}`,
            italics: true,
            size: ptToHalfPt(bodyFontSize - 0.5),
            color: accentHex,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: ptToTwip(6) },
        children: [new TextRun({ text: proj.description, size: ptToHalfPt(bodyFontSize), color: inkHex })],
      }),
    );
  });

  children.push(sectionHeader("Technical Skills"));
  data.skills.forEach((skill) => {
    children.push(
      new Paragraph({
        spacing: { after: ptToTwip(2) },
        children: [
          new TextRun({ text: `${skill.category}: `, bold: true, size: ptToHalfPt(bodyFontSize), color: inkHex }),
          new TextRun({ text: skill.items, size: ptToHalfPt(bodyFontSize), color: inkHex }),
        ],
      }),
    );
  });

  children.push(sectionHeader("Education"));
  data.education.forEach((edu) => {
    children.push(
      new Paragraph({
        spacing: { after: 0 },
        children: [
          new TextRun({ text: edu.degree, bold: true, size: ptToHalfPt(bodyFontSize + 0.5), color: inkHex }),
          ...(edu.dates
            ? [new TextRun({ text: `    ${edu.dates}`, italics: true, size: ptToHalfPt(bodyFontSize), color: mutedHex })]
            : []),
        ],
      }),
      new Paragraph({
        spacing: { after: ptToTwip(6) },
        children: [
          new TextRun({
            text: `${edu.school}, ${edu.location}${edu.detail ? "  |  " + edu.detail : ""}`,
            size: ptToHalfPt(bodyFontSize),
            color: mutedHex,
          }),
        ],
      }),
    );
  });

  return new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: ptToTwip(PAGE_W), height: ptToTwip(PAGE_H) },
            margin: {
              top: ptToTwip(MARGIN),
              bottom: ptToTwip(MARGIN),
              left: ptToTwip(MARGIN),
              right: ptToTwip(MARGIN),
            },
          },
        },
        children,
      },
    ],
  });
}

// --- Auto-fit and generate ---
async function main() {
  const data = getResumeData();
  const outputDir = path.resolve(import.meta.dirname, "..", "output");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  let spacing = { ...BASE_SPACING };
  let { finalY } = await renderPDF(data, spacing);

  // Auto-fit: shrink or expand spacing to hit the target
  const diff = TARGET_Y - finalY;
  if (Math.abs(diff) > 4) {
    const weights = { sectionGap: 3, roleGap: 2, bulletGap: 1, lineHeight: 0.5 };
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    // Rough scale factor applied proportionally to gap-like values.
    const scaleUnit = diff / totalWeight / 8; // conservative divisor to avoid overshoot
    spacing = {
      ...spacing,
      sectionGap: Math.max(4, spacing.sectionGap + scaleUnit * weights.sectionGap),
      roleGap: Math.max(2, spacing.roleGap + scaleUnit * weights.roleGap),
      bulletGap: Math.max(0.5, spacing.bulletGap + scaleUnit * weights.bulletGap),
      lineHeight: Math.max(10, spacing.lineHeight + scaleUnit * weights.lineHeight),
    };
  }

  const rendered = await renderPDF(data, spacing);
  finalY = rendered.finalY;

  // If still overflowing after adjustment, shrink line height/body font slightly.
  if (finalY > TARGET_Y + 2) {
    const overflow = finalY - TARGET_Y;
    const shrink = Math.min(1.5, overflow / 40);
    spacing = {
      ...spacing,
      lineHeight: spacing.lineHeight - shrink * 0.4,
      bodyFontSize: Math.max(8.5, spacing.bodyFontSize - shrink * 0.3),
    };
  }

  const final = await renderPDF(data, spacing);
  const pdfBytes = await final.pdfDoc.save();

  fs.writeFileSync(path.join(outputDir, "ravi-kumar-resume.pdf"), pdfBytes);

  const docxDoc = buildDocx(data, spacing);
  const docxBuffer = await Packer.toBuffer(docxDoc);
  fs.writeFileSync(path.join(outputDir, "ravi-kumar-resume.docx"), docxBuffer);

  const jsonData: ResumeData = { ...data, spacing };
  fs.writeFileSync(path.join(outputDir, "resume-data.json"), JSON.stringify(jsonData, null, 2));

  console.log(`Generated resume files. finalY=${final.finalY.toFixed(1)} target=${TARGET_Y}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
