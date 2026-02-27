#### 1.6.2 (2026-02-27)

##### New Features

*  Migrate project to Bun, updating package manager scripts, Nuxt Nitro preset, and dependency configurations. ([042401e0](https://github.com/almsomnia/boncos/commit/042401e08bf45fab250312787ab3b63405ba1ec3))

##### Bug Fixes

*  Enhance share functionality with a generated-from signature, simplified title, and dynamic styling for share options. ([ffc9ac39](https://github.com/almsomnia/boncos/commit/ffc9ac39243cab176ae02e27819a6f0cc73ca151))

##### Refactors

*  extract share calculation modal into a dedicated component ([5c3cb23f](https://github.com/almsomnia/boncos/commit/5c3cb23f4eb4fa7508595083dfa9f19958c7c1f0))

#### 1.6.1 (2026-02-27)

##### Bug Fixes

*  Add pnpm-workspace overrides to resolve vulnerabilities and refresh the lock file. ([fe747e2b](https://github.com/almsomnia/boncos/commit/fe747e2b9058c2d8ec7dd87daa34679fbaa101f3))

### 1.6.0 (2026-02-27)

##### Chores

*  Add `@iconify-json/lucide` to dev dependencies. ([fa440ff7](https://github.com/almsomnia/boncos/commit/fa440ff752a2a3b86a25d67d461344ac8b268c9f))

##### Documentation Changes

*  streamline documentation by removing Nuxt 4 specifics and detailed project structure and build instructions. ([0aa8ceab](https://github.com/almsomnia/boncos/commit/0aa8ceabd1b45b0f9b11a12a64a379714f4618a6))

##### New Features

*  Update donate button display logic to use `isTablet` instead of `isDesktop` for variant and label. ([61bda10c](https://github.com/almsomnia/boncos/commit/61bda10cf9f88b94686c071b0a16b4ef08963e60))
*  Add `isTablet` computed property and conditionally display the GitHub button based on tablet breakpoint. ([8c436f71](https://github.com/almsomnia/boncos/commit/8c436f71bf7a2dbda05514e56a636e364762c401))
*  Implement internationalization for onboarding steps, actions, and the header donate button, and update footer copyright. ([c9f9c347](https://github.com/almsomnia/boncos/commit/c9f9c3475961e9486375163c7736382f90dbc106))
*  Implement i18n for the share calculation results modal, including options for sharing results, bill splitting, and payment information. ([cd3196ce](https://github.com/almsomnia/boncos/commit/cd3196ce6a3259c1984de1a753d0f57aeac39c3d))
*  Add i18n localization for the bill calculation feature and update components to use new keys. ([31a9fd83](https://github.com/almsomnia/boncos/commit/31a9fd83116a00b40527ac40fc1c4e9ac0fc0de1))
*  implement i18n browser language detection and add a language switcher UI. ([fb1d5d9a](https://github.com/almsomnia/boncos/commit/fb1d5d9a0a58f905646416c18088b88c265df3f4))
*  implement internationalization with English and Indonesian locales and integrate translation keys into components. ([d8c242d3](https://github.com/almsomnia/boncos/commit/d8c242d3390a029254334fc1780f8ed8e9e5c014))
*  Implement responsive UI with external links, improved navigation, and updated color scheme. ([c430bff4](https://github.com/almsomnia/boncos/commit/c430bff47c11932ab6173e0c14b4275ac03e1889))
*  Redesign the "How to Use" section from a 4-step card to a 3-step grid layout and reorder Tailwind CSS classes for consistency. ([a1505473](https://github.com/almsomnia/boncos/commit/a1505473ef73b1dd0edc38e73b5a07e6be6dbe80))
*  Add header navigation buttons and separators, update footer content and styling, and refine component padding and share button interactivity. ([86f55348](https://github.com/almsomnia/boncos/commit/86f553481b8954c0ddd63481179d31c1b3a55258))
*  Introduce a new `home` layout and update the index page to utilize it with refreshed hero and features content. ([611fdd00](https://github.com/almsomnia/boncos/commit/611fdd003f51bd9f64ca8db10eb44407f298a175))
* **seo:**  integrate @nuxtjs/seo and configure metadata for pages ([441ba565](https://github.com/almsomnia/boncos/commit/441ba565574f1dff7cd0b2e7258fe972762f006b))

#### 1.5.1 (2026-02-06)

##### Chores

*  update vulnerable pnpm dependencies (d5d50e0f)

### 1.5.0 (2026-02-06)

##### New Features

* **calculator:**  add payment information support and enhance sharing experience (5b32a365)
* **sharing:**  enhance share functionality and people assignment integration (7fd0d6f2)

##### Bug Fixes

* **people-assignment:**  disable item selection when fully allocated (d266c2d4)

##### Code Style Changes

*  add dashed border to UCard and update item allocation heading text. (9a05cabd)

### 1.4.0 (2026-01-29)

##### New Features

*  Add scroll-to-top on onboarding completion, conditionally display the people assignment card, and include a test for the onboarding scroll behavior. (65f39c5f)
*  Implement scrolling to the current onboarding step and add a test to verify its functionality. (e5bc8739)
*  Add "Pembagian Tagihan" as the fourth onboarding step to the calculation flow and update related tests. (356ba254)
*  Add item allocation status alert and empty state for people list. (7c4ad20f)
*  introduce people assignment functionality with a new type, component, and composable, integrated into the calculation page. (8e811de2)

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

