const PersonDetector = {

    getCurrentPage() {

        const path = window.location.pathname;

        if (path.startsWith("/in/")) {
            return "PROFILE";
        }

        if (path.startsWith("/search/results/people")) {
            return "PEOPLE_SEARCH";
        }

        if (path.startsWith("/mynetwork/")) {
            return "MY_NETWORK";
        }

        if (path.startsWith("/messaging/")) {
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

        const image = document.querySelector(".pv-top-card-profile-picture__image");

        return image?.src || "";

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

            linkedin

        };

    }

};