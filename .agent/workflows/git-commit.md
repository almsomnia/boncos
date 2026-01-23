---
description: Use this workflow to generate a commit message that fits the project's existing style.
---

## Workflow Steps

Follow these steps sequentially. Do not skip steps unless explicitly instructed.

### Step 1: Analyze Git State

Execute commands to assess the current repository status.

1. Check for changes in the *working directory*.
2. Check for files currently in the *staging area*.

### Step 2: Smart Staging Strategy

Apply the following logic based on Step 1 results:

- **IF** (Staging Area IS Empty) **AND** (Working Directory IS NOT Empty):
  - Execute `git add .` to stage all detected changes.
  - *Context:* "Auto-staging all detected changes."
- **IF** (Staging Area IS Empty) **AND** (Working Directory IS Empty):
  - **STOP PROCESS**. Inform the user: "Working tree is clean. Nothing to commit."
- **IF** (Staging Area IS NOT Empty):
  - Proceed directly to Step 3 with currently staged files.

### Step 3: Change Analysis & Message Generation

1. Read the code differences using `git diff --cached`.
2. Analyze the context (file names, modified functions, code logic).
3. Generate a **Commit Message** strictly adhering to **Conventional Commits**.

**Commit Message Rules:**
- Format: `<type>(<scope>): <subject>`
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`.
- Scope is not mandatory, use scope when necessary.
- Keep the subject concise (under 72 characters if possible).
- **Example**: `feat: implement pagination in user list`

### Step 4: Execution & Verification

1. Display the generated commit message to the user (if in interactive mode).
2. Execute `git commit -m "MESSAGE_FROM_STEP_3"`.

## Safety Protocols

- **Secret Scanning:** Perform a quick scan of the `diff` content. If potential secrets (API Keys, Tokens, `.env` files) are in the staged changes, **ABORT IMMEDIATELY** and warn the user.
