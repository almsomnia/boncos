### 1.1.0 (2026-01-24)

##### New Features

* **pages:**  add SEO meta to calculate page and remove hideTitle from index (d7b00ee8)
* **calculate:**  add onboarding flow with AppPage component (da1d5a93)
* **onboarding:**  add guided walkthrough overlay to calculator page (08b5ca8e)
* **ui:**
  *  enhance layout, theming and add how‑to‑use section (a5bbbacd)
  *  centralize app configuration and update color theme to purple (0353a2a4)
  *  implement column pinning and default item names in calculation results (ab5ee630)
* **calculator:**  extract logic to composable, update types & UI (bca40030)
* **layout:**  hide header toggle and add footer with copyright (0c193fa2)
* **table:**  simplify headers and add column visibility controls (0f97a489)
* **i18n:**  translate application content to Indonesian (ab20f04a)
* **branding:**  add logo, update favicon and configure SEO title template (3b0f6749)

##### Code Style Changes

* **layout:**  adjust footer height and theme variables (6ddbe557)
* **calculate:**  remove subtle variant from add buttons (28c2d6a3)

## 1.0.0 (2026-01-23)

##### Chores

* **deps:**  add generate-changelog and update release scripts (f0de0a34)
* **root:**  add LICENSE and update package.json with project metadata (6819dd07)
* **agent:**  add git-commit workflow (af890dec)

##### Documentation Changes

* **root:**  add GEMINI.md and update README with project context (701bebd2)

##### New Features

* **pages:**  move calculator to /calculate and add landing page (5c638103)
*  Add `TableCalculationResult` component and `$formatCurrency` utility, and configure Nuxt for component auto-import. (c35b64c2)
*  Implement item breakdown calculation and display using Nuxt UI components and a new decimal rounding utility. (7c57865d)
*  Initialize Nuxt 4 project with Nuxt UI and Tailwind CSS, including basic page structure and Node.js version update. (62403afd)

