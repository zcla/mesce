"use strict";

// Tenta resolver o problema do cache dos json => https://webplatform.github.io/docs/apis/appcache/ApplicationCache/swapCache/
window.applicationCache.swapCache();

let data = null;

// TODO https://www.jsviews.com/

class Menu {
	static async escala() {
		GuiUtils.mensagensLimpa();
		GuiUtils.conteudoLimpa();
		
		const table = $('<table class="table table-sm table-bordered table-striped escala">');
		GuiUtils.conteudoAdiciona(table);
		
		const escala = await Escala.mostraMissas();

		const thead = $('<thead>');
		thead.append(
				$('<tr>')
						.append($('<th>').append('Missa (' + escala.escala.length + ')'))
						.append($('<th>').append('Escalar (' + escala.escalar + ')'))
						.append($('<th>').append('Ministros escalados (' + escala.escalados + ')'))
		);
		table.append(thead);

		const tbody = $('<tbody>');
		
		for (const item of escala.escala) {
			let escalados = "";
			for (const ministro of item.escalados) {
				escalados += ministro + ", ";
			}
			escalados = escalados.substring(0, escalados.length - 2);
			
			tbody
					.append($('<tr>')
							.append($('<td class="missa">')
									.append(item.nome))
							.append($('<td class="escalar">')
									.append(item.escalar))
							.append($('<td class="escalados">')
									.append(escalados)
									.append($('<span class="badge float-end ' + item.situacao() + '">')
											.append(item.situacao()))));
		}

		table.append(tbody);
	}

	static async ministrosLista() {
		GuiUtils.mensagensLimpa();
		GuiUtils.conteudoLimpa();

		const table = $('<table class="table table-sm table-bordered table-striped table-hover ministros">');
		GuiUtils.conteudoAdiciona(table);

		const lista = await Ministro.lista();
		
		const thead = $('<thead>');
		thead
				.append($('<tr>')
						.append($('<th rowspan="2">').append('Nome (' + lista.total + ')'))
						.append($('<th rowspan="2">').append('Aniversário'))
						.append($('<th colspan="2">').append('Disponibilidade')))
				.append($('<tr>')
						.append($('<th>').append('Enfermos (' + lista.disponibilidade.enfermos + ')'))
						.append($('<th>').append('Missas (' + lista.disponibilidade.missas + ')')));
		table.append(thead);

		const tbody = $('<tbody>');

		for (const ministro of lista.ministros) {
			let nomeFormatado = ministro.nomeFormatado();
			const nome = $('<span>').append(nomeFormatado);
			if (ministro.funcao) {
				nome.append($('<span class="badge float-end funcao">')
						.append(ministro.funcao));
			}
			const disponibilidadeMissas = $('<span>').append(GuiUtils.simboloCondicao(ministro.disponibilidade.includes('missas')));
			if (ministro.escaladoMissas) {
				disponibilidadeMissas.append(' (' + ministro.escaladoMissas + ')')
			}

			tbody
					.append($('<tr>')
							.append($('<td class="nome">')
									.append(nome))
							.append($('<td class="aniversario">')
									.append(ministro.aniversario))
							.append($('<td class="disponibilidade_enfermos">')
									.append(GuiUtils.simboloCondicao(ministro.disponibilidade.includes('enfermos'))))
							.append($('<td class="disponibilidade_missas">')
									.append(disponibilidadeMissas)));
		}

		table.append(tbody);
	}
	
	static async agenda(data)	{
		if (GuiUtils.isMobile()) {
			await Menu.agendaDia(data);
		} else {
			await Menu.agendaMes(data);
		}
	}

	// TODO otimizar o código
	// TODO reaproveitar partes repetidas
	static async agendaDia(data) {
		GuiUtils.mensagensLimpa();
		GuiUtils.conteudoLimpa();
		
		const hoje = new Date((new Date()).toDateString());
		let dataAgenda = new Date();
		if (data) {
			dataAgenda.setTime(parseInt(data));
		}
		dataAgenda = new Date(dataAgenda);

		const eventos = await Evento.agendaMes(dataAgenda);
		
		const table = $('<table class="table table-sm table-bordered agenda">');
		GuiUtils.conteudoAdiciona(table);
		
		table.append($('<caption>')
				.append($('<button type="button" class="btn btn-dark float-start" onclick="javascript:Menu.agenda(\'' + DateUtils.adicionaDias(dataAgenda, -1).getTime() + '\');">')
						.append("&#8592;"))
				.append("&nbsp;")
				.append(dataAgenda.getDate() + '/' + (dataAgenda.getMonth() + 1).toString().padStart(2, "0") + '/' + dataAgenda.getFullYear())
				.append("&nbsp;")
				.append($('<button type="button" class="btn btn-dark float-end" onclick="javascript:Menu.agenda(\'' + DateUtils.adicionaDias(dataAgenda, 1).getTime() + '\');">')
						.append("&#8594;")));
		
		const tbody = $('<tbody>');
		
		let tr = $('<tr>');
		tbody.append(tr);
		
		let antesDepois = 'hoje';
		if (dataAgenda.toISOString() < hoje.toISOString()) {
			antesDepois = 'antes';
		}
		if (dataAgenda.toISOString() > hoje.toISOString()) {
			antesDepois = 'depois';
		}
		
		const td = $('<td class="' + antesDepois + '">');
		tr.append(td);
		
		td.append($('<div class="agendaConteudo">'));

		for (const evento of eventos.eventos) {
			if (evento.data.toDateString() == dataAgenda.toDateString()) {
				const div = $('<div class="evento">');
				if (evento.tipo) {
					div.addClass(evento.tipo);
				}
				if (evento.icone) {
					div.append(evento.icone).append(' ');
				}
				if (evento.hora) {
					div.append($('<b>').append(evento.hora)).append(' ');
				}
				div.append(evento.nome);
				$(tr.find(".agendaConteudo").slice(-1)[0]).append(div);
			}
		}

		table.append(tbody);
	}

