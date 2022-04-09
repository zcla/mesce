"use strict";

class Ministro {
	static async lista() {
		const data = this.ordenaPorNome(await Backend.GET_Ministro());

		const result = {
			ministros: [],
			total: 0,
			disponibilidade: {}
		};
		const ids = Object.keys(data);
		for (const id of ids) {
			const ministro = new Ministro(id, data[id]);
			result.ministros.push(ministro);
			result.total++;
			for (const disponibilidade of ministro.disponibilidade) {
				if (!result.disponibilidade[disponibilidade]) {
					result.disponibilidade[disponibilidade] = 0;
				}
				result.disponibilidade[disponibilidade]++;
			}
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
		this.funcao = obj.funcao;
		this.comMandato = obj.comMandato;
		this.disponibilidade = obj.disponibilidade;
		// TODO faltam afastamentos
		/*
		if (obj.afastamentos) {
			this.afastamentos = obj.afastamentos.slice();
		}
		*/
	}

	nomeFormatado() {
		function formataNome(nome, nomeGuerra) {
			// Nome de guerra está contido no nome. Ex.: <b>José Cláudio</b> Conceição de Aguiar
			const pos = nome.indexOf(nomeGuerra);
			if (pos > -1) {
				return $('<span>')
						.append(nome.substring(0, pos))
						.append($('<b>')
								.append(nomeGuerra))
						.append(nome.substring(pos + nomeGuerra.length));
			}
		
			// Nome de guerra está contido no nome, mas de forma dividida. Ex.: <b>Marta</b> Elvira Pereira de <b>Marsiaj</b>
			const result = $('<span>');
			const nomesGuerra = nomeGuerra.split(' ');
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
				const result = formataNome(nome, nomeGuerra.substring(nomesGuerra[0].length + 1));
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
					.append(nome)
					.append(" (")
					.append($('<b>')
							.append(nomeGuerra))
					.append(")");
		}
		return formataNome(this.nome, this.nomeGuerra)
	}

/*
	static listaTodos() {
		const data = Backend.GET_Ministro();

		const result = [];
		const ids = Object.keys(data);
		for (const id of ids) {
			result.push(new Ministro(id, data[id]));
		}
		return result;
	}

	static listaComMandato() {
		const data = Backend.GET_Ministro();

		const result = [];
		const ids = Object.keys(data);
		for (const id of ids) {
			result.push(new Ministro(id, data[id]));
		}
        return result;
	}
*/
}
