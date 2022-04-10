"use strict";

class Escala {
	static async mostraMissas() {
        const tipo = 'Missas';
		const data = this.ordena(await Backend.GET_Escala(tipo));

		const result = {
			escala: []
		};
		for (const escala of data) {
			result.escala.push(new Escala(tipo, escala));
		}
        return result;
	}

	static ordena(escala) {
        return escala.sort(function(a, b) {
			if (a.ordem > b.ordem) {
				return 1;
			}
			if (a.ordem < b.ordem) {
				return -1;
			}
			return 0;
        });
	}

	constructor(tipo, obj) {
        this.tipo = tipo;
		this.id = obj.id;
		this.nome = obj.nome;
		this.evento = obj.evento;
		this.ordem = obj.ordem;
		this.escalar = obj.escalar;
		this.escalados = obj.escalados.sort()
	}

    situacao() {
        return this.escalados.length == this.escalar ? 'completa' : this.escalados.length > this.escalar ? 'revezamento' : 'faltando'
    }
}
