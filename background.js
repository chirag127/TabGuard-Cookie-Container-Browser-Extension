/**
 * Chromium Container Extension - Background Service Worker
 * Handles cookie swapping logic.
 */

// Constants
const STORAGE_KEY_PREFIX = "container_cookies_";
const CURRENT_CONTAINER_KEY = "current_container_id";
const CONTAINER_DOMAIN_MAP_KEY = "container_domain_map"; // Maps containerId to domain
const DEFAULT_CONTAINERS = [
    {
        id: "default",
        name: "Default",
        color: "#808080",
        icon: "🌐",
        domain: null,
        includeSubdomains: false,
    },
    {
        id: "personal",
        name: "Personal",
        color: "#2196F3",
        icon: "👤",
        domain: "example.com",
        includeSubdomains: true,
    },
    {
        id: "work",
        name: "Work",
        color: "#FF5722",
        icon: "💼",
        domain: "work.example.com",
        includeSubdomains: true,
    },
    {
        id: "shopping",
        name: "Shopping",
        color: "#4CAF50",
        icon: "🛒",
        domain: "amazon.com",
        includeSubdomains: true,
    },
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
 * Extract clean domain from URL
 */
function extractDomain(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch (e) {
        console.warn("Failed to extract domain from:", url);
        return null;
    }
}

/**
 * Check if a cookie's domain matches the target domain
 * @param {string} cookieDomain - Cookie's domain (may start with '.')
 * @param {string} targetDomain - Target domain to match
 * @param {boolean} includeSubdomains - Whether to include subdomains
 */
function matchesDomain(cookieDomain, targetDomain, includeSubdomains) {
    if (!targetDomain) return true; // No domain filter means match all

    // Normalize cookie domain (remove leading dot)
    const normalizedCookieDomain = cookieDomain.startsWith(".")
        ? cookieDomain.substring(1)
        : cookieDomain;

    // Exact match
    if (normalizedCookieDomain === targetDomain) {
        return true;
    }

    // Subdomain match
    if (
        includeSubdomains &&
        normalizedCookieDomain.endsWith("." + targetDomain)
    ) {
        return true;
    }

    // Parent domain match (cookie for .example.com matches example.com)
    if (
        includeSubdomains &&
        targetDomain.endsWith("." + normalizedCookieDomain)
    ) {
        return true;
    }

    return false;
}

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
 * Save current cookies to storage for the given container ID.
 * Only saves cookies matching the container's domain.
 * @param {string} containerId - Container ID
 * @param {string} domain - Domain to filter cookies (null for all)
 * @param {boolean} includeSubdomains - Whether to include subdomains
 */
async function saveCurrentSession(
    containerId,
    domain = null,
    includeSubdomains = false
) {
    const allCookies = await chrome.cookies.getAll({});

    // Filter cookies by domain if specified
    const cookies = domain
        ? allCookies.filter((cookie) =>
              matchesDomain(cookie.domain, domain, includeSubdomains)
          )
        : allCookies;

    const storageKey = STORAGE_KEY_PREFIX + containerId;
    await chrome.storage.local.set({ [storageKey]: cookies });
    console.log(
        `Saved ${cookies.length} cookies for container: ${containerId}` +
            (domain ? ` (domain: ${domain})` : "")
    );
}

/**
 * Clear cookies from the browser for a specific domain.
 * @param {string} domain - Domain to clear cookies for (null for all)
 * @param {boolean} includeSubdomains - Whether to include subdomains
 */
async function clearBrowserSession(domain = null, includeSubdomains = false) {
    const allCookies = await chrome.cookies.getAll({});

    // Filter cookies by domain if specified
    const cookiesToClear = domain
        ? allCookies.filter((cookie) =>
              matchesDomain(cookie.domain, domain, includeSubdomains)
          )
        : allCookies;

    const promises = cookiesToClear.map((cookie) => {
        const url = getCookieUrl(cookie);
        return chrome.cookies.remove({
            url: url,
            name: cookie.name,
            storeId: cookie.storeId,
        });
    });
    await Promise.all(promises);
    console.log(
        `Cleared ${cookiesToClear.length} cookies` +
            (domain ? ` for domain: ${domain}` : "")
    );
}

/**
 * Restore cookies from storage for the given container ID.
 * Only restores cookies matching the container's domain.
 * @param {string} containerId - Container ID
 * @param {string} domain - Domain to filter cookies (null for all)
 * @param {boolean} includeSubdomains - Whether to include subdomains
 */
async function restoreSession(
    containerId,
    domain = null,
    includeSubdomains = false
) {
    const storageKey = STORAGE_KEY_PREFIX + containerId;
    const result = await chrome.storage.local.get(storageKey);
    const allCookies = result[storageKey] || [];

    // Filter cookies by domain if specified
    const cookies = domain
        ? allCookies.filter((cookie) =>
              matchesDomain(cookie.domain, domain, includeSubdomains)
          )
        : allCookies;

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
        `Restored ${cookies.length} cookies for container: ${containerId}` +
            (domain ? ` (domain: ${domain})` : "")
    );
}

