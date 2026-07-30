console.log("PASSOU NO DASHBOARD");

document.addEventListener("DOMContentLoaded", async () => {

    console.log("PASSO 1 - Dashboard iniciou");

    const result = await new Promise(resolve => {
        chrome.storage.local.get(
            ["companies", "people", "connections"],
            resolve
        );
    });

    console.log("PASSO 2 - Resultado do storage:", result);

    const companies = result.companies || [];
    const people = result.people || [];
    const connections = result.connections || [];

    const icps = companies.filter(c => c.status === "ICP");

    const invited = connections.filter(
        c => c.status === "INVITED"
    );

    const connected = connections.filter(
        c => c.status === "CONNECTED"
    );

    // ============================
    // KPIs
    // ============================

    const companiesCount = document.getElementById("companies-count");
    if (companiesCount) {
        companiesCount.textContent = icps.length;
    }

    const peopleCount = document.getElementById("people-count");
    if (peopleCount) {
        peopleCount.textContent = people.length;
    }

    const invitedCount = document.getElementById("invited-count");
    if (invitedCount) {
        invitedCount.textContent = invited.length;
    }

    const connectedCount = document.getElementById("connected-count");
    if (connectedCount) {
        connectedCount.textContent = connected.length;
    }

    // ============================
    // Tabela Empresas
    // ============================

    const tbody = document.getElementById("companies-table");

    if (!tbody) return;

    tbody.innerHTML = "";

    icps.forEach(company => {

        const companyConnections = connections.filter(
            c => c.companyId === company.id
        );

        const invitedTotal = companyConnections.filter(
            c => c.status === "INVITED"
        ).length;

        const connectedTotal = companyConnections.filter(
            c => c.status === "CONNECTED"
        ).length;

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${company.name}</td>
            <td>${company.status}</td>
            <td>${invitedTotal}</td>
            <td>${connectedTotal}</td>
            <td>${new Date(company.createdAt).toLocaleDateString()}</td>
        `;

        tbody.appendChild(tr);

    });

    console.log("Dashboard carregado.");

});