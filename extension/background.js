/*
==========================================================
NoTopo Prospect Intelligence
Background Service Worker
==========================================================

Responsabilidades:

- Inicializar a extensão
- Garantir a criação das estruturas do Storage
- Executar tarefas globais no futuro
- Não manipular o LinkedIn
- Não acessar o DOM
==========================================================
*/

chrome.runtime.onInstalled.addListener(async () => {

    console.log("NoTopo Prospect Intelligence iniciado.");

    const structures = {

        companies: [],
        people: [],
        connections: [],
        messages: []

    };

    chrome.storage.local.get(

        Object.keys(structures),

        result => {

            const data = {};

            for (const key in structures) {

                if (!Array.isArray(result[key])) {

                    data[key] = structures[key];

                }

            }

            if (Object.keys(data).length > 0) {

                chrome.storage.local.set(data);

            }

        }

    );

});

chrome.runtime.onStartup.addListener(() => {

    console.log("NoTopo Prospect Intelligence carregado.");

});