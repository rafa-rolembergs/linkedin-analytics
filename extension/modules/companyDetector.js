const CompanyDetector = {

    getCurrentPage() {

        const url = window.location.pathname.toLowerCase();

        if (url.startsWith("/company/")) {
            return "COMPANY";
        }

        if (url.startsWith("/search/results/companies")) {
            return "COMPANY_SEARCH";
        }

        if (url.startsWith("/search/results/people")) {
            return "PEOPLE_SEARCH";
        }

        if (url.startsWith("/mynetwork")) {
            return "MY_NETWORK";
        }

        if (url.startsWith("/messaging")) {
            return "MESSAGING";
        }

        return "OTHER";

    },

    isCompanyPage() {

        return this.getCurrentPage() === "COMPANY";

    },

    getLinkedinUrl() {

        return window.location.href.split("?")[0];

    },

    getCompanyName() {

        const selectors = [

            "h1",
            ".org-top-card-summary__title",
            ".org-top-card h1",
            ".top-card-layout__title",
            ".top-card h1"

        ];

        for (const selector of selectors) {

            const element = document.querySelector(selector);

            if (element && element.textContent.trim()) {

                return element.textContent.trim();

            }

        }

        return null;

    },

    getCompany() {

        if (!this.isCompanyPage()) {

            return null;

        }

        const name = this.getCompanyName();

        if (!name) {

            return null;

        }

        return {

            name,
            linkedin: this.getLinkedinUrl()

        };

    }

};