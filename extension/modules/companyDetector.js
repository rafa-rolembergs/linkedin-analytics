const CompanyDetector={

    getPage(){

        return window.location.href.includes("/company/");

    },

    getName(){

        const h1=document.querySelector("h1");

        if(!h1) return "";

        return h1.innerText.trim();

    },

    getLinkedin(){

        return location.href;

    }

}