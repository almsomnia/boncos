# Boncos

**Boncos** is a sophisticated bill-splitting and expense calculator built with Nuxt 4. It helps you calculate the "true" cost of items by proportionally distributing shared costs (like taxes, service charges, and shipping) and discounts across all items.

## Key Features

- **Proportional Calculation**: Automatically distributes taxes and service charges based on each item's subtotal.
- **Discount Handling**: Applies total discounts fairly across all line items.
- **Detailed Breakdown**: View precise per-unit costs and price adjustments in a clean table format.
- **Modern UI**: Built with `@nuxt/ui` and Tailwind CSS 4 for a responsive, accessible experience.

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com)
- **UI Components**: [@nuxt/ui](https://ui.nuxt.com) (v4)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Icons**: [Lucide](https://lucide.dev) via `@nuxt/icon`

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview the production build:

```bash
pnpm preview
```