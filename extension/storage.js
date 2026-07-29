const Storage = {

    async get(key){

        return new Promise(resolve=>{

            chrome.storage.local.get([key],result=>{

                resolve(result[key] || []);

            });

        });

    },

    async save(key,data){

        return new Promise(resolve=>{

            chrome.storage.local.set({

                [key]:data

            },()=>resolve());

        });

    }

}