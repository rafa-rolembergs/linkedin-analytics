const Panel = {

    panel: null,
    statusEl: null,
    companyAreaEl: null,
    currentContext: null,

    create(page, context = null){

        if(!this.panel){

            this.panel = document.createElement("div");
            this.panel.id = "notopo-panel";
            this.panel.innerHTML = `

                <h2>NoTopo</h2>
                <hr>
                <b>Página</b><br>
                <span id="notopo-page"></span>
                <br><br>
                <div id="company-area"></div>
                <div style="display:flex; gap:8px; margin-top:10px;">
                    <button id="mark-icp" type="button">Mark ICP</button>
                    <button id="mark-not-icp" type="button">Mark Not ICP</button>
                </div>
                <div id="notopo-status" style="margin-top:10px; font-size:12px;"></div>

            `;

            this.panel.style.position = "fixed";
            this.panel.style.right = "20px";
            this.panel.style.top = "120px";
            this.panel.style.width = "280px";
            this.panel.style.background = "#fff";
            this.panel.style.borderRadius = "10px";
            this.panel.style.padding = "15px";
            this.panel.style.boxShadow = "0 5px 20px rgba(0,0,0,.2)";
            this.panel.style.zIndex = "999999";

            document.body.appendChild(this.panel);

            this.statusEl = document.getElementById("notopo-status");
            this.companyAreaEl = document.getElementById("company-area");

            document.getElementById("mark-icp").addEventListener("click", () => this.saveCompany("ICP"));
            document.getElementById("mark-not-icp").addEventListener("click", () => this.saveCompany("NOT_ICP"));

        }

        this.render(page, context);

    },

    render(page, context = null){

        this.currentContext = context || this.currentContext || { page, companyName: "", linkedin: "" };

        const pageEl = document.getElementById("notopo-page");

        if(pageEl){
            pageEl.textContent = page || this.currentContext.page || "OUTRA";
        }

        if(this.companyAreaEl){
            const companyName = this.currentContext.companyName || "Nenhuma empresa detectada";
            const linkedin = this.currentContext.linkedin || "";

            this.companyAreaEl.innerHTML = `
                <b>Empresa</b><br>
                ${companyName}<br>
                ${linkedin ? `<a href="${linkedin}" target="_blank" rel="noopener noreferrer">Abrir LinkedIn</a>` : ""}
            `;
        }

        if(this.statusEl){
            this.statusEl.textContent = "";
            this.statusEl.style.color = "#2e7d32";
        }

    },

    setStatus(message, isError = false){

        if(!this.statusEl) return;

        this.statusEl.textContent = message;
        this.statusEl.style.color = isError ? "#c0392b" : "#2e7d32";

    },

    async saveCompany(status){

        if(!this.currentContext || !this.currentContext.linkedin){
            this.setStatus("Nenhuma empresa disponível para salvar.", true);
            return;
        }

        const company = {
            name: this.currentContext.companyName || this.currentContext.linkedin,
            linkedin: this.currentContext.linkedin,
            status,
            addedAt: new Date().toISOString()
        };

        try{
            await Companies.save(company, status);
            this.setStatus(`${company.name} salvo como ${status}.`, false);
        }
        catch(error){
            this.setStatus("Falha ao salvar a empresa.", true);
        }

    }

};