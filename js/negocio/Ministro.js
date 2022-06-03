"use strict";

class Ministro {
	static async lista() {
		const data = this.ordenaPorNome(await Backend.GET_Ministro());
		const escala = await Backend.GET_Escala('Missas');

		const result = {
			ministros: [],
			total: 0,
			disponibilidade: {}
		};
		for (const ministro of data) {
			const objMinistro = new Ministro(ministro)
			result.ministros.push(objMinistro);
			result.total++;
			if (ministro.disponibilidade) {
				for (const disponibilidade of ministro.disponibilidade) {
					if (!result.disponibilidade[disponibilidade]) {
						result.disponibilidade[disponibilidade] = 0;
					}
					result.disponibilidade[disponibilidade]++;
				}
			}
			objMinistro.escaladoMissas = 0;
			for (const item of escala) {
				if (item.escalados.includes(ministro.id)) {
					objMinistro.escaladoMissas++;
				}
			}
		}
        return result;
	}

	static ordenaPorNome(ministros) {
		// TODO Está ordenando errado; a Hosana está vindo antes do Hélio.
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

	constructor(obj) {
		this.id = obj.id;
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
}
