const Dashboard = {

    async load() {

        await this.updateCards();

        await this.loadCompanies();

    },

    async updateCards() {

        document.getElementById("companies-count").textContent =
            (await Companies.getICP()).length;

        document.getElementById("invited-count").textContent =
            (await Connections.getInvited()).length;

        document.getElementById("connected-count").textContent =
            (await Connections.getConnected()).length;

        document.getElementById("script1-count").textContent =
            (await Messages.getScript(1)).length;

        document.getElementById("script2-count").textContent =
            (await Messages.getScript(2)).length;

        document.getElementById("script3-count").textContent =
            (await Messages.getScript(3)).length;

    },

    async loadCompanies() {

        const tbody = document.getElementById(

            "companies-table"

        );

        tbody.innerHTML = "";

        const companies = await Companies.getICP();

        companies.forEach(company => {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>${company.name}</td>

                <td>${company.status}</td>

                <td>${new Date(company.createdAt).toLocaleDateString()}</td>

            `;

            tbody.appendChild(row);

        });

    }

};

document.addEventListener(

    "DOMContentLoaded",

    () => Dashboard.load()

);