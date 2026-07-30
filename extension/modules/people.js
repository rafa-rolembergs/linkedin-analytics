const People = {

    STORAGE_KEY: "people",

    async getAll() {

        return await Storage.get(this.STORAGE_KEY);

    },

    async find(linkedin) {

        const people = await this.getAll();

        return people.find(person => person.linkedin === linkedin) || null;

    },

    async save(data) {

        const people = await this.getAll();

        const existing = people.findIndex(

            person => person.linkedin === data.linkedin

        );

        const now = new Date().toISOString();

        if (existing >= 0) {

            people[existing] = {

                ...people[existing],

                ...data,

                updatedAt: now

            };

        } else {

            people.push({

                id: crypto.randomUUID(),

                companyId: data.companyId || null,

                companyName: data.companyName || "",

                name: data.name || "",

                jobTitle: data.jobTitle || "",

                linkedin: data.linkedin,

                photo: data.photo || "",

                connectionStatus: data.connectionStatus || "NOT_SENT",

                invitationSentAt: data.invitationSentAt || null,

                connectionAcceptedAt: data.connectionAcceptedAt || null,

                createdAt: now,

                updatedAt: now

            });

        }

        await Storage.save(

            this.STORAGE_KEY,

            people

        );

    },

    async updateConnectionStatus(linkedin, status) {

        const people = await this.getAll();

        const person = people.find(

            p => p.linkedin === linkedin

        );

        if (!person) {

            return null;

        }

        person.connectionStatus = status;

        person.updatedAt = new Date().toISOString();

        if (status === "INVITED") {

            person.invitationSentAt = person.invitationSentAt || new Date().toISOString();

        }

        if (status === "CONNECTED") {

            person.connectionAcceptedAt = new Date().toISOString();

        }

        await Storage.save(

            this.STORAGE_KEY,

            people

        );

        return person;

    },

    async remove(linkedin) {

        const people = await this.getAll();

        const filtered = people.filter(

            person => person.linkedin !== linkedin

        );

        await Storage.save(

            this.STORAGE_KEY,

            filtered

        );

    },

    async count() {

        const people = await this.getAll();

        return people.length;

    },

    async getInvited() {

        const people = await this.getAll();

        return people.filter(

            person => person.connectionStatus === "INVITED"

        );

    },

    async getConnected() {

        const people = await this.getAll();

        return people.filter(

            person => person.connectionStatus === "CONNECTED"

        );

    }

};