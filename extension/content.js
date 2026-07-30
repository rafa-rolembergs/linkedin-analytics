console.log("NoTopo Prospect Intelligence iniciado.");

let currentUrl = "";
let observer = null;
let refreshTimeout = null;

function render() {

    const page = CompanyDetector.getCurrentPage();

    const company = CompanyDetector.getCompany();

    Panel.render({

        page,

        company

    });

}

function refresh() {

    clearTimeout(refreshTimeout);

    refreshTimeout = setTimeout(() => {

        const url = window.location.href;

        if (url === currentUrl) {

            return;

        }

        currentUrl = url;

        render();

    }, 150);

}

function observeNavigation() {

    const pushState = history.pushState;

    history.pushState = function (...args) {

        const result = pushState.apply(this, args);

        refresh();

        return result;

    };

    const replaceState = history.replaceState;

    history.replaceState = function (...args) {

        const result = replaceState.apply(this, args);

        refresh();

        return result;

    };

    window.addEventListener("popstate", refresh);

    observer = new MutationObserver(() => {

        refresh();

    });

    observer.observe(document.body, {

        childList: true,

        subtree: true

    });

}

function init() {

    currentUrl = window.location.href;

    render();

    observeNavigation();

}

init();