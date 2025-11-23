# Chromium Container Extension

A vanilla JavaScript browser extension for Chromium-based browsers that simulates "Container Tabs" functionality by swapping cookies.

## Features

-   **Site-Specific Containers**: Each container is tied to a specific website domain, ensuring complete cookie isolation.
-   **Cookie Isolation**: Containers only manage cookies for their designated domain - no cross-contamination.
-   **Subdomain Support**: Configure containers to include or exclude subdomains (e.g., `mail.google.com` vs `google.com`).
-   **Efficient Switching**: Only reloads tabs matching the domain being switched, leaving other sites untouched.
-   **Privacy-First**: Cookies from other websites are never affected when switching containers.
-   **Vanilla Implementation**: No build steps, frameworks, or dependencies.

## Installation

1.  Clone or download this repository.
2.  Open your browser and navigate to `chrome://extensions`.
3.  Enable **Developer mode** (toggle in the top right).
4.  Click **Load unpacked**.
5.  Select the `Chromium-Container-Extension` folder.

## Usage

1.  Click the extension icon in the toolbar.
2.  The popup will show your current site and available containers.
3.  Select a container for the current site (e.g., "Personal" for `example.com`).
4.  The extension will:
    -   Save your current cookies **for that domain only** to the active container.
    -   Clear cookies **for that domain only**.
    -   Restore the cookies for the selected container **for that domain**.
    -   Reload only tabs matching the domain.

**Example**: If you have containers for Gmail (`gmail.com`) and switch between "Personal Gmail" and "Work Gmail", only Gmail tabs reload - your YouTube, GitHub, and other tabs remain unaffected with their cookies intact.

## Technical Details

-   **Manifest V3**: Uses the latest extension standard.
-   **Permissions**: Requires `cookies`, `storage`, and `tabs` permissions, plus host permissions for `<all_urls>` to manage cookies across all domains.
-   **Storage**: Cookies are filtered by domain, serialized, and stored in `chrome.storage.local`.

## Development

-   `manifest.json`: Extension configuration.
-   `background.js`: Service worker containing the cookie swapping engine.
-   `popup.html` / `popup.js` / `style.css`: The user interface.
