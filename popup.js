/**
 * Chromium Container Extension - Popup Logic
 */

document.addEventListener("DOMContentLoaded", async () => {
    const containerList = document.getElementById("container-list");
    const currentNameEl = document.getElementById("current-name");
    const currentIconEl = document.getElementById("current-icon");

    // Fetch containers and current state
    const response = await chrome.runtime.sendMessage({
        action: "getContainers",
    });
    const { containers, current_container_id } = response;

    renderContainers(containers, current_container_id);
    updateStatus(containers, current_container_id);

    function renderContainers(containers, activeId) {
        containerList.innerHTML = "";

        containers.forEach((container) => {
            const li = document.createElement("li");
            li.className = `container-item ${
                container.id === activeId ? "active" : ""
            }`;
            li.dataset.id = container.id;

            const iconSpan = document.createElement("span");
            iconSpan.className = "container-icon";
            iconSpan.textContent = container.icon;

            const nameSpan = document.createElement("span");
            nameSpan.className = "container-name";
            nameSpan.textContent = container.name;

            const indicator = document.createElement("div");
            indicator.className = "container-indicator";
            indicator.style.backgroundColor = container.color;

            li.appendChild(iconSpan);
            li.appendChild(nameSpan);
            li.appendChild(indicator);

            li.addEventListener("click", () => handleSwitch(container.id));

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

    async function handleSwitch(targetId) {
        // Optimistic UI update or loading state could go here
        document.body.classList.add("loading");

        try {
            const response = await chrome.runtime.sendMessage({
                action: "switchContainer",
                containerId: targetId,
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
