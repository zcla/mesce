"use strict";

class Backend {
    static _data = null;

	static async init() {
        this._data = await (await fetch('data/data.json')).json();
	}

    static getEventos() {
        return this._data.eventos;
    }

    static getEscala() {
		const result = [];

        for (const idEscala of Object.keys(this._data.escala)) {
            const escala = this._data.escala[idEscala];
            const escalados = [];
            for (const escalado of escala.escalados) {
                const ministro = this._data.ministros[escalado];
                escalados.push(ministro.nomeGuerra);
            }
            escalados.sort();
            result.push({
                ordem: escala.ordem,
                nome: escala.nome,
                escalar: escala.escalar,
                escalados: escalados,
                situacao: escalados.length == escala.escalar ? 'completa' : escalados.length > escala.escalar ? 'revezamento' : 'faltando'
            });
        }

        return result.sort(function(a, b) {
			if (a.ordem > b.ordem) {
				return 1;
			}
			if (a.ordem < b.ordem) {
				return -1;
			}
			return 0;
        });
    }

	static GET_Ministro() {
		const result = [];

        for (const idMinistro of Object.keys(this._data.ministros)) {
            const ministro = this._data.ministros[idMinistro];
            result.push({
                nome: ministro.nome,
                nomeGuerra: ministro.nomeGuerra,
                funcao: ministro.funcao,
                aniversario: ministro.aniversario,
                disponibilidade: ministro.disponibilidade
                // TODO faltam afastamentos
            });
        }
        return Ministro.ordenaPorNome(result);
	}
}
