const Companies = {

    async allICP(){

        return await Storage.get("icp");

    },

    async allNotICP(){

        return await Storage.get("not_icp");

    },

    async saveICP(company){

        let list = await this.allICP();

        const exists = list.find(c=>c.linkedin===company.linkedin);

        if(exists) return;

        list.push(company);

        await Storage.save("icp",list);

    },

    async saveNotICP(company){

        let list = await this.allNotICP();

        const exists = list.find(c=>c.linkedin===company.linkedin);

        if(exists) return;

        list.push(company);

        await Storage.save("not_icp",list);

    }

}