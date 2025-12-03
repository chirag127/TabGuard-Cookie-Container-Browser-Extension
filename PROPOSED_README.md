# TabGuard-Cookie-Container-Browser-Extension

[![Build Status](https://img.shields.io/github/actions/workflow/status/chirag127/TabGuard-Cookie-Container-Browser-Extension/ci.yml?style=flat-square)](https://github.com/chirag127/TabGuard-Cookie-Container-Browser-Extension/actions)
[![Coverage](https://img.shields.io/codecov/c/github/chirag127/TabGuard-Cookie-Container-Browser-Extension?style=flat-square)](https://codecov.io/github/chirag127/TabGuard-Cookie-Container-Browser-Extension)
[![Tech Stack](https://img.shields.io/badge/TechStack-JavaScript%2C_WebExtensions_API-blue?style=flat-square)](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
[![Linting](https://img.shields.io/badge/Linting-ESLint-orange?style=flat-square)](https://eslint.org/)
[![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgray?style=flat-square)](https://creativecommons.org/licenses/by-nc/4.0/)
[![GitHub Stars](https://img.shields.io/github/stars/chirag127/TabGuard-Cookie-Container-Browser-Extension?style=flat-square)](https://github.com/chirag127/TabGuard-Cookie-Container-Browser-Extension)

**Elevate your browsing privacy with TabGuard, a robust Chromium extension for advanced cookie containerization. Isolate cookies per domain, including subdomains, ensuring maximum security and a cleaner browsing experience with zero external dependencies.**

---


## 🚀 Features

*   **Domain-Specific Cookie Isolation:** Create distinct cookie containers for each website domain you visit.
*   **Subdomain Support:** Ensures isolation extends to subdomains (e.g., `mail.google.com` and `drive.google.com` get separate containers).
*   **Automatic Tab Reloading:** Seamlessly reloads tabs into their correct cookie containers after changes or initial load.
*   **Privacy-First Architecture:** Built with a strong emphasis on user privacy; no external tracking or data collection.
*   **No Dependencies:** Lean and efficient, relying solely on the WebExtensions API.
*   **Cross-Browser Compatibility:** Designed for Chromium-based browsers (Chrome, Edge, Brave, etc.).

---

## 🏗️ Architecture

mermaid
graph TD
    A[Browser Environment]
    B(WebExtensions API)
    C[TabGuard Service Worker]
    D[TabGuard Content Scripts]
    E[Cookie Storage API]
    F[Browser Tabs]
    G(Storage API for Container Mapping)

    A --> B
    B --> C
    B --> D
    C --> E
    C --> G
    C --> F
    D --> B
    F --> C
    E --> C
    G --> C

    subgraph Core Logic
        C
        G
    end

    subgraph Runtime Components
        D
        E
        F
    end


---


## 📚 Table of Contents

*   [Features](#-features)
*   [Architecture](#-architecture)
*   [Table of Contents](#-table-of-contents)
*   [🤖 AI Agent Directives](#-ai-agent-directives)
*   [🛠️ Development Setup](#-development-setup)
*   [🚀 Development Scripts](#-development-scripts)
*   [⚖️ Principles & Standards](#-principles--standards)
*   [📜 Contributing](#-contributing)
*   [🐛 Bug Report](#-bug-report)
*   [💡 Pull Request Template](#-pull-request-template)
*   [🔒 Security](#-security)
*   [📄 License](#-license)

---

## 🤖 AI Agent Directives

<details>
<summary>Expand for Agent Directives</summary>

# SYSTEM: APEX TECHNICAL AUTHORITY & ELITE ARCHITECT (DECEMBER 2025 EDITION)

## 1. IDENTITY & PRIME DIRECTIVE
**Role:** You are a Senior Principal Software Architect and Master Technical Copywriter with **40+ years of elite industry experience**. You operate with absolute precision, enforcing FAANG-level standards and the wisdom of "Managing the Unmanageable."
**Context:** Current Date is **December 2025**. You are building for the 2026 standard.
**Output Standard:** Deliver **EXECUTION-ONLY** results. No plans, no "reporting"—only executed code, updated docs, and applied fixes.
**Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

---

## 2. INPUT PROCESSING & COGNITION
*   **SPEECH-TO-TEXT INTERPRETATION PROTOCOL:**
    *   **Context:** User inputs may contain phonetic errors (homophones, typos).
    *   **Semantic Correction:** **STRICTLY FORBIDDEN** from executing literal typos. You must **INFER** technical intent based on the project context.
    *   **Logic Anchor:** Treat the `README.md` as the **Single Source of Truth (SSOT)**.
*   **MANDATORY MCP INSTRUMENTATION:**
    *   **No Guessing:** Do not hallucinate APIs.
    *   **Research First:** Use `linkup`/`brave` to search for **December 2025 Industry Standards**, **Security Threats**, and **2026 UI Trends**.
    *   **Validation:** Use `docfork` to verify *every* external API signature.
    *   **Reasoning:** Engage `clear-thought-two` to architect complex flows *before* writing code.

---

## 3. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)
**Directives:** Detect the project type and apply the **Apex Toolchain**. This repository, `TabGuard-Cookie-Container-Browser-Extension`, is a JavaScript-based browser extension.

*   **PRIMARY SCENARIO: WEB / APP / EXTENSION (TypeScript/JavaScript)**
    *   **Stack:** This project leverages **JavaScript (ES2023+)** and the **WebExtensions API**. For linting and formatting, **ESLint** is the standard, configured for maximum strictness. **Vitest** is the preferred framework for unit and integration testing.
    *   **Architecture:** Follows a **Service Worker / Content Script** model typical for modern browser extensions, ensuring a lean and performant runtime. State management relies on the browser's `Storage API` or `IndexedDB` where appropriate. **Feature-Sliced Design (FSD)** principles are encouraged for organizing code, even within the extension architecture.
    *   **Tooling:** **WXT (Web Extension Tooling)** is recommended for streamlined development and build processes across different browser platforms.
    *   **Testing:** **Vitest** for unit tests, **Playwright** for end-to-end testing of extension functionality within browser contexts.

</details>

---

## 🛠️ Development Setup

This project requires Node.js (v20.x or later recommended) and npm/yarn/pnpm.

1.  **Clone the repository:**
    bash
      git clone https://github.com/chirag127/TabGuard-Cookie-Container-Browser-Extension.git
      cd TabGuard-Cookie-Container-Browser-Extension
    

2.  **Install dependencies:**
    bash
      # Using npm
      npm install

      # Using yarn
      # yarn install

      # Using pnpm
      # pnpm install
    

---

## 🚀 Development Scripts

Available scripts in `package.json`:

| Script        | Description                                                         |
| :------------ | :------------------------------------------------------------------ |
| `dev`         | Starts the development server (e.g., with WXT, for hot reloading) |
| `build`       | Builds the extension for production deployment.                     |
| `lint`        | Runs ESLint to check for code style and potential errors.           |
| `lint:fix`    | Runs ESLint and attempts to auto-fix linting issues.                |
| `test`        | Runs unit and integration tests using Vitest.                       |
| `test:e2e`    | Runs end-to-end tests using Playwright.                             |
| `preview`     | Locally previews the production build.                              |

---

## ⚖️ Principles & Standards

*   **SOLID:** Applied where applicable to maintainable JavaScript code.
*   **DRY (Don't Repeat Yourself):** Avoid redundant code through abstraction and utility functions.
*   **YAGNI (You Ain't Gonna Need It):** Implement only necessary features to keep the extension lightweight and focused.
*   **KISS (Keep It Simple, Stupid):** Prioritize clear, straightforward implementations.
*   **Zero Dependencies:** Adhere to the principle of minimal external dependencies for stability and security.

---

## 📜 Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](https://github.com/chirag127/TabGuard-Cookie-Container-Browser-Extension/blob/main/.github/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 🐛 Bug Report

If you find a bug, please use our [Bug Report Template](https://github.com/chirag127/TabGuard-Cookie-Container-Browser-Extension/issues/new?template=bug_report.md) to report it. Ensure you provide detailed steps to reproduce the issue.

---

## 💡 Pull Request Template

When submitting a Pull Request, please use our [Pull Request Template](https://github.com/chirag127/TabGuard-Cookie-Container-Browser-Extension/blob/main/.github/PULL_REQUEST_TEMPLATE.md).

---

## 🔒 Security

We take security seriously. Please refer to our [Security Policy](https://github.com/chirag127/TabGuard-Cookie-Container-Browser-Extension/blob/main/.github/SECURITY.md) for information on reporting security vulnerabilities.

---

## 📄 License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0). See the [LICENSE](https://github.com/chirag127/TabGuard-Cookie-Container-Browser-Extension/blob/main/LICENSE) file for details.

![CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgray?style=flat-square)
