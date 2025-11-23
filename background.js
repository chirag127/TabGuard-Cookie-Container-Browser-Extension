/**
 * Chromium Container Extension - Background Service Worker
 * Handles cookie swapping logic.
 */

// Constants
const STORAGE_KEY_PREFIX = "container_cookies_";
const CURRENT_CONTAINER_KEY = "current_container_id";
const DEFAULT_CONTAINERS = [
    { id: "default", name: "Default", color: "#808080", icon: "🌐" },
    { id: "personal", name: "Personal", color: "#2196F3", icon: "👤" },
    { id: "work", name: "Work", color: "#FF5722", icon: "💼" },
    { id: "shopping", name: "Shopping", color: "#4CAF50", icon: "🛒" },
];

/**
 * Initialize extension state on installation.
 */
chrome.runtime.onInstalled.addListener(async () => {
    const { containers } = await chrome.storage.local.get("containers");
    if (!containers) {
        await chrome.storage.local.set({
            containers: DEFAULT_CONTAINERS,
            [CURRENT_CONTAINER_KEY]: "default",
        });
        console.log("Initialized default containers.");
    }
});

/**
 * Helper: Construct a URL from domain and path for chrome.cookies.set
 */
function getCookieUrl(cookie) {
    let url = cookie.secure ? "https://" : "http://";
    if (cookie.domain.startsWith(".")) {
        url += cookie.domain.substring(1);
    } else {
        url += cookie.domain;
    }
    url += cookie.path;
    return url;
}

/**
 * Save all current cookies to storage for the given container ID.
 */
async function saveCurrentSession(containerId) {
    const cookies = await chrome.cookies.getAll({});
    const storageKey = STORAGE_KEY_PREFIX + containerId;
    await chrome.storage.local.set({ [storageKey]: cookies });
    console.log(
        `Saved ${cookies.length} cookies for container: ${containerId}`
    );
}

/**
 * Clear all cookies from the browser.
 */
async function clearBrowserSession() {
    const cookies = await chrome.cookies.getAll({});
    const promises = cookies.map((cookie) => {
        const url = getCookieUrl(cookie);
        return chrome.cookies.remove({
            url: url,
            name: cookie.name,
            storeId: cookie.storeId,
        });
    });
    await Promise.all(promises);
    console.log(`Cleared ${cookies.length} cookies.`);
}

/**
 * Restore cookies from storage for the given container ID.
 */
async function restoreSession(containerId) {
    const storageKey = STORAGE_KEY_PREFIX + containerId;
    const result = await chrome.storage.local.get(storageKey);
    const cookies = result[storageKey] || [];

    const promises = cookies.map((cookie) => {
        // Prepare the cookie object for chrome.cookies.set
        // We must remove properties that are not supported by 'set' or are read-only
        const url = getCookieUrl(cookie);
        const newCookie = {
            url: url,
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path,
            secure: cookie.secure,
            httpOnly: cookie.httpOnly,
            expirationDate: cookie.expirationDate,
            storeId: cookie.storeId,
            sameSite: cookie.sameSite,
        };

        // HostOnly cookies shouldn't have the domain property set explicitly in some cases,
        // but usually setting domain works if it matches.
        // However, chrome.cookies.set requires strict adherence.
        // If it's a host-only cookie, the domain usually doesn't start with '.'

        return chrome.cookies.set(newCookie).catch((err) => {
            console.warn(`Failed to set cookie ${cookie.name}:`, err);
        });
    });

    await Promise.all(promises);
    console.log(
        `Restored ${cookies.length} cookies for container: ${containerId}`
    );
}

/**
 * Switch from current container to target container.
 */
async function switchContainer(targetContainerId) {
    // 1. Get current container ID
    const result = await chrome.storage.local.get(CURRENT_CONTAINER_KEY);
    const currentContainerId = result[CURRENT_CONTAINER_KEY] || "default";

    if (currentContainerId === targetContainerId) {
        console.log("Already in target container.");
        return;
    }

    console.log(
        `Switching from ${currentContainerId} to ${targetContainerId}...`
    );

    // 2. Save current session
    await saveCurrentSession(currentContainerId);

    // 3. Clear browser session
    await clearBrowserSession();

    // 4. Restore target session
    await restoreSession(targetContainerId);

    // 5. Update current container ID
    await chrome.storage.local.set({
        [CURRENT_CONTAINER_KEY]: targetContainerId,
    });

    // 6. Reload all tabs to apply new cookies (Optional but recommended)
    const tabs = await chrome.tabs.query({});
    tabs.forEach((tab) => chrome.tabs.reload(tab.id));

    console.log("Container switch complete.");
}

/**
 * Message Listener
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "switchContainer") {
        switchContainer(request.containerId)
            .then(() => sendResponse({ success: true }))
            .catch((err) => {
                console.error("Switch failed:", err);
                sendResponse({ success: false, error: err.message });
            });
        return true; // Keep channel open for async response
    }

    if (request.action === "getContainers") {
        chrome.storage.local
            .get(["containers", CURRENT_CONTAINER_KEY])
            .then((data) => {
                sendResponse(data);
            });
        return true;
    }
});
