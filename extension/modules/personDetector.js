const PersonDetector = {

    getCurrentPage() {

        const path = window.location.pathname.toLowerCase();

        if (path.startsWith("/in/")) {
            return "PROFILE";
        }

        if (path.startsWith("/search/results/people")) {
            return "PEOPLE_SEARCH";
        }

        if (path.startsWith("/mynetwork")) {
            return "MY_NETWORK";
        }

        if (path.startsWith("/messaging")) {
            return "MESSAGING";
        }

        return "OTHER";

    },

    isProfilePage() {

        return this.getCurrentPage() === "PROFILE";

    },

    getLinkedinUrl() {

        if (!this.isProfilePage()) {
            return null;
        }

        return window.location.origin + window.location.pathname;

    },

    getPersonName() {

        if (!this.isProfilePage()) {
            return null;
        }

        const selectors = [

            "h1",

            ".text-heading-xlarge",

            ".pv-text-details__left-panel h1"

        ];

        for (const selector of selectors) {

            const element = document.querySelector(selector);

            if (element?.innerText?.trim()) {

                return element.innerText.trim();

            }

        }

        return null;

    },

    getJobTitle() {

        if (!this.isProfilePage()) {
            return "";
        }

        const selectors = [

            ".text-body-medium",

            ".pv-text-details__left-panel .text-body-medium"

        ];

        for (const selector of selectors) {

            const element = document.querySelector(selector);

            if (element?.innerText?.trim()) {

                return element.innerText.trim();

            }

        }

        return "";

    },

    getPhoto() {

        if (!this.isProfilePage()) {
            return "";
        }

        const selectors = [

            ".pv-top-card-profile-picture__image",

            'img[alt*="foto"]',

            'img[alt*="Photo"]'

        ];

        for (const selector of selectors) {

            const image = document.querySelector(selector);

            if (image?.src) {

                return image.src;

            }

        }

        return "";

    },

    getCurrentCompany() {

        if (!this.isProfilePage()) {
            return null;
        }

        // ==================================================
        // NOVO LAYOUT DO LINKEDIN
        // Empresa exibida no topo do perfil
        // ==================================================

        const logo = document.querySelector('img[src*="company-logo"]');

        if (logo) {

            const card = logo.closest('div[role="button"]');

            if (card) {

                const name = card.querySelector("span")?.innerText?.trim();

                if (name) {

                    return {

                        name,
                        linkedin: ""

                    };

                }

            }

        }

        // ==================================================
        // LAYOUT ANTIGO
        // Empresa na seção Experiência
        // ==================================================

        const links = document.querySelectorAll(
            'a[href*="/company/"]'
        );

        for (const link of links) {

            const paragraphs = link.querySelectorAll("p");

            if (!paragraphs.length) {
                continue;
            }

            const name = paragraphs[0].innerText.trim();

            if (!name) {
                continue;
            }

            return {

                name,
                linkedin: link.href.split("?")[0]

            };

        }

        return null;

    },

    getPerson() {

        if (!this.isProfilePage()) {

            return null;

        }

        const linkedin = this.getLinkedinUrl();

        if (!linkedin) {

            return null;

        }

        return {

            name: this.getPersonName(),

            jobTitle: this.getJobTitle(),

            photo: this.getPhoto(),

            linkedin,

            company: this.getCurrentCompany()

        };

    }

};