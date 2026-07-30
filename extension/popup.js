document.addEventListener("DOMContentLoaded", async () => {

    await loadSummary();

    document
        .getElementById("open-dashboard")
        .addEventListener("click", openDashboard);

    document
        .getElementById("open-linkedin")
        .addEventListener("click", openLinkedin);

});

async function loadSummary() {

    try {

        const companies = await Companies.getICP();

        const invited = await Connections.getInvited();

        const connected = await Connections.getConnected();

        document.getElementById("popup-companies").textContent =
            companies.length;

        document.getElementById("popup-connections").textContent =
            invited.length;

        document.getElementById("popup-accepted").textContent =
            connected.length;

    }
    catch (error) {

        console.error("Erro ao carregar resumo:", error);

    }

}

function openDashboard() {

    chrome.tabs.create({

        url: chrome.runtime.getURL("dashboard/index.html")

    });

}

function openLinkedin() {

    chrome.tabs.create({

        url: "https://www.linkedin.com/feed/"

    });

}