import { useGetResume } from "@workspace/api-client-react";
import { motion, easeOut } from "framer-motion";
import { 
  MapPin, Mail, Phone, Github, 
  Download, ExternalLink, Briefcase, 
  GraduationCap, Code2, User, ChevronRight, FileText, Layers, Loader2
} from "lucide-react";

export default function Home() {
  const { data: resume, isLoading, isError } = useGetResume();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (isError || !resume) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">Failed to load resume</h2>
        <p className="text-muted-foreground max-w-md">We couldn't retrieve the resume data. Please try refreshing the page later.</p>
      </div>
    );
  }

  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
  const pdfUrl = `${baseUrl}/api/download/resume.pdf`;
  const docxUrl = `${baseUrl}/api/download/resume.docx`;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-foreground mb-4">
            {resume.name}
          </h1>
          <p className="text-xl md:text-2xl text-primary font-medium mb-8 max-w-2xl leading-snug">
            {resume.headline}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-muted-foreground mb-10">
            <a href={`mailto:${resume.contact.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="w-4 h-4" />
              <span>{resume.contact.email}</span>
            </a>
            <a href={`tel:${resume.contact.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />
              <span>{resume.contact.phone}</span>
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{resume.contact.location}</span>
            </div>
            <a href={resume.contact.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>

          <div className="flex flex-wrap gap-4">
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all active:scale-95 shadow-sm hover:shadow"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </a>
            <a 
              href={docxUrl} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-all active:scale-95 shadow-sm hover:shadow"
            >
              <FileText className="w-4 h-4" />
              <span>Download DOCX</span>
            </a>
          </div>
        </motion.header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-24"
        >
          {/* Summary */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">About</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {resume.summary}
            </p>
          </motion.section>

          {/* Work Experience */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center gap-3 mb-10 border-b border-border pb-4">
              <Briefcase className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Experience</h2>
            </div>
            <div className="space-y-12">
              {resume.workExperience.map((job, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4 md:gap-8 group">
                  <div className="text-muted-foreground font-medium pt-1 md:text-right">
                    {job.dates}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{job.title}</h3>
                    <div className="text-primary font-medium mb-4 flex items-center gap-2">
                      <span>{job.company}</span>
                      <span className="w-1 h-1 bg-border rounded-full" />
                      <span className="text-muted-foreground">{job.location}</span>
                    </div>
                    <ul className="space-y-3">
                      {job.bullets.map((bullet, j) => (
                        <li key={j} className="flex gap-3 text-muted-foreground">
                          <span className="text-primary mt-1.5 flex-shrink-0">
                            <ChevronRight className="w-4 h-4" />
                          </span>
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Projects */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center gap-3 mb-10 border-b border-border pb-4">
              <Code2 className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Projects</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resume.projects.map((proj, i) => (
                <div key={i} className="group relative p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{proj.name}</h3>
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label={`Visit ${proj.name}`}>
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-8 flex-grow leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {proj.stack.split(",").map((tech, j) => (
                      <span key={j} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-md">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Skills */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center gap-3 mb-10 border-b border-border pb-4">
              <Layers className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Skills</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {resume.skills.map((skillGroup, i) => (
                <div key={i}>
                  <h3 className="text-sm uppercase tracking-wider font-bold mb-4 text-muted-foreground">{skillGroup.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.split(",").map((skill, j) => (
                      <span key={j} className="px-3 py-1.5 bg-card border border-border text-foreground text-sm font-medium rounded-full shadow-sm hover:border-primary hover:text-primary transition-colors cursor-default">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Education */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center gap-3 mb-10 border-b border-border pb-4">
              <GraduationCap className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Education</h2>
            </div>
            <div className="space-y-8">
              {resume.education.map((edu, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4 md:gap-8 group">
                  <div className="text-muted-foreground font-medium pt-1 md:text-right">
                    {edu.dates}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{edu.degree}</h3>
                    <div className="text-primary font-medium mb-2 flex items-center gap-2">
                      <span>{edu.school}</span>
                      <span className="w-1 h-1 bg-border rounded-full" />
                      <span className="text-muted-foreground">{edu.location}</span>
                    </div>
                    <p className="text-muted-foreground">
                      {edu.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

        </motion.div>
        
        {/* Footer */}
        <motion.footer 
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-24 pt-8 border-t border-border text-center text-muted-foreground text-sm"
        >
          <p>© {new Date().getFullYear()} {resume.name}. All rights reserved.</p>
        </motion.footer>
      </div>
    </div>
  );
}
