console.log("PASSOU NO DASHBOARD");

document.addEventListener("DOMContentLoaded", async () => {

    console.log("PASSO 1 - Dashboard iniciou");

    const result = await new Promise(resolve => {

        chrome.storage.local.get(
            ["companies", "people", "connections"],
            resolve
        );

    });

    console.log("PASSO 2 - Resultado:", result);

    const companies = result.companies || [];
    const people = result.people || [];
    const connections = result.connections || [];

    // ===========================
    // KPIs
    // ===========================

    const icps = companies.filter(c => c.status === "ICP");

    const invited = connections.filter(
        c => c.status === "INVITED"
    );

    const connected = connections.filter(
        c => c.status === "CONNECTED"
    );

document.getElementById("companies-count").textContent = companies.length;    document.getElementById("people-count").textContent = people.length;
    document.getElementById("invited-count").textContent = invited.length;
    document.getElementById("connected-count").textContent = connected.length;

    // ===========================
    // TABELA EMPRESAS
    // ===========================

    const tbody = document.getElementById("companies-table");

    if (!tbody) return;

    tbody.innerHTML = "";

    companies
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(company => {

            // Pessoas desta empresa
           const peopleFromCompany = people.filter(person => {

    if (person.companyId) {

        return person.companyId === company.id;

    }

    return (
        person.companyName?.toLowerCase() ===
        company.name?.toLowerCase()
    );

});

            // Conexões dessas pessoas
            const companyConnections = connections.filter(connection =>

                peopleFromCompany.some(person =>
                    person.linkedin === connection.personLinkedin
                )

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
                <td>${company.status || ""}</td>
                <td>${invitedTotal}</td>
                <td>${connectedTotal}</td>
                <td>${new Date(company.createdAt).toLocaleDateString()}</td>
            `;

            tbody.appendChild(tr);

        });

    console.log("Dashboard carregado.");

});