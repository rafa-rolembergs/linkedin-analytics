const PersonDetector = {

    getCurrentPage() {

        const path = window.location.pathname.toLowerCase();

        if (path.startsWith("/in/")) return "PROFILE";
        if (path.startsWith("/search/results/people")) return "PEOPLE_SEARCH";
        if (path.startsWith("/mynetwork")) return "MY_NETWORK";
        if (path.startsWith("/messaging")) return "MESSAGING";

        return "OTHER";

    },

    isProfilePage() {

        return this.getCurrentPage() === "PROFILE";

    },

    getLinkedinUrl() {

        if (!this.isProfilePage()) return null;

        return window.location.origin + window.location.pathname;

    },

    getPersonName() {

        if (!this.isProfilePage()) return null;

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

        if (!this.isProfilePage()) return "";

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

        if (!this.isProfilePage()) return "";

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

// ======================================================
// 1 - PROCURA A EMPRESA NO CABEÇALHO DA EXPERIÊNCIA
// ======================================================

const experienceItems = document.querySelectorAll(
    'a[href*="/company/"]'
);

const processed = new Set();

for (const link of experienceItems) {

    const href = link.href.split("?")[0];

    if (processed.has(href)) continue;

    processed.add(href);

    const text = link.innerText.trim();

    if (!text) continue;

    const parentText =
        link.closest("div")?.innerText?.toLowerCase() || "";

    if (
        !parentText.includes("o momento") &&
        !parentText.includes("present")
    ) {
        continue;
    }

    // Ignora links cujo texto é um cargo
    if (
        text.startsWith("Diretor") ||
        text.startsWith("Director") ||
        text.startsWith("Gerente") ||
        text.startsWith("Manager") ||
        text.startsWith("Coordenador") ||
        text.startsWith("Analista") ||
        text.startsWith("Especialista") ||
        text.startsWith("CEO") ||
        text.startsWith("CTO") ||
        text.startsWith("CFO")
    ) {
        continue;
    }

    return {

        name: text.split("\n")[0].trim(),

        linkedin: href

    };

}

        // ======================================================
        // 2 - FALLBACK PARA EMPRESA DO TOPO
        // ======================================================

        const topCompany = document.querySelector(
            'img[src*="company-logo"]'
        );

        if (topCompany) {

            const card = topCompany.closest("[role='button']");

            if (card) {

                const spans = card.querySelectorAll("span");

                for (const span of spans) {

                    const text = span.innerText?.trim();

                    if (!text) continue;

                    if (
                        text.includes("Universidade") ||
                        text.includes("University") ||
                        text.includes("Faculdade") ||
                        text.includes("School") ||
                        text.includes("College")
                    ) {
                        continue;
                    }

                    return {
                        name: text,
                        linkedin: ""
                    };

                }

            }

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