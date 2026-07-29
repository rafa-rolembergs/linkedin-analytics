const Companies = {

    async getICP(){

        return new Promise(resolve=>{

            chrome.storage.local.get(["icp"],result=>{

                resolve(result.icp || []);

            });

        });

    },

    async getNotICP(){

        return new Promise(resolve=>{

            chrome.storage.local.get(["not_icp"],result=>{

                resolve(result.not_icp || []);

            });

        });

    },

    async save(company,status){

        const key = status === "ICP" ? "icp" : "not_icp";

        return new Promise(resolve=>{

            chrome.storage.local.get([key],result=>{

                let list = result[key] || [];

                const exists = list.find(x=>x.linkedin===company.linkedin);

                if(!exists){

                    list.push(company);

                }

                chrome.storage.local.set({

                    [key]:list

                },()=>resolve());

            });

        });

    }

}