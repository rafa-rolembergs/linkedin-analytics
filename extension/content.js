console.log("NoTopo Prospect Intelligence iniciado.");

let appState = {
    currentUrl: "",
    page: "OTHER",
    company: null,
    person: null
};

let observer = null;
let refreshTimeout = null;
let connectionSyncTimeout = null;

function detectPage() {

    if (typeof PageDetector !== "undefined") {
        return PageDetector.getCurrentPage();
    }

    if (typeof CompanyDetector !== "undefined") {
        return CompanyDetector.getCurrentPage();
    }

    return "OTHER";

}

function detectCompany() {

    if (
        typeof CompanyDetector !== "undefined" &&
        typeof CompanyDetector.getCompany === "function"
    ) {
        return CompanyDetector.getCompany();
    }

    return null;

}

function detectPerson() {

    if (
        typeof PersonDetector !== "undefined" &&
        typeof PersonDetector.getPerson === "function"
    ) {
        return PersonDetector.getPerson();
    }

    return null;

}

async function syncConnectionStatus() {

    if (!appState.person || typeof Connections === "undefined") return;

    clearTimeout(connectionSyncTimeout);

    connectionSyncTimeout = setTimeout(async () => {

        const connection = await Connections.find(
            appState.person.linkedin
        );

        // Não existe convite registrado pela extensão.
        // Não faz nada.
        if (!connection) return;

        // ----------------------------
        // Primeira conexão (1º)
        // ----------------------------

        const firstDegree = [...document.querySelectorAll("p, span")].some(el => {

            const text = el.innerText?.trim();

            return (
                text === "· 1º" ||
                text === "1º"
            );

        });

        // ----------------------------
        // Botão Enviar mensagem
        // ----------------------------

        const hasMessage = [...document.querySelectorAll("button")].some(button => {

            const text = button.innerText.trim().toLowerCase();

            return (
                text === "mensagem" ||
                text === "message" ||
                text === "enviar mensagem" ||
                text === "send message"
            );

        });

        if (
            firstDegree ||
            hasMessage
        ) {

            await Connections.updateStatus(
                appState.person.linkedin,
                "CONNECTED"
            );

            await People.updateConnectionStatus(
                appState.person.linkedin,
                "CONNECTED"
            );

        }

    }, 600);

}

function observeInviteButtons() {

    document.addEventListener("click", async (event) => {

        const button = event.target.closest("button");

        if (!button) return;

        const text = button.innerText.trim().toLowerCase();

        // Apenas o clique em Conectar cria um convite.
        if (
            text !== "conectar" &&
            text !== "connect"
        ) {
            return;
        }

        if (!appState.person) return;

        // garante que a empresa exista
        if (
            appState.company &&
            typeof Companies !== "undefined"
        ) {

            const existingCompany = await Companies.find(
                appState.company.linkedin
            );

            await Companies.save(
                appState.company,
                existingCompany?.status ?? null
            );

        }

        // garante companyId
        let companyId = null;

        if (
            appState.company &&
            typeof Companies !== "undefined"
        ) {

            const company = await Companies.find(
                appState.company.linkedin
            );

            companyId = company?.id || null;

        }

        // garante pessoa
        await People.save({

            name: appState.person.name,
            jobTitle: appState.person.jobTitle,
            linkedin: appState.person.linkedin,
            photo: appState.person.photo,
            companyName: appState.company?.name || "",
            companyId

        });

        const person = await People.find(
            appState.person.linkedin
        );

        if (!person) return;

        // Evita duplicidade
        const existingConnection = await Connections.find(
            person.linkedin
        );

        if (existingConnection) {

            console.log("Convite já registrado.");

            return;

        }

        await Connections.save(
            person,
            "INVITED"
        );

        await People.updateConnectionStatus(
            person.linkedin,
            "INVITED"
        );

        console.log("Convite registrado:", person.name);

    });

}

async function render() {

    appState.page = detectPage();

    appState.person = detectPerson();

    appState.company = detectCompany();

    if (
        !appState.company &&
        appState.person &&
        appState.person.company
    ) {

        appState.company = appState.person.company;

    }
// ===========================
// Salva automaticamente a empresa
// ===========================

if (
    appState.company &&
    typeof Companies !== "undefined"
) {

    const existingCompany = await Companies.find(
        appState.company.linkedin
    );

    await Companies.save(

        appState.company,

        existingCompany?.status ?? null

    );

}
// ===========================
// Salva automaticamente a pessoa
// ===========================

if (
    appState.person &&
    typeof People !== "undefined"
) {

    let companyId = null;

    if (
        appState.company &&
        typeof Companies !== "undefined"
    ) {

        const company = await Companies.find(
            appState.company.linkedin
        );

        companyId = company?.id || null;

    }

    await People.save({

        name: appState.person.name,

        jobTitle: appState.person.jobTitle,

        linkedin: appState.person.linkedin,

        photo: appState.person.photo,

        companyName: appState.company?.name || "",

        companyId

    });

}
    if (
        typeof Panel !== "undefined" &&
        typeof Panel.render === "function"
    ) {

        Panel.render({

            page: appState.page,

            company: appState.company,

            person: appState.person

        });

    }

    if (
        typeof Connections !== "undefined" &&
        appState.person
    ) {

        await syncConnectionStatus();

    }

}

function refresh(force = false) {

    clearTimeout(refreshTimeout);

    refreshTimeout = setTimeout(async () => {

        const url = window.location.href;

        if (!force && url === appState.currentUrl) {

            await render();

            return;

        }

        appState.currentUrl = url;

        await render();

    }, 200);

}

function observeNavigation() {

    const originalPushState = history.pushState;

    history.pushState = function (...args) {

        const result = originalPushState.apply(this, args);

        refresh(true);

        return result;

    };

    const originalReplaceState = history.replaceState;

    history.replaceState = function (...args) {

        const result = originalReplaceState.apply(this, args);

        refresh(true);

        return result;

    };

    window.addEventListener("popstate", () => refresh(true));

    observer = new MutationObserver(() => {

        refresh(false);

    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

}

async function init() {

    appState.currentUrl = window.location.href;

    await render();

    observeNavigation();

    observeInviteButtons();

}

init();