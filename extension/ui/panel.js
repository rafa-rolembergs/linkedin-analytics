const Panel={

    create(page){

        if(document.getElementById("notopo-panel")) return;

        const panel=document.createElement("div");

        panel.id="notopo-panel";

        panel.innerHTML=`

        <h2>NoTopo</h2>

        <hr>

        <b>Página</b><br>

        ${page}

        <br><br>

        <div id="company-area"></div>

        `;

        panel.style.position="fixed";
        panel.style.right="20px";
        panel.style.top="120px";
        panel.style.width="250px";
        panel.style.background="#fff";
        panel.style.borderRadius="10px";
        panel.style.padding="15px";
        panel.style.boxShadow="0 5px 20px rgba(0,0,0,.2)";
        panel.style.zIndex="999999";

        document.body.appendChild(panel);

    }

}