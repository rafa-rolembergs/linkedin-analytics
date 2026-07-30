document.addEventListener("DOMContentLoaded", async () => {

    console.log("Dashboard iniciado");

    const result = await new Promise(resolve => {
        chrome.storage.local.get(["companies"], resolve);
    });

    console.log(result);

    const companies = result.companies || [];

    document.getElementById("companies-count").textContent =
        companies.filter(c => c.status === "ICP").length;

    const tbody = document.getElementById("companies-table");

    tbody.innerHTML = "";

    companies
        .filter(c => c.status === "ICP")
        .forEach(company => {

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${company.name}</td>
                <td>${company.status}</td>
                <td>${new Date(company.createdAt).toLocaleDateString()}</td>
            `;

            tbody.appendChild(tr);

        });

});