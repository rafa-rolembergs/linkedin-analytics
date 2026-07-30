const Messages = {

    STORAGE_KEY: "messages",

    async getAll() {

        return await Storage.get(this.STORAGE_KEY);

    },

    async find(personLinkedin) {

        const messages = await this.getAll();

        return messages.filter(

            message => message.personLinkedin === personLinkedin

        );

    },

    async save(person, script) {

        const messages = await this.getAll();

        const now = new Date().toISOString();

        const existing = messages.find(

            message =>

                message.personLinkedin === person.linkedin &&

                message.script === script

        );

        if (existing) {

            return existing;

        }

        const message = {

            id: crypto.randomUUID(),

            personId: person.id || null,

            companyId: person.companyId || null,

            personLinkedin: person.linkedin,

            personName: person.name,

            script,

            status: "SENT",

            sentAt: now,

            replied: false,

            repliedAt: null,

            createdAt: now,

            updatedAt: now

        };

        messages.push(message);

        await Storage.save(

            this.STORAGE_KEY,

            messages

        );

        return message;

    },

    async registerReply(personLinkedin, script) {

        const messages = await this.getAll();

        const message = messages.find(

            item =>

                item.personLinkedin === personLinkedin &&

                item.script === script

        );

        if (!message) {

            return null;

        }

        message.replied = true;

        message.status = "REPLIED";

        message.repliedAt = new Date().toISOString();

        message.updatedAt = message.repliedAt;

        await Storage.save(

            this.STORAGE_KEY,

            messages

        );

        return message;

    },

    async remove(personLinkedin, script) {

        const messages = await this.getAll();

        const filtered = messages.filter(

            item => !(

                item.personLinkedin === personLinkedin &&

                item.script === script

            )

        );

        await Storage.save(

            this.STORAGE_KEY,

            filtered

        );

    },

    async count(script = null) {

        const messages = await this.getAll();

        if (script === null) {

            return messages.length;

        }

        return messages.filter(

            item => item.script === script

        ).length;

    },

    async getScript(script) {

        const messages = await this.getAll();

        return messages.filter(

            item => item.script === script

        );

    },

    async getReplies(script = null) {

        const messages = await this.getAll();

        return messages.filter(item => {

            if (!item.replied) {

                return false;

            }

            if (script === null) {

                return true;

            }

            return item.script === script;

        });

    }

};