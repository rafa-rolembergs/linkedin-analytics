(() => {
  console.log("==================================");
  console.log("NoTopo Prospect Intelligence");
  console.log("==================================");

  const url = window.location.href;

  let page = "OUTRA";

  if (url.includes("/search/results/companies")) {
    page = "EMPRESAS";
  } else if (url.includes("/search/results/people")) {
    page = "PESSOAS";
  } else if (url.includes("/mynetwork/invite-connect/connections")) {
    page = "CONEXÕES";
  } else if (url.includes("/messaging")) {
    page = "INBOX";
  }

  console.log("Página:", page);

  if (document.getElementById("notopo-panel")) return;

  const panel = document.createElement("div");

  panel.id = "notopo-panel";

  panel.innerHTML = `
      <h2>NoTopo</h2>

      <hr>

      <b>Página</b>

      <br>

      ${page}

      <br><br>

      <b>Status</b>

      <br>

      Online

      <br><br>

      <small>Versão 0.1</small>
  `;

  panel.style.position = "fixed";
  panel.style.right = "20px";
  panel.style.top = "120px";
  panel.style.width = "220px";
  panel.style.background = "#ffffff";
  panel.style.border = "1px solid #ddd";
  panel.style.borderRadius = "10px";
  panel.style.padding = "15px";
  panel.style.boxShadow = "0 4px 15px rgba(0,0,0,.2)";
  panel.style.zIndex = "999999";
  panel.style.fontFamily = "Arial";

  document.body.appendChild(panel);

})();