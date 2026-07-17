### Step 1d: Local Testing Gate

1. Local Formatting

```bash
npm run format:check

# Fix the formatting 
npm run format 
```

2. Local Linting

```bash
npm lint 

# Fix the linting 
npm lint:fix
```

3. Run the tests

```bash
npm test 
```

Summery:

```bash
npm run format:check   # ✅ Pass
npm run lint           # ✅ Pass
npm test               # ✅ xy passing, coverage meets thresholds
```

&nbsp;
