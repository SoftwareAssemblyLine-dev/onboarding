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

**What you have built:**

| Station | What | Where | Proof |
|---------|------|-------|-------|
| 1 | Express + HTML GUI source | GitHub | `git clone` and run |
| 2 | Docker image | DockerHub | `docker pull` and run |
| 3a | Login app with GUI | Azure (West Europe) | Browser login works |
| 3b | Same app, same image | UpCloud (Helsinki) | Browser login works |

**What Layer 0 proves:**
- ✅ A user can open a browser and see your GUI
- ✅ They can type email + password and create an account
- ✅ They can log in with those credentials
- ✅ The exact same code runs identically on your laptop, Azure, and UpCloud
- ✅ You never SSH'd to fix anything — the container worked first time on both clouds

**What's missing (higher layers):**
- ❌ Passwords are plain text (Layer 2: add bcrypt + database)
- ❌ No CI/CD — Docker build and push is manual
- ❌ No deployment automation — `docker run` was manual SSH
- ❌ No monitoring — if the app crashes, nobody knows
- ❌ No test enforcement on push

&nbsp;

# Layer 0a: Production Hardening
## Converting the Login App from JavaScript to TypeScript

