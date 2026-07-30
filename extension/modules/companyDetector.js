const CompanyDetector = {

    getCurrentPage() {

        const path = window.location.pathname.toLowerCase();

        if (path.startsWith("/company/")) {
            return "COMPANY";
        }

        if (path.startsWith("/search/results/companies")) {
            return "COMPANY_SEARCH";
        }

        if (path.startsWith("/search/results/people")) {
            return "PEOPLE_SEARCH";
        }

        if (path.startsWith("/in/")) {
            return "PERSON";
        }

        if (path.startsWith("/mynetwork")) {
            return "MY_NETWORK";
        }

        if (path.startsWith("/messaging")) {
            return "MESSAGING";
        }

        if (path === "/" || path === "/feed/") {
            return "HOME";
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

        // ===== Layout antigo =====

        const oldSelectors = [

            "h1",
            ".org-top-card-summary__title",
            ".org-top-card h1",
            ".top-card-layout__title",
            ".top-card h1"

        ];

        for (const selector of oldSelectors) {

            const element = document.querySelector(selector);

            if (element?.textContent.trim()) {

                return element.textContent.trim();

            }

        }

        // ===== Novo layout do LinkedIn =====

        const companyLink = document.querySelector('a[href*="/company/"]');

        if (companyLink) {

            const parent = companyLink.parentElement;

            if (parent) {

                const title = parent.querySelector("p");

                if (title?.textContent.trim()) {

                    return title.textContent.trim();

                }

            }

        }

        // ===== Fallback pelo aria-label =====

        const ariaElement = document.querySelector('[aria-label*="empresa"]');

        if (ariaElement) {

            const label = ariaElement.getAttribute("aria-label");

            if (label) {

                const match = label.match(/empresa\s+(.+)$/i);

                if (match) {

                    return match[1].trim();

                }

            }

        }

        // ===== Último fallback =====

        const title = document.title
            .replace(/\s*\|\s*LinkedIn.*$/i, "")
            .trim();

        if (title.length > 0) {

            return title;

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