"use strict";

class BackendUtils {
	static async readData() {
		return await (await fetch('data/data.json')).json();
	}

	static getMinistros() { // TODO renomear para getMinistrosComMandato()
		const result = {
			ministros: [],
			total: 0
		}

        for (const idMinistro of Object.keys(data.ministros)) {
            const ministro = data.ministros[idMinistro];
            if (ministro.comMandato) {
                result.ministros.push({
                    nome: ministro.nome,
                    nomeGuerra: ministro.nomeGuerra,
                    funcao: ministro.funcao,
                    aniversario: ministro.aniversario,
                    disponibilidade: ministro.disponibilidade
                    // TODO faltam afastamentos
                });
                result.total++;
            }
        }
        return Ministro.ordenaPorNome(result);
	}
}
