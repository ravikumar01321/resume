# GitHub Pages Configuration

This configuration enables automatic deployment of the Resume app to GitHub Pages.

## Setup Instructions

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Build and deployment":
     - Source: Select "GitHub Actions"
     - This allows the CI/CD workflow to deploy

2. **Deployment Flow**:
   - Push to `main` branch triggers the workflow
   - GitHub Actions builds the project
   - Builds artifacts are deployed to `gh-pages` branch
   - GitHub Pages serves from `gh-pages` branch

3. **Custom Domain** (Optional):
   - Add a `CNAME` file in `public/` directory
   - Or configure in repository settings

## Accessing Your Resume

After deployment, your resume will be available at:
- `https://<username>.github.io/<repo-name>/`

Example:
- Repository: `https://github.com/ravikumar01321/resume`
- Live Resume: `https://ravikumar01321.github.io/resume/`

## Manual Deployment

If you need to manually deploy:

```bash
# Build the project
pnpm run build

# Deploy to gh-pages branch
pnpm deploy  # (requires gh-pages package)
```

Or use GitHub CLI:

```bash
# After building
git checkout -b gh-pages
git rm -r .
git checkout main -- artifacts/resume/dist/
git mv artifacts/resume/dist/* .
git rm -r artifacts/
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
git checkout main
```

## Environment Variables

For production deployment, configure:
- `VITE_API_URL`: Points to your API server
- `BASE_URL`: Set to repository name if deploying to GitHub Pages subfolder

Example for GitHub Pages at `username.github.io/resume/`:

```
VITE_API_URL=https://api.example.com
BASE_URL=/resume/
```

## Troubleshooting

**Pages not updating after push?**
- Check the "Actions" tab in your repository for workflow status
- Ensure the workflow completed successfully
- Clear browser cache (Ctrl+Shift+Delete)

**404 errors on refresh?**
- GitHub Pages needs SPA (Single Page App) configuration
- The project includes `_redirects` and `.nojekyll` for compatibility
- Ensure Vite is configured with correct base URL

**API calls failing in production?**
- Update `VITE_API_URL` environment variable
- Ensure CORS is enabled on your API server
- Check network tab in browser DevTools

---

For more information, see [GitHub Pages Documentation](https://docs.github.com/en/pages).
