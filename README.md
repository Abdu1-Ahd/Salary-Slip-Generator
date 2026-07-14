<div align="center">

# 🧾 Salary Slip Generator

**A professional, authenticated web application for generating, previewing, and exporting pixel-perfect salary slips.**

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Clerk Auth](https://img.shields.io/badge/Auth-Clerk-6c47ff?logo=clerk&logoColor=white)](https://clerk.com/)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-222222?logo=github&logoColor=white)](https://abdu1-ahd.github.io/Salary-Slip-Generator/)

[Live Demo →](https://abdu1-ahd.github.io/Salary-Slip-Generator/) &nbsp;&nbsp;·&nbsp;&nbsp; [Report a Bug](https://github.com/Abdu1-Ahd/Salary-Slip-Generator/issues) &nbsp;&nbsp;·&nbsp;&nbsp; [Suggest a Feature](https://github.com/Abdu1-Ahd/Salary-Slip-Generator/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Architecture](#-architecture)
- [Export Functionality](#-export-functionality)
- [Calendar & Working Day Logic](#-calendar--working-day-logic)
- [Authentication](#-authentication)
- [Deployment](#-deployment)
- [Known Limitations](#-known-limitations)
- [Contributing](#-contributing)
- [Feedback](#-feedback)

---

## 🔍 Overview

Salary Slip Generator is a React-based single-page application designed to streamline the creation of professional salary slips. Users authenticate securely via Clerk, fill in a structured form covering employee details, pay period, earnings, deductions, company branding, and optional verification/signature fields — and get an instant live preview that updates in real time.

When ready, slips can be exported in four formats: **PDF**, **PNG**, **Excel (XLSX)**, and **CSV** — all without any backend processing. The entire application is a zero-cost, serverless, client-side solution deployed to GitHub Pages.

> This application is currently configured for Pakistani Rupee (PKR) payroll, but the underlying architecture is straightforward to adapt for any currency.

---

## ✨ Features

| Category | Feature |
|---|---|
| **Form** | Structured, sectioned input form with real-time validation |
| **Preview** | Live salary slip preview that dynamically scales to fit any screen width |
| **Salary Calculation** | Gross-to-allowance breakdown with configurable percentage splits (must sum to 100%) |
| **Proration** | Automatic partial-month salary calculation for mid-month joiners |
| **Calendar Logic** | Real working day calculation using native JS Date API — no hardcoded values |
| **Export: PDF** | High-resolution PDF export at A4 dimensions using `jsPDF` + `html-to-image` |
| **Export: PNG** | 2× pixel-ratio PNG export at exact 800px slip width |
| **Export: Excel** | Structured XLSX spreadsheet with all payroll data using `xlsx` |
| **Export: CSV** | CSV export of the same structured payroll data |
| **Print** | Browser print support via `react-to-print` |
| **QR Verification** | Optional QR code embedded in the slip footer for digital verification |
| **Digital Signature** | Optional signature image upload with signatory name and designation |
| **Company Branding** | Custom company name, address, and logo upload |
| **Authentication** | Secure sign-in/sign-up gate via Clerk — unauthenticated users are redirected |
| **Validation** | Errors surface only when the user attempts to Print or Download |
| **CI/CD** | Automated GitHub Actions deployment to GitHub Pages on every push to `main` |

---

## 🛠 Technology Stack

<details>
<summary><strong>Runtime Dependencies</strong></summary>

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19 | UI framework |
| `react-dom` | ^19 | DOM rendering |
| `@clerk/clerk-react` | ^5 | User authentication |
| `html-to-image` | ^1.11 | Slip rendering to PNG/PDF source |
| `html2canvas` | ^1.4 | Canvas-based rendering fallback |
| `jspdf` | ^4.2 | PDF generation |
| `react-to-print` | ^3.3 | Browser print support |
| `xlsx` | ^0.18 | Excel and CSV export |
| `react-qr-code` | ^2.2 | QR code generation for verification |
| `lucide-react` | ^1.24 | Icon set |

</details>

<details>
<summary><strong>Build & Dev Dependencies</strong></summary>

| Package | Version | Purpose |
|---|---|---|
| `vite` | ^8 | Build tool and dev server |
| `@vitejs/plugin-react` | ^6 | Vite plugin for React fast refresh |
| `tailwindcss` | ^4 | Utility-first CSS framework |
| `@tailwindcss/vite` | ^4 | Tailwind v4 Vite integration |
| `eslint` | ^10 | Linting |
| `postcss` | ^8 | CSS processing |

</details>

---

## 📁 Project Structure

```
salary-slip-generator/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD for GitHub Pages
├── public/                     # Static public assets
├── src/
│   ├── assets/
│   │   └── logo.jpg            # Default company logo
│   ├── components/
│   │   ├── CompanyInfoSection.jsx   # Company name, address, logo upload
│   │   ├── DeductionsSection.jsx    # Tax, PF, loan, and other deductions
│   │   ├── EarningsSection.jsx      # Gross salary + allowance % breakdown
│   │   ├── EmployeeInfoSection.jsx  # Name, ID, designation, department, DOJ
│   │   ├── ExportControls.jsx       # Print & download (PDF/PNG/XLSX/CSV) controls
│   │   ├── Header.jsx               # App header with Clerk UserButton
│   │   ├── PayPeriodSection.jsx     # Month/year, leaves, holidays, paid days
│   │   ├── QRCodeDisplay.jsx        # Renders QR code in slip footer
│   │   ├── SignatureDisplay.jsx     # Renders uploaded signature in slip footer
│   │   ├── SignatureSection.jsx     # Signature image upload, name, designation
│   │   ├── SlipPreview.jsx          # The live, print-ready salary slip component
│   │   └── VerificationSection.jsx  # QR code toggle and verification value input
│   ├── utils/
│   │   ├── calculations.js     # Core payroll math: breakdown, gross, deductions, net
│   │   ├── calendarUtils.js    # Production-grade working day & calendar calculations
│   │   ├── exporter.js         # PDF, PNG, Excel, and CSV export implementations
│   │   └── numberToWords.js    # Converts net salary number to words for slip footer
│   ├── App.jsx                 # Root application: state, derived calculations, layout
│   ├── ErrorBoundary.jsx       # React error boundary wrapping entire app
│   ├── index.css               # Global styles and Tailwind directives
│   └── main.jsx                # Entry point: Clerk provider, error handling, React root
├── .env.local                  # Local environment variables (not committed)
├── .gitignore
├── index.html
├── package.json
└── vite.config.js              # Vite config with GitHub Pages base path
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher (the CI/CD pipeline uses Node.js 24)
- **npm** v9 or higher
- A free [Clerk](https://clerk.com/) account for authentication

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Abdu1-Ahd/Salary-Slip-Generator.git

# 2. Navigate into the project directory
cd Salary-Slip-Generator

# 3. Install dependencies
npm install
```

### Environment Variables

The application requires one environment variable to be configured before it will run:

Create a `.env.local` file in the project root:

```bash
# .env.local
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
```

To get your key:
1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the **Publishable Key** from your Clerk dashboard

> **Important:** `.env.local` is listed in `.gitignore` and will never be committed. For production deployments, add this key as a GitHub Actions secret named `VITE_CLERK_PUBLISHABLE_KEY`.

### Running Locally

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## 🏛 Architecture

The application follows a unidirectional data flow model. All state lives in `App.jsx` and flows down through props to form sections and the slip preview.

```
App.jsx (single source of truth)
│
├── State: employeeInfo, payPeriod, earningsInput, percents,
│          deductions, companyInfo, verificationInfo, signatureInfo
│
├── Derived State:
│   ├── calendarUtils   → totalDays, workingDays (real calendar logic)
│   ├── calculations.js → proratedEarnings, breakdowns, net salary
│   └── Validation      → missingFields[], isReady
│
├── Form Components (receive state + setters via props)
│   └── Each section renders its own inputs and reports changes upward
│
└── Preview + Export (consume derived/prorated state)
    ├── SlipPreview     → print-ready, pixel-perfect at 800px
    └── ExportControls  → print, PDF, PNG, XLSX, CSV
```

**Key Design Decision — Proration:**
The form always shows *base monthly* amounts. The salary slip always renders *prorated* amounts calculated as:

```
Prorated Factor = Paid Days / Total Calendar Days in Month
Prorated Gross  = Gross Salary × Prorated Factor
```

This accurately handles both full-month employees and mid-month joiners.

---

## 📤 Export Functionality

All exports are generated entirely client-side — no data is sent to any server.

| Format | Engine | Notes |
|---|---|---|
| **PDF** | `jsPDF` + `html-to-image` | A4 portrait, 2× pixel ratio for crisp quality |
| **PNG** | `html-to-image` | Full 800px slip width, 2× pixel ratio |
| **Excel (XLSX)** | `xlsx` | Structured spreadsheet with all payroll sections |
| **CSV** | `xlsx` | Same structured data, compatible with any spreadsheet app |
| **Print** | `react-to-print` | Browser native print dialog |

When exporting PNG or PDF, any CSS scaling applied to the live preview is temporarily removed so the export always captures the slip at full resolution.

---

## 📅 Calendar & Working Day Logic

Working days are calculated using a dedicated, isolated utility service (`src/utils/calendarUtils.js`) that relies entirely on the native JavaScript `Date` API.

**Key guarantees:**
- ✅ Handles all months correctly (28, 29, 30, and 31 days)
- ✅ Automatically correct for leap years (Feb 2024 = 29 days, Feb 2025 = 28 days)
- ✅ Determines the actual weekday of every calendar date
- ✅ Excludes Saturdays and Sundays when counting working days
- ✅ Handles public holidays as a configurable subtraction
- ✅ Supports mid-month joiner proration (date of joining in current pay period)
- ✅ Accurate for any past, present, or future year — no hardcoded tables

```js
// Example: July 2026
getExactDaysInMonth('Jul', 2026)   // → 31
getExactWorkingDays('Jul', 2026)   // → 23 (excludes all Saturdays & Sundays)
```

---

## 🔒 Authentication

Authentication is handled by [Clerk](https://clerk.com/) via `@clerk/clerk-react`.

- The entire application is wrapped in `<ClerkProvider>` in `main.jsx`
- `<SignedIn>` / `<SignedOut>` wrappers in `App.jsx` gate access
- Unauthenticated users are automatically redirected to the Clerk sign-in page via `<RedirectToSignIn />`
- A `UserButton` in the `Header` component allows users to manage their profile and sign out
- The app renders a graceful error UI if the Clerk publishable key is missing or invalid

---

## 🌐 Deployment

The application is deployed to **GitHub Pages** via a GitHub Actions workflow (`.github/workflows/deploy.yml`).

**How it works:**
1. Every push to the `main` branch triggers the workflow automatically
2. The workflow builds the app on **Node.js 24** using `npm ci` + `npm run build`
3. The `VITE_CLERK_PUBLISHABLE_KEY` is injected securely from GitHub repository secrets during the build
4. The `dist/` output is deployed to GitHub Pages using `actions/deploy-pages@v4`

**To set up your own deployment:**

1. Fork the repository
2. Go to **Settings → Secrets and variables → Actions** and add:
   ```
   VITE_CLERK_PUBLISHABLE_KEY = pk_live_your_key_here
   ```
3. Go to **Settings → Pages** and set the source to **GitHub Actions**
4. Push to `main` — the workflow handles the rest

The live application is available at:
👉 **[https://abdu1-ahd.github.io/Salary-Slip-Generator/](https://abdu1-ahd.github.io/Salary-Slip-Generator/)**

---

## ⚠️ Known Limitations

- **Currency:** The UI is currently fixed to **PKR (Pakistani Rupee)**. The formatting uses the `en-IN` locale.
- **Allowance Structure:** The five allowance components (Basic, HRA, Conveyance, Medical, Deputation) are fixed. Custom allowance names are not yet supported.
- **Single Employee:** The application generates one slip at a time. Bulk generation is not currently supported.
- **No Persistence:** All form data lives in component state. Closing or refreshing the browser tab clears all entered data.
- **Signature Images:** Uploaded signature images must be under **2MB**.
- **Weekend Definition:** Working days exclude only Saturday and Sunday. Custom weekend configurations (e.g., Friday–Saturday in some regions) are not yet supported.

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get involved:

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/your-username/Salary-Slip-Generator.git

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make your changes, then commit
git commit -m "feat: describe your change clearly"

# 5. Push to your fork
git push origin feature/your-feature-name

# 6. Open a Pull Request on GitHub
```

**Guidelines:**
- Follow the existing component and utility architecture
- Keep all payroll math isolated in `src/utils/calculations.js`
- Keep all calendar/date logic isolated in `src/utils/calendarUtils.js`
- UI components should consume computed results and not contain business logic
- Test across multiple months and years if touching calendar logic

---

## 💬 Feedback

Have a suggestion? Found a bug? Want to request a feature?

We'd love to hear from you! Please take a moment to share your thoughts using the form below — your feedback directly shapes the future of this project.

<div align="center">

### 👉 [Share Your Feedback](https://forms.gle/EUnzrFigRYrdQhiH8)

*Every response is read and genuinely appreciated.*

---

*Made with ❤️ — open to contributions from the community.*

</div>
