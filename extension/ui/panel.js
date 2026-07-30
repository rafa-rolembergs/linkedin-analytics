const Panel = {

    panel: null,
    pageElement: null,
    companyElement: null,
    statusElement: null,

    context: null,

    render(context) {

        this.context = context;

        if (!this.panel) {

            this.create();

        }

        this.update();

    },

    create() {

        this.panel = document.createElement("div");

        this.panel.id = "notopo-panel";

        this.panel.innerHTML = `

            <div class="notopo-header">

                <h2>NoTopo Prospect</h2>

            </div>

            <div class="notopo-section">

                <strong>Página</strong>

                <div id="notopo-page"></div>

            </div>

            <div class="notopo-section">

                <strong>Empresa</strong>

                <div id="notopo-company"></div>

            </div>

            <div class="notopo-actions">

                <button id="notopo-icp">

                    Marcar como ICP

                </button>

                <button id="notopo-not-icp">

                    Não é ICP

                </button>

            </div>

            <div id="notopo-status"></div>

        `;

        document.body.appendChild(this.panel);

        this.pageElement = this.panel.querySelector("#notopo-page");

        this.companyElement = this.panel.querySelector("#notopo-company");

        this.statusElement = this.panel.querySelector("#notopo-status");

        this.panel
            .querySelector("#notopo-icp")
            .addEventListener("click", () => this.save("ICP"));

        this.panel
            .querySelector("#notopo-not-icp")
            .addEventListener("click", () => this.save("NOT_ICP"));

    },

    async update() {

        if (!this.context) {

            return;

        }

        this.pageElement.textContent = this.context.page;

        if (!this.context.company) {

            this.companyElement.innerHTML = "Nenhuma empresa detectada.";

            this.statusElement.innerHTML = "";

            return;

        }

        this.companyElement.innerHTML = `

            <strong>${this.context.company.name}</strong>

            <br>

            <small>${this.context.company.linkedin}</small>

        `;

        const company = await Companies.find(

            this.context.company.linkedin

        );

        if (!company) {

            this.statusElement.innerHTML = "";

            return;

        }

        if (company.status === "ICP") {

            this.statusElement.innerHTML = "✅ Empresa marcada como ICP";

            return;

        }

        if (company.status === "NOT_ICP") {

            this.statusElement.innerHTML = "❌ Empresa marcada como Não ICP";

        }

    },

    async save(status) {

        if (!this.context) {

            return;

        }

        if (!this.context.company) {

            return;

        }

        await Companies.save(

            this.context.company,

            status

        );

        await this.update();

    }

};