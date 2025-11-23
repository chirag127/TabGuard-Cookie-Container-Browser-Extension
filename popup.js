/**
 * Chromium Container Extension - Popup Logic
 */

document.addEventListener("DOMContentLoaded", async () => {
    const containerList = document.getElementById("container-list");
    const currentNameEl = document.getElementById("current-name");
    const currentIconEl = document.getElementById("current-icon");
    const currentSiteEl = document.getElementById("current-site");

    // Fetch current tab domain
    const tabResponse = await chrome.runtime.sendMessage({
        action: "getCurrentTab",
    });
    const currentDomain = tabResponse?.domain || null;

    // Display current site
    if (currentSiteEl && currentDomain) {
        currentSiteEl.textContent = currentDomain;
    }

    // Fetch containers and current state
    const response = await chrome.runtime.sendMessage({
        action: "getContainers",
    });
    const { containers, current_container_id } = response;

    renderContainers(containers, current_container_id, currentDomain);
    updateStatus(containers, current_container_id);

    function renderContainers(containers, activeId, activeDomain) {
        containerList.innerHTML = "";

        containers.forEach((container) => {
            const li = document.createElement("li");

            // Check if this container matches the current domain
            const matchesDomain =
                container.domain === activeDomain ||
                (container.domain === null && !activeDomain);

            li.className = `container-item ${
                container.id === activeId && matchesDomain ? "active" : ""
            }`;
            li.dataset.id = container.id;

            const iconSpan = document.createElement("span");
            iconSpan.className = "container-icon";
            iconSpan.textContent = container.icon;

            const contentDiv = document.createElement("div");
            contentDiv.className = "container-content";

            const nameSpan = document.createElement("span");
            nameSpan.className = "container-name";
            nameSpan.textContent = container.name;

            const domainSpan = document.createElement("span");
            domainSpan.className = "container-domain";
            domainSpan.textContent = container.domain || "All sites";

            contentDiv.appendChild(nameSpan);
            contentDiv.appendChild(domainSpan);

            const indicator = document.createElement("div");
            indicator.className = "container-indicator";
            indicator.style.backgroundColor = container.color;

            li.appendChild(iconSpan);
            li.appendChild(contentDiv);
            li.appendChild(indicator);

            li.addEventListener("click", () =>
                handleSwitch(container, activeDomain)
            );

            containerList.appendChild(li);
        });
    }

    function updateStatus(containers, activeId) {
        const activeContainer = containers.find((c) => c.id === activeId);
        if (activeContainer) {
            currentNameEl.textContent = activeContainer.name;
            currentIconEl.textContent = activeContainer.icon;
            currentNameEl.style.color = activeContainer.color;
        }
    }

    async function handleSwitch(targetContainer, activeDomain) {
        // Optimistic UI update or loading state could go here
        document.body.classList.add("loading");

        try {
            // Use the container's domain, or current tab domain if container domain is null
            const domain = targetContainer.domain || activeDomain;

            const response = await chrome.runtime.sendMessage({
                action: "switchContainer",
                containerId: targetContainer.id,
                domain: domain,
                includeSubdomains: targetContainer.includeSubdomains || false,
            });

            if (response && response.success) {
                // Close popup or refresh UI
                window.close();
            } else {
                console.error("Switch failed:", response?.error);
                alert("Failed to switch container. See console for details.");
                document.body.classList.remove("loading");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            document.body.classList.remove("loading");
        }
    }
});
