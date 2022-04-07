"use strict";

class Ministro {
	// TODO fazer não-estático
	static nomeFormatado(ministro) {
		// Nome de guerra está contido no nome. Ex.: <b>José Cláudio</b> Conceição de Aguiar
		const pos = ministro.nome.indexOf(ministro.nomeGuerra);
		if (pos > -1) {
			return $('<span>')
					.append(ministro.nome.substring(0, pos))
					.append($('<b>')
							.append(ministro.nomeGuerra))
					.append(ministro.nome.substring(pos + ministro.nomeGuerra.length));
		}
	
		// Nome de guerra está contido no nome, mas de forma dividido. Ex.: <b>Marta</b> Elvira Pereira de <b>Marsiaj</b>
		const result = $('<span>');
		let nome = ministro.nome;
		const nomesGuerra = ministro.nomeGuerra.split(' ');
		let conseguiu = true;
		for (const ng of nomesGuerra) {
			const pos = nome.indexOf(ng);
			if (pos > -1) {
				result
						.append(nome.substring(0, pos))
						.append($('<b>')
								.append(ng));
				nome = nome.substring(pos + ng.length);
			} else {
				conseguiu = false;
				break;
			}
		}
		if (conseguiu) {
			result.append(nome);
			return result;
		}
	
		// Nome de guerra tem um "título". Ex.: <b>Irmã Ana Lucia</b> Ferreira
		if (nomesGuerra.length > 1) {
			const result = this.nomeFormatado({
				nome: ministro.nome,
				nomeGuerra: ministro.nomeGuerra.substring(nomesGuerra[0].length + 1)
			});
			if (result.text().indexOf('(') == -1) {
				result
						.append(', ')
						.append($('<b>')
								.append(nomesGuerra[0]));
				return result;
			}
		}
	
		// Nome totalmente diferente
		return $('<span>')
				.append(ministro.nome)
				.append(" (")
				.append($('<b>')
						.append(ministro.nomeGuerra))
				.append(")");
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

	static stats(ministros) {
		const result = {
			total: 0,
			disponiveis: {}
		}

		for (const ministro of ministros) {
			result.total++;
			for (const disponibilidade of ministro.disponibilidade) {
				if (!result.disponiveis[disponibilidade]) {
					result.disponiveis[disponibilidade] = 0;
				}
				result.disponiveis[disponibilidade]++;
			}
		}

		return result;
	}

/*
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
*/
}
