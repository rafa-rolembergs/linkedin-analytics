const MessageDetector = {

    getCurrentPage() {

        const path = window.location.pathname;

        if (path.startsWith("/messaging/")) {

            return "MESSAGING";

        }

        return "OTHER";

    },

    isMessagingPage() {

        return this.getCurrentPage() === "MESSAGING";

    },

    getConversationName() {

        if (!this.isMessagingPage()) {

            return null;

        }

        const selectors = [

            ".msg-thread__link-to-profile",

            ".msg-entity-lockup__entity-title",

            ".artdeco-entity-lockup__title"

        ];

        for (const selector of selectors) {

            const element = document.querySelector(selector);

            if (element?.innerText?.trim()) {

                return element.innerText.trim();

            }

        }

        return null;

    },

    getConversationLinkedin() {

        if (!this.isMessagingPage()) {

            return null;

        }

        const link = document.querySelector(

            ".msg-thread__link-to-profile"

        );

        if (!link) {

            return null;

        }

        return link.href;

    },

    hasReply() {

        if (!this.isMessagingPage()) {

            return false;

        }

        const messages = document.querySelectorAll(

            ".msg-s-message-list__event"

        );

        if (messages.length === 0) {

            return false;

        }

        /*
            Implementação inicial.

            Nesta primeira versão basta informar
            que existe histórico na conversa.

            Em versões futuras será possível
            identificar automaticamente se a
            última mensagem pertence ao prospect
            ou ao usuário.
        */

        return true;

    },

    getConversation() {

        if (!this.isMessagingPage()) {

            return null;

        }

        const linkedin = this.getConversationLinkedin();

        if (!linkedin) {

            return null;

        }

        return {

            name: this.getConversationName(),

            linkedin,

            replied: this.hasReply()

        };

    }

};