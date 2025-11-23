# Chromium Container Extension

A vanilla JavaScript browser extension for Chromium-based browsers that simulates "Container Tabs" functionality by swapping cookies.

## Features

-   **Session Management**: Switch between multiple browsing contexts (Default, Personal, Work, Shopping).
-   **Cookie Swapping**: Automatically saves current cookies and restores the target container's cookies.
-   **Privacy**: effectively clears your session when switching, ensuring no cross-contamination between containers.
-   **Vanilla Implementation**: No build steps, frameworks, or dependencies.

## Installation

1.  Clone or download this repository.
2.  Open your browser and navigate to `chrome://extensions`.
3.  Enable **Developer mode** (toggle in the top right).
4.  Click **Load unpacked**.
5.  Select the `Chromium-Container-Extension` folder.

## Usage

1.  Click the extension icon in the toolbar.
2.  Select a container from the list (e.g., "Work").
3.  The extension will:
    -   Save your current cookies to the active container.
    -   Clear all browser cookies.
    -   Restore the cookies for the "Work" container.
    -   Reload all open tabs.

## Technical Details

-   **Manifest V3**: Uses the latest extension standard.
-   **Permissions**: Requires `cookies`, `storage`, and `tabs` permissions, plus host permissions for `<all_urls>` to manage cookies across all domains.
-   **Storage**: Cookies are serialized and stored in `chrome.storage.local`.

## Development

-   `manifest.json`: Extension configuration.
-   `background.js`: Service worker containing the cookie swapping engine.
-   `popup.html` / `popup.js` / `style.css`: The user interface.
