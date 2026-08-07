# onboarding

[Software Assembly Line mental model](../software_assembly_line_model-v3.md)

## Layer 0 Complete — The Full Picture

```
Your Laptop                  DockerHub                   Azure (West Europe)
┌──────────┐    docker push  ┌──────────┐    pull + run   ┌──────────┐
│ Express  │ ──────────────> │ Image    │ ──────────────> │ Container│
│ + HTML   │                 │ Registry │                 │ App      │
│ GUI      │                 │          │                 │          │
└──────────┘                 └──────────┘                 └──────────┘
      │                          │
      │ git push                 │ pull + run
      ▼                          ▼
   ┌──────────┐              ┌──────────┐
   │ GitHub   │              │ UpCloud  │
   │ Repo     │              │ Helsinki │
   └──────────┘              └──────────┘
```

**What's built:**

| Station | What | Where | Proof |
|---------|------|-------|-------|
| 1 | Express + HTML GUI source | GitHub | `git clone` and run |
| 2 | Docker image | DockerHub | `docker pull` and run |
| 3a | Login app with GUI | Azure (West Europe) | Browser login works |
| 3b | Same app, same image | UpCloud (Helsinki) | Browser login works |

**What Layer 0 proves:**
- ✔ A user can open a browser and see your GUI
- ✔ They can type email + password and create an account
- ✔ They can log in with those credentials
- ✔ The exact same code runs identically on your laptop, Azure, and UpCloud
- ✔ You never SSH'd to fix anything — the container worked first time on both clouds

**What's missing (higher layers):**
- ✗ Passwords are plain text (Layer 2: add bcrypt + database)
- ✗ No CI/CD — Docker build and push is manual
- ✗ No deployment automation — `docker run` was manual SSH
- ✗ No monitoring — if the app crashes, nobody knows
- ✗ No test enforcement on push

&nbsp;

# Layer 0a: Production Hardening
## Converting the Login App from JavaScript to TypeScript

Layer 0 proved the app *works*. Layer 1 is about proving it *keeps working* — and
that starts with catching bugs before they ship, not after.

**Why TypeScript, why now:**
- The Layer 1 quality gates (Station 1b0 / 1b) run a `type-check` step — there's
  nothing to check without types
- JavaScript bugs like `undefined is not a function` or a typo'd field name
  surface at runtime, in production, in front of a user. TypeScript catches
  them at compile time, on your laptop, in seconds
- As the app grows (bcrypt, a database, more routes), types document what a
  function expects and returns — no more guessing from `console.log`
- It's a one-time conversion cost paid once, at the smallest possible codebase
  size, before Layer 2 adds more surface area to convert later

**What changes:**
- ✗ `.js` files, no compiler, errors caught only by running the code
- ✔ `.ts` files, compiled/type-checked before the app ever runs
- ✔ Sets up Station 1 0a (see Layer 1 table below) as the new source-of-truth

## Layer 1 Complete - The Full Picture

```
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 1: Quality & Sensors                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Station 1b0 (Speed Gate)        Station 1b (Truth Gate)        │
│  ┌─────────────────────┐         ┌──────────────────────────┐   │
│  │ On git commit:       │         │ On git push to main:     │   │
│  │  ✔ format           │         │  ✔ format check         │   │
│  │  ✔ lint             │  push   │  ✔ lint                 │   │
│  │  ✔ type-check       │ ──────> │  ✔ type-check           │   │
│  │                      │         │  ✔ unit tests           │   │
│  │ On git push:         │         │  ✔ integration tests    │   │
│  │  ✔ unit tests       │         │  ✔ e2e tests            │   │
│  │                      │         │  ✔ GUI tests            │   │
│  │  ⚡ 5-10 seconds     │         │  ✔ coverage report      │   │
│  │  Catches 80% of bugs │         │  ✔ Docker build         │   │
│  └─────────────────────┘         │  ✔ DockerHub push        │   │
│                                   │                          │   │
│                                   │  ⏱ 3-5 minutes          │   │
│                                   │  Proves production-safe  │   │
│                                   └──────────────────────────┘   │
│                                                                 │
│  The Dual-Gate Guarantee:                                       │
│  If code passes BOTH gates, it's safe to deploy anywhere.       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**What's built:**

| Station | What | Where | Proof |
|---------|------|-------|-------|
| 1 0a | TypeScript + HTML GUI source | GitHub | `git clone` and run |
| 1b0 | Local quality gate (format, lint, type-check, unit tests) | Your laptop | `git commit` / `git push` succeeds only when checks pass |
| 1b | Cloud truth gate (format, lint, type-check, unit, integration, e2e, GUI tests) | GitHub Actions | CI runs green on a clean Ubuntu runner |
| 2 | Docker image built and smoke-tested | DockerHub | Image is built and pushed automatically after CI passes |
| 3a | Production-safe login app image | Azure (West Europe) | Container runs and browser login works |
| 3b | Same production-safe image | UpCloud (Helsinki) | Container runs and browser login works |

**Layer 1 pipeline now:**
1. You write code locally.
2. `git commit` → the Speed Gate runs automatically: format, lint, type-check, and local unit tests. (Fails fast if broken).
3. `git push` → the push hook blocks broken code before it reaches GitHub. (unit tests run locally. Fails fast it tests broken)
4. GitHub Actions triggers (all tests) runs the Truth Gate on a clean Ubuntu runner: format, lint, type-check, unit, integration, e2e, and GUI tests.
5. If everything passes → the Docker image is built, smoke-tested, and pushed to DockerHub.
6. `YOUR_USERNAME/login-app:latest` is now your production-safe image.

