console.log("NoTopo Prospect Intelligence");

let page="OUTRA";

const url=location.href;

if(url.includes("/search/results/companies")){

    page="EMPRESAS";

}

else if(url.includes("/search/results/people")){

    page="PESSOAS";

}

else if(url.includes("/messaging")){

    page="INBOX";

}

else if(url.includes("/company/")){

    page="EMPRESA";

}

Panel.create(page);

if(CompanyDetector.getPage()){

    console.log("Empresa:");

    console.log(CompanyDetector.getName());

}