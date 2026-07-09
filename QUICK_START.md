# Quick Start Guide: Deploy to GitHub

This guide will help you get your Resume Generator Pro running and deployed to GitHub Pages in minutes.

## 📋 Prerequisites

- GitHub account
- Git installed on your computer
- Node.js v18+ installed
- pnpm v11.10.0+ installed

## 🚀 Step 1: Clone and Setup (5 minutes)

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/resume.git
cd resume

# Install dependencies (required for this monorepo project)
pnpm install

# Verify installation
pnpm run typecheck
```

## 🔨 Step 2: Build the Project (2-3 minutes)

```bash
# Build resume app and API
pnpm run build

# Or build only what you need:
pnpm run build:resume      # Just the frontend
pnpm run build:api         # Just the backend
```

Build outputs will be in:
- `artifacts/resume/dist/` - Your resume app (what gets deployed)
- `artifacts/api-server/dist/` - API server (for self-hosted deployment)

## 📦 Step 3: Configure GitHub Pages

### Option A: Automatic (Recommended)

The project includes GitHub Actions workflows that handle everything automatically!

1. **Enable GitHub Actions**:
   - Go to your repository on GitHub.com
   - Click "Settings" > "Pages"
   - Under "Build and deployment", select:
     - Source: **GitHub Actions**

2. **That's it!** The workflow will:
   - Run on every push to `main` branch
   - Build your project
   - Deploy to `gh-pages` branch automatically
   - Make it live at `https://YOUR_USERNAME.github.io/resume/`

### Option B: Manual Deploy

If you prefer to deploy manually:

1. **Build locally**:
   ```bash
   pnpm run build:resume
   ```

2. **Use GitHub Pages deployment tool**:
   ```bash
   npm install --save-dev gh-pages
   npx gh-pages -d artifacts/resume/dist
   ```

3. **Enable GitHub Pages**:
   - Settings > Pages
   - Source: `gh-pages` branch
   - Save

## ✅ Step 4: Verify Deployment

After pushing code to GitHub:

1. Check the "Actions" tab to watch the build
2. Wait for the workflow to complete (usually 2-3 minutes)
3. Visit your live resume:
   - `https://YOUR_USERNAME.github.io/resume/`

## 📝 Step 5: Customize Your Resume

### Edit Resume Data

Resume data comes from the API. To customize:

1. **Edit API response** in `artifacts/api-server/src/`:
   - Look for resume data in routes or database
   - Update with your information

2. **Redeploy**:
   ```bash
   git add .
   git commit -m "Update resume data"
   git push origin main
   ```

GitHub Actions will automatically rebuild and redeploy!

## 🎨 Customize Appearance

### Change Theme Colors

Edit `artifacts/resume/src/index.css`:

```css
:root {
  --primary: #3b82f6;        /* Main accent color */
  --primary-foreground: #fff;
  --background: #ffffff;
  --foreground: #000000;
  --secondary: #e2e8f0;
  --secondary-foreground: #1e293b;
  /* ... other colors ... */
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0f172a;
    --foreground: #f1f5f9;
    /* ... dark mode colors ... */
  }
}
```

Then redeploy:
```bash
git add .
git commit -m "Update theme colors"
git push origin main
```

## 🔧 Environment Variables

### For GitHub Pages

The GitHub Pages deployment uses these defaults:
- `BASE_PATH=/resume/` (GitHub Pages subdirectory)
- `VITE_API_URL=` (Leave empty to use relative paths)

### For Custom Domain

If using a custom domain (e.g., `resume.yourname.com`):

1. Add `CNAME` file to `public/`:
   ```
   resume.yourname.com
   ```

2. Configure DNS records:
   ```
   CNAME resume.yourname.com YOUR_USERNAME.github.io
   ```

3. Update GitHub Pages settings with custom domain

## 🚨 Troubleshooting

### "Build failed" in GitHub Actions

1. Check the Actions log for error details
2. Run locally to test:
   ```bash
   pnpm run build
   ```
3. Fix issues and push again

### Pages not updating

1. Force refresh browser: `Ctrl+Shift+R` or `Cmd+Shift+R`
2. Check Actions tab - ensure workflow succeeded
3. Verify Pages settings point to `gh-pages` branch

### Local build fails

On Windows, if you see Rollup or esbuild errors:

```bash
# Clean and reinstall
rm -r node_modules pnpm-lock.yaml
pnpm install
pnpm run build
```

## 📚 Next Steps

- **Add custom domain**: See [GitHub Pages + Custom Domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- **Add analytics**: Integrate with Google Analytics
- **Customize styling**: Edit CSS and component files
- **Add sections**: Create new resume sections in components

## 💡 Pro Tips

1. **Keep updates simple**: Each commit triggers a redeploy
2. **Test locally first**: Run `pnpm run dev` before pushing
3. **Semantic commits**: Use clear commit messages for your build history
4. **Use branches**: Create branches for testing before merging to main

## 🆘 Need Help?

- Check [GitHub Pages Documentation](https://docs.github.com/en/pages)
- Review [README.md](README.md) for more detailed info
- See [GITHUB_PAGES.md](GITHUB_PAGES.md) for advanced configuration

---

**That's it!** Your resume is now live on GitHub Pages. 🎉

Every time you push to the `main` branch, GitHub Actions will automatically rebuild and redeploy your resume.