/**
 * Switch from current container to target container for a specific domain.
 * @param {string} targetContainerId - Target container ID
 * @param {string} targetDomain - Domain to switch (required for site-specific containers)
 * @param {boolean} includeSubdomains - Whether to include subdomains
 */
async function switchContainer(
    targetContainerId,
    targetDomain = null,
    includeSubdomains = false
) {
    // 1. Get current container and containers list
    const storageData = await chrome.storage.local.get([
        CURRENT_CONTAINER_KEY,
        "containers",
    ]);
    const currentContainerId = storageData[CURRENT_CONTAINER_KEY] || "default";
    const containers = storageData.containers || [];

    // Find current and target container info
    const currentContainer = containers.find(
        (c) => c.id === currentContainerId
    );
    const targetContainer = containers.find((c) => c.id === targetContainerId);

    if (!targetContainer) {
        console.error("Target container not found:", targetContainerId);
        return;
    }

    // Use container's domain if not explicitly provided
    const domain = targetDomain || targetContainer.domain;
    const useSubdomains =
        includeSubdomains || targetContainer.includeSubdomains || false;

    if (
        currentContainerId === targetContainerId &&
        currentContainer?.domain === domain
    ) {
        console.log("Already in target container for this domain.");
        return;
    }

    console.log(
        `Switching from ${currentContainerId} to ${targetContainerId}...` +
            (domain ? ` for domain: ${domain}` : "")
    );

    // 2. Save current session for this domain
    if (currentContainer) {
        const currentDomain = currentContainer.domain || domain;
        const currentSubdomains =
            currentContainer.includeSubdomains || useSubdomains;
        await saveCurrentSession(
            currentContainerId,
            currentDomain,
            currentSubdomains
        );
    }

    // 3. Clear browser session for this domain only
    await clearBrowserSession(domain, useSubdomains);

    // 4. Restore target session for this domain
    await restoreSession(targetContainerId, domain, useSubdomains);

    // 5. Update current container ID
    await chrome.storage.local.set({
        [CURRENT_CONTAINER_KEY]: targetContainerId,
    });

    // 6. Reload only tabs matching the domain
    const tabs = await chrome.tabs.query({});
    const tabsToReload = domain
        ? tabs.filter((tab) => {
              const tabDomain = extractDomain(tab.url);
              return (
                  tabDomain && matchesDomain(tabDomain, domain, useSubdomains)
              );
          })
        : tabs;

    tabsToReload.forEach((tab) => {
        if (tab.id) {
            chrome.tabs.reload(tab.id);
        }
    });

    console.log(
        `Container switch complete. Reloaded ${tabsToReload.length} tabs` +
            (domain ? ` for domain: ${domain}` : "")
    );
}

/**
 * Message Listener
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "switchContainer") {
        switchContainer(
            request.containerId,
            request.domain || null,
            request.includeSubdomains || false
        )
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

    if (request.action === "getCurrentTab") {
        chrome.tabs
            .query({ active: true, currentWindow: true })
            .then((tabs) => {
                if (tabs[0]) {
                    const domain = extractDomain(tabs[0].url);
                    sendResponse({ domain, url: tabs[0].url });
                } else {
                    sendResponse({ domain: null, url: null });
                }
            });
        return true;
    }
});
