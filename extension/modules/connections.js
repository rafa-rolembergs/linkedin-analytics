const Connections = {

    STORAGE_KEY: "connections",

    async getAll() {

        return await Storage.get(this.STORAGE_KEY);

    },

    async find(personLinkedin) {

        const connections = await this.getAll();

        return connections.find(

            connection => connection.personLinkedin === personLinkedin

        ) || null;

    },

    async save(person, status = "INVITED") {

        const connections = await this.getAll();

        const existing = connections.findIndex(

            connection => connection.personLinkedin === person.linkedin

        );

        const now = new Date().toISOString();

        if (existing >= 0) {

            connections[existing] = {

                ...connections[existing],

                status,

                updatedAt: now,

                acceptedAt: status === "CONNECTED"
                    ? (connections[existing].acceptedAt || now)
                    : connections[existing].acceptedAt

            };

        } else {

            connections.push({

                id: crypto.randomUUID(),

                personId: person.id || null,

                companyId: person.companyId || null,

                personLinkedin: person.linkedin,

                personName: person.name,

                status,

                invitedAt: now,

                acceptedAt: status === "CONNECTED"
                    ? now
                    : null,

                createdAt: now,

                updatedAt: now

            });

        }

        await Storage.save(

            this.STORAGE_KEY,

            connections

        );

    },

    async updateStatus(personLinkedin, status) {

        const connection = await this.find(personLinkedin);

        if (!connection) {

            return null;

        }

        return await this.save({

            id: connection.personId,

            companyId: connection.companyId,

            linkedin: connection.personLinkedin,

            name: connection.personName

        }, status);

    },

    async remove(personLinkedin) {

        const connections = await this.getAll();

        const filtered = connections.filter(

            connection => connection.personLinkedin !== personLinkedin

        );

        await Storage.save(

            this.STORAGE_KEY,

            filtered

        );

    },

    async count() {

        const connections = await this.getAll();

        return connections.length;

    },

    async getInvited() {

        const connections = await this.getAll();

        return connections.filter(

            connection => connection.status === "INVITED"

        );

    },

    async getConnected() {

        const connections = await this.getAll();

        return connections.filter(

            connection => connection.status === "CONNECTED"

        );

    }

};