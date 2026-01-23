# Project Context: Boncos

## Project Overview

**Boncos** is a Nuxt 4 web application designed as a sophisticated bill-splitting and expense calculator. Its primary function is to calculate the "true" cost per item by proportionally distributing shared costs (like taxes, service charges, shipping) and discounts across a list of items based on their subtotal contribution.

## Tech Stack

*   **Framework:** [Nuxt 4](https://nuxt.com) (Vue 3)
*   **Language:** TypeScript
*   **UI Component Library:** [@nuxt/ui](https://ui.nuxt.com) (v4)
*   **Styling:** [Tailwind CSS 4](https://tailwindcss.com)
*   **Icons:** [@nuxt/icon](https://nuxt.com/modules/icon) (using Lucide icons in UI)
*   **Package Manager:** pnpm (inferred from lockfile)

## Project Structure

The project follows the [Nuxt 4 future structure](https://nuxt.com/docs/getting-started/upgrade#future-structure) where the source code is located in the `app/` directory.

*   `app/app.vue`: The root component wrapping the application in `UApp`.
*   `app/pages/index.vue`: The main page containing the calculator logic, state management, and input forms.
*   `app/components/`: Vue components.
    *   `TableCalculationResult.vue`: Displays the detailed breakdown of costs per item.
*   `app/utils/`: Helper functions (auto-imported).
    *   `$formatCurrency.ts`: Formats numbers to IDR currency.
    *   `$roundDecimal.ts`: Handles decimal rounding logic.
*   `nuxt.config.ts`: Nuxt configuration, including modules and import presets.

## Key Features & Logic

*   **Item Management:** Users can add multiple items with Name, Price, and Quantity.
*   **Additional Costs:** Users can add multiple extra costs (e.g., Tax, Service) which are added to the total.
*   **Discounts:** Users can specify a total discount amount which is subtracted.
*   **Proportional Calculation:**
    *   The app calculates the proportion of each item's subtotal relative to the grand subtotal.
    *   It distributes the total additional costs and total discount to each item based on this proportion.
    *   **Result:** A "Total Discounted Price" and "Item Price/Qty per Unit" for each line item.

## Development Conventions

*   **Component Style:** Vue 3 Composition API with `<script setup lang="ts">`.
*   **UI Components:** Use `@nuxt/ui` components (e.g., `<UCard>`, `<UInput>`, `<UButton>`, `<UTable>`).
*   **Utils Naming:** Utility functions are prefixed with `$` (e.g., `$formatCurrency`) and are auto-imported.
*   **State Management:** Local `ref` and `computed` properties are primarily used within pages for calculator logic.
*   **Formatting:** Prettier is configured and used for code formatting.

## Build and Run Commands

Use **pnpm** for package management.

### Setup
```bash
pnpm install
```

### Development Server
```bash
pnpm dev
```
Runs on `http://localhost:3000`.

### Production Build
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

## Styling & Theming
The application uses the default `@nuxt/ui` styling which integrates with Tailwind CSS. Global styles are defined in `app/assets/css/main.css`.
