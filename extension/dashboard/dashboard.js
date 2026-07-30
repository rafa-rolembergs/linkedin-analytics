console.log("PASSOU NO DASHBOARD");
document.addEventListener("DOMContentLoaded", async () => {

    console.log("PASSO 1 - Dashboard iniciou");

    const result = await new Promise(resolve => {
        chrome.storage.local.get(["companies"], resolve);
    });

    console.log("PASSO 2 - Resultado do storage:", result);

    const companies = result.companies || [];

    console.log("PASSO 3 - Empresas encontradas:", companies);

    const icps = companies.filter(c => c.status === "ICP");

    console.log("PASSO 4 - Empresas ICP:", icps);

    document.getElementById("companies-count").textContent = icps.length;

    const tbody = document.getElementById("companies-table");

    console.log("PASSO 5 - tbody:", tbody);

    tbody.innerHTML = "";

    icps.forEach(company => {

        console.log("Adicionando empresa:", company.name);

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${company.name}</td>
            <td>${company.status}</td>
            <td>${new Date(company.createdAt).toLocaleDateString()}</td>
        `;

        tbody.appendChild(tr);

    });

    console.log("PASSO 6 - Fim");

});