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

        const buttons = [...document.querySelectorAll("button")];

        const hasPending = buttons.some(button =>
            ["Pendente", "Pending"].includes(button.innerText.trim())
        );

        const hasMessage = buttons.some(button =>
            ["Mensagem", "Message"].includes(button.innerText.trim())
        );

        if (hasPending) {

            await Connections.updateStatus(
                appState.person.linkedin,
                "INVITED"
            );

            return;

        }

        if (hasMessage) {

            await Connections.updateStatus(
                appState.person.linkedin,
                "CONNECTED"
            );

        }

    }, 500);

}

function observeInviteButtons() {

    document.addEventListener("click", async (event) => {

        const button = event.target.closest("button");

        if (!button) return;

        const text = button.innerText.trim();

        if (
            text === "Enviar" ||
            text === "Enviar sem nota"
        ) {

            if (!appState.person) return;

            // garante que a pessoa esteja salva
            let person = await People.find(appState.person.linkedin);

            if (!person) {

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

                person = await People.find(appState.person.linkedin);

            }

            if (!person) return;

            await Connections.save(
                person,
                "INVITED"
            );

            console.log("Convite enviado:", person.name);

        }

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