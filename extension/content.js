console.log("NoTopo Prospect Intelligence");

let refreshTimer = null;
let hasInitialized = false;

function renderCurrentPage(){

    const context = CompanyDetector.getContext(document, location.href);

    Panel.create(context.page, context);

    if(context.isCompanyPage){
        console.log("Empresa:", context.companyName || context.linkedin);
    }

}

function scheduleRefresh(){

    if(refreshTimer){
        window.clearTimeout(refreshTimer);
    }

    refreshTimer = window.setTimeout(() => {
        refreshTimer = null;
        renderCurrentPage();
    }, 0);

}

function attachNavigationListeners(){

    const originalPushState = history.pushState;
    history.pushState = function(...args){
        const result = originalPushState.apply(this, args);
        scheduleRefresh();
        return result;
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args){
        const result = originalReplaceState.apply(this, args);
        scheduleRefresh();
        return result;
    };

    window.addEventListener("popstate", scheduleRefresh);

    const observer = new MutationObserver(() => scheduleRefresh());
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });

}

function init(){

    if(hasInitialized) return;

    hasInitialized = true;
    renderCurrentPage();
    attachNavigationListeners();

}

init();