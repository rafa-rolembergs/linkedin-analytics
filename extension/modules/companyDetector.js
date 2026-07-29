const CompanyDetector = {

    getPage(url = window.location.href){

        const href = (url || "").toLowerCase();

        if(href.includes("/search/results/companies")) return "EMPRESAS";
        if(href.includes("/search/results/people")) return "PESSOAS";
        if(href.includes("/messaging")) return "INBOX";
        if(href.includes("/company/")) return "EMPRESA";

        return "OUTRA";

    },

    getName(documentRef = document){

        const selectors = [
            "h1",
            "main h1",
            ".org-top-card h1",
            ".top-card h1",
            "[data-view-name='profile-card'] h1"
        ];

        for(const selector of selectors){

            const element = documentRef.querySelector(selector);

            if(element && element.innerText && element.innerText.trim()){
                return element.innerText.trim();
            }

        }

        const title = documentRef.title || "";

        if(title){
            return title.replace(/\s*-\s*LinkedIn$/i, "").trim();
        }

        const meta = documentRef.querySelector('meta[property="og:title"]');

        if(meta && meta.content){
            return meta.content.trim();
        }

        return "";

    },

    getLinkedin(url = window.location.href){

        return url || location.href;

    },

    getContext(documentRef = document, url = window.location.href){

        const page = this.getPage(url);

        return {
            page,
            companyName: this.getName(documentRef),
            linkedin: this.getLinkedin(url),
            isCompanyPage: page === "EMPRESA"
        };

    }

};

if(typeof module !== "undefined"){
    module.exports = CompanyDetector;
}