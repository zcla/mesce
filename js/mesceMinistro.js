"use strict";

class Ministro {
	static async getData() {
		return await (await fetch('/api/v1/oldMinistros')).json();
	}

	static async buscaPorId(id) {
		const data = await Ministro.getData();

		return new Ministro(id, data[id]);
	}

	static async listaOsComMandato() {
		const data = await Ministro.getData();

		const result = [];
		const ids = Object.keys(data);
		for (const id of ids) {
			const ministro = new Ministro(id, data[id]);
			if (ministro.comMandato) {
				result.push(ministro);
			}
		}
		return result;
	}

	static async listaTodos() {
		const data = await Ministro.getData();

		const result = [];
		const ids = Object.keys(data);
		for (const id of ids) {
			result.push(new Ministro(id, data[id]));
		}
		return result;
	}

	static ordenaPorNome(ministros) {
		return ministros.sort(function (a, b) {
			if (a.nome > b.nome) {
				return 1;
			}
			if (a.nome < b.nome) {
				return -1;
			}
			return 0;
		});
	}

	constructor(id, obj) {
		this.id = id;
		this.nome = obj.nome;
		this.nomeGuerra = obj.nomeGuerra;
		this.aniversario = obj.aniversario;
		this.email = obj.email;
		this.telefones = obj.telefones.slice();
		this.funcao = obj.funcao;
		this.comMandato = obj.comMandato;
		this.disponibilidade = obj.disponibilidade;
		if (obj.afastamentos) {
			this.afastamentos = obj.afastamentos.slice();
		}
	}
}
