---
name: skill-release
description: >
  Step-by-step release workflow for cli-projects. Use this skill whenever a
  version bump or NPM publish is required. Covers new_version.ps1,
  new_release.ps1, and the full git → tag → publish sequence.
---

# SKILL: Release Workflow

This skill documents the exact process for shipping a new version of `cli-projects` to NPM.
The workflow is split into two independent PowerShell scripts that must be run in order.

---

## Prerequisites

- You are on a `feature/*` branch **or** `main`/`master` with all changes committed and pushed.
- All CI checks are green (linter + tests pass).
- You have NPM publish permissions for the package.

---

## Step 1 — Bump the version (`new_version.ps1`)

```powershell
.\new_version.ps1
```

**What it does:**
1. Reads the current `version` from `package.json`.
2. Prompts you to choose the bump type:
   - `1` → **patch** (bug fixes, e.g. `1.0.0` → `1.0.1`)
   - `2` → **minor** (new backwards-compatible features, e.g. `1.0.0` → `1.1.0`)
   - `3` → **major** (breaking changes, e.g. `1.0.0` → `2.0.0`)
3. Writes the new version into `package.json`.
4. Creates a conventional commit automatically:
   ```
   🔧 chore: bump version to X.Y.Z
   ```
   > This commit is **local only** — it does NOT push.

**After running:**
- Verify `package.json` reflects the new version.
- The commit is staged and committed locally.

---

## Step 2 — Create the release tag (`new_release.ps1`)

```powershell
.\new_release.ps1
```

**What it does:**
1. Reads the version from `package.json` and builds the tag name `vX.Y.Z`.
2. Checks both local and remote tags — **aborts if the tag already exists** (safe guard).
3. Detects the main branch (`main` or `master`) automatically.
4. Switches to main/master, pulls latest, and creates an **annotated git tag**:
   ```
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   ```
5. Pushes the tag to `origin`.

**After running:**
- The tag `vX.Y.Z` is live on GitHub.
- If `cd-deploy.yml` exists, it will trigger automatically on tag push and publish to NPM.

---

## Step 3 — Manual publish (if CI/CD is not yet set up)

> Skip this step once `.github/workflows/cd-deploy.yml` is created and active.

```bash
pnpm publish --access public
```

Ensure you are logged into NPM first: `npm whoami`. If not logged in: `npm login`.

---

## Full Sequence (Quick Reference)

```text
1. Finish work on feature branch → commit → push → merge PR
2. Switch to main: git checkout main && git pull
3. .\new_version.ps1     → choose bump type → commit is created
4. .\new_release.ps1     → tag is created + pushed
5. (CI/CD publishes automatically, or run: pnpm publish --access public)
```

---

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Tag vX.Y.Z already exists` | Script ran twice or tag was created manually | Check `git tag -l` and delete the duplicate: `git tag -d vX.Y.Z` |
| `npm ERR! 403` on publish | Not logged in or insufficient permissions | Run `npm login` and verify package ownership |
| `package.json not found` | Script run from wrong directory | Always run from the repo root |
