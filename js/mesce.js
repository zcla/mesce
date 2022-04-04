"use strict";

let data = null;

class BackendUtils {
	static async getData() {
		return await (await fetch('data/data.json')).json();
	}
}

class DominioUtils {
	static ministro_nomeFormatado(ministro) {
		// Nome de guerra está contido no nome. Ex.: <b>José Cláudio</b> Conceição de Aguiar
		const pos = ministro.nome.indexOf(ministro.nomeGuerra);
		if (pos > -1) {
			return $('<div>')
					.append(ministro.nome.substring(0, pos))
					.append($('<b>')
							.append(ministro.nomeGuerra))
					.append(ministro.nome.substring(pos + ministro.nomeGuerra.length));
		}
	
		// Nome de guerra está contido no nome, mas de forma dividido. Ex.: <b>Marta</b> Elvira Pereira de <b>Marsiaj</b>
		const result = $('<div>');
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
			const result = this.ministro_nomeFormatado({
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
		return $('<div>')
				.append(ministro.nome)
				.append(" (")
				.append($('<b>')
						.append(ministro.nomeGuerra))
				.append(")");
	}
}

class GuiUtils {
	static conteudoAdiciona(elemento) {
		return $('#mesce').append(elemento);
	}

	static conteudoLimpa() {
		$('#mesce').empty();
	}

	static mensagensLimpa() {
		$('#mensagens').empty();
	}

	static simboloCondicao(condicao) {
		if (condicao) {
			return $('<span class="condicaoTrue">').append('&check;');
		} else {
			return $('<span class="condicaoFalse">').append('&cross;');
		}
	}
}

class Menu {
	static ministros() {
		GuiUtils.mensagensLimpa();
		GuiUtils.conteudoLimpa();

		const table = $('<table class="table table-sm table-bordered table-striped table-hover ministros">');
		GuiUtils.conteudoAdiciona(table);

		const stats = {
			total: 0,
			disponiveis: {}
		}
		for (const idMinistro of Object.keys(data.ministros)) {
			const ministro = data.ministros[idMinistro];
			stats.total++;
			for (const disponibilidade of ministro.disponibilidade) {
				if (!stats.disponiveis[disponibilidade]) {
					stats.disponiveis[disponibilidade] = 0;
				}
				stats.disponiveis[disponibilidade]++;
			}
		}

		const thead = $('<thead>');
		thead
				.append($('<tr>')
						.append($('<th rowspan="2">').append('Nome (' + stats.total + ')'))
						.append($('<th rowspan="2">').append('Aniversário'))
						.append($('<th colspan="2">').append('Disponibilidade')))
				.append($('<tr>')
						.append($('<th>').append('Enfermos (' + stats.disponiveis.enfermos + ')'))
						.append($('<th>').append('Missas (' + stats.disponiveis.missas + ')')));
		table.append(thead);

		const tbody = $('<tbody>');

		for (const idMinistro of Object.keys(data.ministros)) {
			const ministro = data.ministros[idMinistro];
			let nomeFormatado = DominioUtils.ministro_nomeFormatado(ministro);
			const nome = $('<div>');
			if (ministro.funcao) {
				nome.append($('<span class="badge float-end funcao">')
						.append(ministro.funcao));
			}
			nome.append(nomeFormatado);

			tbody
					.append($('<tr>')
							.append($('<td class="nome">')
									.append(nome))
							.append($('<td class="aniversario">')
									.append(ministro.aniversario))
							.append($('<td class="disponibilidade_enfermos">')
									.append(GuiUtils.simboloCondicao(ministro.disponibilidade.includes('enfermos'))))
							.append($('<td class="disponibilidade_missas">')
									.append(GuiUtils.simboloCondicao(ministro.disponibilidade.includes('missas')))));
		}

		table.append(tbody);
	}
}

$(document).ready(async function() {
	data = await BackendUtils.getData();
	Menu.ministros();
});
