# Resume Generator Pro

A modern, responsive resume generator built with React, TypeScript, and Vite. Generate beautiful PDF and DOCX resume files easily.

## Features

- 🎨 Beautiful, modern resume templates
- 📄 Export to PDF and DOCX formats
- 🎭 Multiple color themes and styles
- 📱 Fully responsive design
- ⚡ Fast build with Vite
- 🔒 Type-safe with TypeScript

## Project Structure

```
.
├── artifacts/
│   ├── resume/           # Resume UI application (React + Vite)
│   ├── api-server/       # API server (Express)
│   └── mockup-sandbox/   # Component sandbox (development only)
├── lib/
│   ├── api-client-react/ # React API client
│   ├── api-spec/         # OpenAPI specification
│   ├── api-zod/          # Zod validation schemas
│   └── db/               # Database configuration
├── scripts/              # Utility scripts
└── package.json          # Root workspace configuration
```

## Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v11.10.0 or higher (required for this monorepo)

## Installation

### Option 1: Using pnpm (Recommended)

```bash
# Install pnpm if you haven't already
npm install -g pnpm@11.10.0

# Clone the repository
git clone https://github.com/ravikumar01321/resume.git
cd resume

# Install dependencies
pnpm install
```

### Option 2: Using npm

```bash
# Clone the repository
git clone https://github.com/ravikumar01321/resume.git
cd resume

# Install dependencies
npm install

# For pnpm workspaces support
npm install -g pnpm@11.10.0
pnpm install
```

## Development

### Build the project

```bash
# Build resume app and API server (recommended)
pnpm run build

# Build all packages including mockup-sandbox
pnpm run build:all

# Build individual packages
pnpm run build:resume      # Build resume app only
pnpm run build:api         # Build API server only
```

### Type checking

```bash
# Check types across all packages
pnpm run typecheck
```

### Run development server

```bash
# Resume app (development mode)
cd artifacts/resume
pnpm run dev

# API server (development mode)
cd artifacts/api-server
pnpm run dev
```

The resume app will be available at `http://localhost:5173`  
The API server will be available at `http://localhost:3000`

## Production Build

```bash
# Build for production
pnpm run build

# The following directories will contain the built files:
# - artifacts/resume/dist/     - Resume UI (static files)
# - artifacts/api-server/dist/ - API server (bundled code)
```

## Deployment

### GitHub Pages (Frontend Only)

The project includes GitHub Actions workflows for automatic deployment to GitHub Pages.

1. **Set up GitHub Pages** in your repository settings:
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (will be created by the workflow)

2. **Push to `main` branch** to trigger automatic deployment:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

3. **View your resume** at: `https://<your-username>.github.io/<repository-name>/`

### Environment Variables

Create a `.env` file in `artifacts/resume/` for development:

```env
VITE_API_URL=http://localhost:3000
```

For production, set the environment variable in your deployment platform:
- GitHub Pages: The API URL should point to your deployed API server
- Vercel, Netlify: Add `VITE_API_URL` in deployment settings

## API Endpoints

The API server provides the following endpoints:

- `GET /api/resume` - Get resume data
- `GET /api/download/resume.pdf` - Download resume as PDF
- `GET /api/download/resume.docx` - Download resume as DOCX
- `GET /api/health` - Health check endpoint

## Configuration

### Resume Data

Edit resume data by modifying the API response or database. The resume data structure follows the OpenAPI specification defined in `lib/api-spec/openapi.yaml`.

### Theming

The project uses CSS variables for theming. Modify theme colors in:
- `artifacts/resume/src/index.css` - Global styles and theme variables
- `components.json` - Shadcn/ui component configuration

## Troubleshooting

### "Cannot find module @rollup/rollup-win32-x64-msvc"

This is a known issue on Windows with optional dependencies. Solution:

```bash
# On Windows, reinstall dependencies
rm -r node_modules pnpm-lock.yaml
pnpm install
```

### "Cannot find module @esbuild/win32-x64"

This occurs due to missing platform-specific optional dependencies:

```bash
# Reinstall with force flag
pnpm install --force
```

### Type errors during build

```bash
# Clear TypeScript build cache and rebuild
rm -rf lib/tsconfig.tsbuildinfo
pnpm run typecheck
pnpm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Resume Building!** 🚀
