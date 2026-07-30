const Companies = {

    STORAGE_KEY: "companies",

    async getAll() {

        const companies = await Storage.get(this.STORAGE_KEY);

        return companies || [];

    },

    async find(linkedin) {

        const companies = await this.getAll();

        return companies.find(company => company.linkedin === linkedin) || null;

    },

    async save(company, status) {

        const companies = await this.getAll();

        const now = new Date().toISOString();

        const index = companies.findIndex(c => c.linkedin === company.linkedin);

        if (index >= 0) {

            companies[index] = {

                ...companies[index],
                ...company,
                status,
                updatedAt: now

            };

        } else {

            companies.push({

                id: crypto.randomUUID(),

                name: company.name,

                linkedin: company.linkedin,

                status,

                createdAt: now,

                updatedAt: now

            });

        }

        await Storage.save(this.STORAGE_KEY, companies);

    },

    async updateStatus(linkedin, status) {

        const company = await this.find(linkedin);

        if (!company) return;

        await this.save(company, status);

    },

    async getICP() {

        const companies = await this.getAll();

        return companies.filter(company => company.status === "ICP");

    },

    async getNotICP() {

        const companies = await this.getAll();

        return companies.filter(company => company.status === "NOT_ICP");

    },

    async remove(linkedin) {

        const companies = await this.getAll();

        const filtered = companies.filter(

            company => company.linkedin !== linkedin

        );

        await Storage.save(this.STORAGE_KEY, filtered);

    },

    async count() {

        const companies = await this.getAll();

        return companies.length;

    }

};