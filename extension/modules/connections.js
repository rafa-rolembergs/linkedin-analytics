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

            const connection = connections[existing];

            connection.status = status;

            connection.updatedAt = now;

            if (
                status === "INVITED" &&
                !connection.invitedAt
            ) {

                connection.invitedAt = now;

            }

            if (
                status === "CONNECTED" &&
                !connection.connectedAt
            ) {

                connection.connectedAt = now;

            }

        } else {

            connections.push({

                id: crypto.randomUUID(),

                personId: person.id || null,

                companyId: person.companyId || null,

                personLinkedin: person.linkedin,

                personName: person.name || "",

                status,

                invitedAt:
                    status === "INVITED"
                        ? now
                        : null,

                connectedAt:
                    status === "CONNECTED"
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

        const connections = await this.getAll();

        const connection = connections.find(

            c => c.personLinkedin === personLinkedin

        );

        if (!connection) {

            return null;

        }

        const now = new Date().toISOString();

        connection.status = status;

        connection.updatedAt = now;

        if (
            status === "INVITED" &&
            !connection.invitedAt
        ) {

            connection.invitedAt = now;

        }

        if (
            status === "CONNECTED" &&
            !connection.connectedAt
        ) {

            connection.connectedAt = now;

        }

        await Storage.save(

            this.STORAGE_KEY,

            connections

        );

        return connection;

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