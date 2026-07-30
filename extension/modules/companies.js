console.log("PASSO 1 - companies.js carregou");
const Companies = {

    STORAGE_KEY: "companies",

    async getAll() {

        return new Promise(resolve => {

            chrome.storage.local.get([this.STORAGE_KEY], result => {

                resolve(result[this.STORAGE_KEY] || []);

            });

        });

    },

    async find(linkedin) {

        const companies = await this.getAll();

        return companies.find(company => company.linkedin === linkedin) || null;

    },

    async save(company, status) {

        return new Promise(resolve => {

            chrome.storage.local.get([this.STORAGE_KEY], result => {

                const companies = result[this.STORAGE_KEY] || [];

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

                chrome.storage.local.set({

                    [this.STORAGE_KEY]: companies

                }, () => resolve());

            });

        });

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

        return new Promise(resolve => {

            chrome.storage.local.get([this.STORAGE_KEY], result => {

                const companies = (result[this.STORAGE_KEY] || []).filter(

                    company => company.linkedin !== linkedin

                );

                chrome.storage.local.set({

                    [this.STORAGE_KEY]: companies

                }, () => resolve());

            });

        });

    },

    async count() {

        const companies = await this.getAll();

        return companies.length;

    }

};
console.log("PASSO 2 - Companies criado:", Companies);