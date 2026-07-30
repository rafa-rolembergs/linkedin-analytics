console.log("NoTopo Prospect Intelligence iniciado.");

let appState = {
    currentUrl: "",
    page: "OTHER",
    company: null,
    person: null
};

let observer = null;
let refreshTimeout = null;

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

function render() {

    appState.page = detectPage();

    appState.person = detectPerson();

    appState.company = detectCompany();

    // Se estiver em uma página de pessoa,
    // utiliza a empresa encontrada no perfil.
    if (
        !appState.company &&
        appState.person &&
        appState.person.company
    ) {

        appState.company = appState.person.company;

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

}

function refresh(force = false) {

    clearTimeout(refreshTimeout);

    refreshTimeout = setTimeout(() => {

        const url = window.location.href;

        if (!force && url === appState.currentUrl) {

            render();

            return;

        }

        appState.currentUrl = url;

        render();

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

function init() {

    appState.currentUrl = window.location.href;

    render();

    observeNavigation();

}

init();