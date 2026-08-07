# login-app

A login and user registration application built with Node.js, Express, and TypeScript.
This is the Layer 0 / Layer 0a / Layer 1 reference app for the
[Software Assembly Line](../../software_assembly_line_model-v3.md) onboarding project.

## Prerequisites

- Node.js 20.x
- npm

## Getting Started

```bash
# Install dependencies
npm install

# Run in dev mode (auto-reloads on change), served at http://localhost:3000
npm run dev

# Or build and run the compiled production version
npm run build
npm start
```

## Project Structure

```markdown
source/
  server.ts              # Express app entrypoint
  routes/auth.ts          # /api/auth routes
  controllers/authController.ts
  middleware/validator.ts
  end2end/jest/           # Jest integration/e2e tests
  end2end/gui/             # Playwright GUI tests
public/                   # Static HTML/CSS served by Express
``` 

### Step 1d and Layer 0a: Local Testing Gate

1. Local Formatting

```bash
npm run format:check

# Fix the formatting
npm run format
```

2. Local Linting

```bash 
npm run lint

# Fix the linting
npm run lint:fix
```

3. Type Check

```bash 
npm run type-check
```

4. Run the unit tests

```bash 
npm test
```

Summary:

```bash 
npm run format:check   # ✅ Pass
npm run lint           # ✅ Pass
npm run type-check     # ✅ Pass
npm test               # ✅ xy passing, coverage meets thresholds
``` 

### Layer 1: local Testing

1. Integration Test and End2End Test

```bash
npm run test:end2end
```

2. GUI - Playwright test End2End

```bash
npm run test:gui
``` 

3. GUI - UI Playwright test End2End

```bash
npm run test:gui:ui
```

4. Build and run the Docker image locally (optional — Layer 1 CI does this automatically once all tests pass on push to main)

```bash
docker build -t login-app:latest .
docker run -p 3000:3000 login-app:latest
```

5. Pull the production image from DockerHub

```bash
docker pull YOUR_USERNAME/login-app:latest
docker run -p 3000:3000 YOUR_USERNAME/login-app:latest
``` 