	static async agendaMes(data) {
		GuiUtils.mensagensLimpa();
		GuiUtils.conteudoLimpa();
		
		const hoje = new Date((new Date()).toDateString());
		let dataAgenda = new Date();
		if (data) {
			dataAgenda.setTime(parseInt(data));
		}
		dataAgenda = new Date(dataAgenda);

		const eventos = await Evento.agendaMes(dataAgenda);

		let dataInicial = eventos.inicioMes;
		dataInicial.setDate(dataInicial.getDate() - dataInicial.getDay());
		let dataFinal = eventos.fimMes;
		while (dataFinal.getDay() % 7 != 6) {
			dataFinal.setDate(dataFinal.getDate() + 1);
		}

		// Exagera pra garantir que estará nos meses anterior e seguinte
		dataInicial.setDate(dataInicial.getDate() - 1);
		dataFinal.setDate(dataFinal.getDate() + 1);
		
		const table = $('<table class="table table-sm table-bordered agenda">');
		GuiUtils.conteudoAdiciona(table);
		
		table.append($('<caption>')
				.append($('<button type="button" class="btn btn-dark float-start" onclick="javascript:Menu.agenda(\'' + dataInicial.getTime() + '\');">')
						.append("&#8592;"))
				.append("&nbsp;")
				.append(DateUtils.nomeMes(dataAgenda) + ' de ' + dataAgenda.getFullYear())
				.append("&nbsp;")
				.append($('<button type="button" class="btn btn-dark float-end" onclick="javascript:Menu.agenda(\'' + dataFinal.getTime() + '\');">')
						.append("&#8594;")));

		// Desfaz o exagero
		dataInicial.setDate(dataInicial.getDate() + 1);
		dataFinal.setDate(dataFinal.getDate() - 1);

		const thead = $('<thead>');
		thead.append(
				$('<tr>')
						.append($('<th>').append('Dom'))
						.append($('<th>').append('Seg'))
						.append($('<th>').append('Ter'))
						.append($('<th>').append('Qua'))
						.append($('<th>').append('Qui'))
						.append($('<th>').append('Sex'))
						.append($('<th>').append('Sáb'))
		);
		table.append(thead);
		
		const tbody = $('<tbody>');
		
		let tr = null;
		
		let dataAtual = new Date(dataInicial);
		while (dataAtual <= dataFinal) {
			if (dataAtual.getDay() % 7 == 0) {
				tr = $('<tr>');
				tbody.append(tr);
			}
			
			let antesDepois = 'hoje';
			if (dataAtual.toISOString() < hoje.toISOString()) {
				antesDepois = 'antes';
			}
			if (dataAtual.toISOString() > hoje.toISOString()) {
				antesDepois = 'depois';
			}
			
			const td = $('<td class="' + antesDepois + '">');
			tr.append(td);
			
			if (dataAtual.getMonth() == dataAgenda.getMonth()) {
				td
						.append($('<div class="agendaDia">')
								.append(dataAtual.getDate()))
						.append($('<div class="agendaConteudo">'));

				for (const evento of eventos.eventos) {
					if (evento.data.toDateString() == dataAtual.toDateString()) {
						const div = $('<div class="evento">');
						if (evento.tipo) {
							div.addClass(evento.tipo);
						}
						if (evento.icone) {
							div.append(evento.icone).append(' ');
						}
						if (evento.hora) {
							div.append($('<b>').append(evento.hora)).append(' ');
						}
						div.append(evento.nome);
						$(tr.find(".agendaConteudo").slice(-1)[0]).append(div);
					}
				}
			}

			dataAtual.setDate(dataAtual.getDate() + 1);
		}
		table.append(tbody);
	}
}

$(document).ready(async function() {
	Menu.agenda();
});
