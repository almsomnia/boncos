#### 1.3.1 (2026-01-28)

##### Other Changes

* nuxt` and `test` scripts for Vitest to package.json. (20e02114)

##### Tests

*  add unit tests for components (a2142662)
*  Add comprehensive tests for the `useCalculator` composable, fix a potential division by zero error in proportion calculation, and update Vitest configuration to include nested test files. (1a8d6036)
*  Set up Vitest for unit testing and add initial tests for base64, currency formatting, and decimal rounding utilities. (ac3c7595)

### 1.3.0 (2026-01-26)

##### New Features

* **share:**  Add external sharing functionality and refactor `shareCalculationResult` to return the base64 string directly. (62e271e8)

##### Refactors

* **ui:**  consolidate toast usage and enhance share functionality (1dcdd935)
* **calculation:**  restructure calculation detail types and update UI columns (a4e4f07f)

### 1.2.0 (2026-01-25)

##### New Features

*  Add read-only mode for shared calculations and include price in calculation details. (baa2f24c)
*  Migrate calculation result sharing from server-side encryption to client-side Base64 encoding with new shared utilities. (8fc02448)
* **share:**
  *  load calculator state from shared URL parameters on component mount. (62386227)
  *  add share result modal and API response wrapper (b49b71fe)
* **utils:**  Implement server encryption/decryption utility, add encrypt/decrypt API endpoints (50caa710)

##### Refactors

*  Extract onboarding logic into a new `CalculateOnboarding` component and integrate it into the calculate page. (1b7896a2)

##### Code Style Changes

*  text selection background color (4585b75f)

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

