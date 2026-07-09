import { Router, type IRouter } from "express";
import path from "path";
import fs from "fs";

const router: IRouter = Router();

// Bundled runtime __dirname is artifacts/api-server/dist, so three levels up
// reaches the workspace root: dist -> api-server -> artifacts -> <root>.
const outputDir = path.resolve(import.meta.dirname, "..", "..", "..", "scripts", "output");

router.get("/download/resume.pdf", (req, res): void => {
  const filePath = path.join(outputDir, "ravi-kumar-resume.pdf");
  if (!fs.existsSync(filePath)) {
    req.log.warn({ filePath }, "Resume PDF not found");
    res.status(404).json({ error: "Resume PDF not found" });
    return;
  }
  res.setHeader("Content-Disposition", "attachment; filename=ravi-kumar-resume.pdf");
  res.setHeader("Content-Type", "application/pdf");
  res.sendFile(filePath);
});

router.get("/download/resume.docx", (req, res): void => {
  const filePath = path.join(outputDir, "ravi-kumar-resume.docx");
  if (!fs.existsSync(filePath)) {
    req.log.warn({ filePath }, "Resume DOCX not found");
    res.status(404).json({ error: "Resume DOCX not found" });
    return;
  }
  res.setHeader("Content-Disposition", "attachment; filename=ravi-kumar-resume.docx");
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  );
  res.sendFile(filePath);
});

export default router;
