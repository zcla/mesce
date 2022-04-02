"use strict";

class BackendUtils {
	static async getData(url) {
		return await (await fetch('/api/v1' + url)).json();
	}
}

class DateUtils {
	static formataDDMMYYYYWWW(data) {
		return data.toLocaleDateString() + ' ' + this.siglaDiaDaSemana(data);
	}

	static mesmaData(data1, data2) {
		return data1.getTime() == data2.getTime();
	}

	static noIntervalo(data, dataInicio, dataFim) {
		return ((data.toISOString() >= dataInicio.toISOString()) && (data.toISOString() <= dataFim.toISOString()));
	}

	static nomeMes(data) {
		return [
			"Janeiro",
			"Fevereiro",
			"Março",
			"Abril",
			"Maio",
			"Junho",
			"Julho",
			"Agosto",
			"Setembro",
			"Outubro",
			"Novembro",
			"Dezembro"
		][data.getMonth()];
	}

	static siglaDiaDaSemana(data) {
		return [
			"dom",
			"seg",
			"ter",
			"qua",
			"qui",
			"sex",
			"sáb"
		][data.getDay()];
	}

	static stringToDate(str) {
		const spl = str.split("/");
		return new Date(spl[2], spl[1] - 1, spl[0]);
	}
}

class DominioUtils {
	static generateId() {
		// https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid/8809472#8809472
		var d = new Date().getTime();//Timestamp
		var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16;//random number between 0 and 16
			if(d > 0){//Use timestamp until depleted
				r = (d + r)%16 | 0;
				d = Math.floor(d/16);
			} else {//Use microseconds since page-load if supported
				r = (d2 + r)%16 | 0;
				d2 = Math.floor(d2/16);
			}
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
	}

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

	static mensagemMostraErro(msg) {
		$('#mensagens').append($('<div class="alert alert-danger" role="alert">').append(msg));
		throw msg;
	}

	static mensagensLimpa() {
		$('#mensagens').empty();
	}
}

class Menu {
	static async agenda(data) {
		const hoje = new Date((new Date()).toDateString());
		let dataAgenda = new Date();
		if (data) {
			dataAgenda.setTime(parseInt(data));
		}
		dataAgenda = new Date(dataAgenda);

		GuiUtils.mensagensLimpa();
		GuiUtils.conteudoLimpa();

		const table = $('<table class="table table-sm table-bordered agenda">');
		GuiUtils.conteudoAdiciona(table);

		let inicioMes = new Date(dataAgenda.toDateString());
		inicioMes.setDate(1);
		let fimMes = new Date(dataAgenda.toDateString());
		while (fimMes.getMonth() == dataAgenda.getMonth()) {
			fimMes.setDate(fimMes.getDate() + 1);
		}
		fimMes.setDate(fimMes.getDate() - 1);

		let dataInicial = new Date(inicioMes);
		dataInicial.setDate(dataInicial.getDate() - dataInicial.getDay());
		let dataFinal = new Date(fimMes);
		while (dataFinal.getDay() % 7 != 6) {
			dataFinal.setDate(dataFinal.getDate() + 1);
		}

		// Exagera pra garantir que estará nos meses anterior e seguinte
		dataInicial.setDate(dataInicial.getDate() - 1);
		dataFinal.setDate(dataFinal.getDate() + 1);
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

		const eventos = Evento.ordenaCronologicamente(await Evento.instanciaEventosDoPeriodo(inicioMes, fimMes));

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

				for (const evento of eventos) {
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

	static async escala() {
		GuiUtils.mensagensLimpa();
		GuiUtils.conteudoLimpa();

		const escala = await BackendUtils.getData('/escala');

		const table = $('<table class="table table-sm table-bordered table-striped escala">');
		GuiUtils.conteudoAdiciona(table);

		const thead = $('<thead>');
		thead.append(
				$('<tr>')
						.append($('<th>').append('Missa'))
						.append($('<th>').append('Escalar'))
						.append($('<th>').append('Ministros'))
		);
		table.append(thead);

		const tbody = $('<tbody>');

		for (const item of escala.escala) {
			const escalados = $('<ul class="list-group list-group-horizontal">');
			for (const ministro of item.escalados) {
				escalados
						.append($('<li class="list-group-item">')
								.append(ministro));
			}

			tbody
					.append($('<tr>')
							.append($('<td class="missa">')
									.append(item.nome))
							.append($('<td class="escalar">')
									.append(item.escalar))
							.append($('<td class="escalados">')
									.append($('<span class="badge float-end ' + item.situacao + '">')
											.append(item.situacao))
									.append(escalados)));
		}

		table.append(tbody);
	}

	static async ministros() {
		GuiUtils.mensagensLimpa();
		GuiUtils.conteudoLimpa();

		const ministros = await BackendUtils.getData('/ministros');

		const table = $('<table class="table table-sm table-bordered table-striped ministros">');
		GuiUtils.conteudoAdiciona(table);

		const thead = $('<thead>');
		thead.append(
				$('<tr>')
						.append($('<th>').append('Nome (' + ministros.total + ')'))
						.append($('<th>').append('Telefone(s)'))
						.append($('<th>').append('E-mail'))
						.append($('<th>').append('Aniversário'))
						.append($('<th>').append('Disponibilidade (' + ministros.disponiveis + ')'))
		);
		table.append(thead);

		const tbody = $('<tbody>');

		for (const ministro of ministros.ministros) {
			let nomeFormatado = DominioUtils.ministro_nomeFormatado(ministro);
			const nome = $('<div>');
			if (ministro.funcao) {
				nome.append($('<span class="badge float-end funcao">')
						.append(ministro.funcao));
			}
			nome.append(nomeFormatado);

			const telefones = $('<ul class="list-group list-group-horizontal">');
			for (const telefone of ministro.telefones) {
				telefones
						.append($('<li class="list-group-item">')
								.append($('<a href="tel:' + telefone + '">')
										.append(telefone)));
			}

			tbody
					.append($('<tr>')
							.append($('<td class="nome">')
									.append(nome))
							.append($('<td class="telefones">')
									.append(telefones))
							.append($('<td class="email">')
									.append($('<a href="mailto:' + ministro.email + '">')
											.append(ministro.email)))
							.append($('<td class="aniversario">')
									.append(ministro.aniversario))
							.append($('<td class="disponibilidade">')
									.append(ministro.disponibilidade)));
			if (ministro.disponibilidade) {
				$(tbody.find('tr').slice(-1)[0]).addClass('indisponivel');
			}
		}

		table.append(tbody);
	}

	static async problemas(dias) {
		if ((!dias) || (dias < 1)) {
			dias = 14;
		}

		GuiUtils.mensagensLimpa();
		GuiUtils.conteudoLimpa();

		const table = $('<table class="table table-sm table-bordered table-striped problemas">');
		GuiUtils.conteudoAdiciona(table);

		const thead = $('<thead>');
		thead.append(
				$('<tr>')
						.append($('<th>').append('Data'))
						.append($('<th>').append('Hora'))
						.append($('<th>').append('Evento'))
						.append($('<th>').append('Escalar'))
						.append($('<th>').append('Ministros'))
		);
		table.append(thead);

		const tbody = $('<tbody>');
		const dataAtual = new Date((new Date()).toDateString());
		const dataFinal = new Date(dataAtual);
		dataFinal.setDate(dataFinal.getDate() + dias - 1);
		const eventos = Evento.ordenaCronologicamente(await Evento.instanciaEventosNaEscalaDoPeriodo(dataAtual, dataFinal));

		for (let dia = 0; dia < dias; dia++) {
			for (const evento of eventos) {
				if (evento.data.toDateString() == dataAtual.toDateString()) {
					const escalados = $('<ul class="list-group list-group-horizontal">');
					const situacao = $('<span class="badge float-end">');
					let numEscalar = 0;
					let listaEscalados = [];
					let numEscalados = 0;
					let ministrosSubstitutos = [];
					
					if (evento.itemEscala) {
						numEscalar = evento.itemEscala.escalar;
						listaEscalados = evento.itemEscala.escalados;
					} else {
						numEscalar = evento.escalar;
						for (const escalado of evento.escalados) {
							listaEscalados.push(await Ministro.buscaPorId(escalado)); // TODO deveria ser aqui mesmo??? Talvez tenha que ir pra dentro da classe, como ocorre no if acima
						}
					}
					if (!listaEscalados) {
						listaEscalados = [];
					}
					for (const ministro of listaEscalados) {
						let afastado = false;
						if (ministro.afastamentos) {
							for (const afastamento of ministro.afastamentos) {
								if (DateUtils.noIntervalo(dataAtual, DateUtils.stringToDate(afastamento.inicio), DateUtils.stringToDate(afastamento.fim))) {
									afastado = true;
									if (afastamento.substituto) {
										for (const substituto of afastamento.substituto) {
											if (DateUtils.mesmaData(DateUtils.stringToDate(substituto.data), dataAtual) && (substituto.idEscala == evento.itemEscala.id)) {
												ministrosSubstitutos.push(await Ministro.buscaPorId(substituto.idMinistro));
											}
										}
									}
								}
							}
						}
						if (afastado) {
							escalados
									.append($('<li class="list-group-item afastado">')
											.append(ministro.nomeGuerra));
						} else {
							escalados
									.append($('<li class="list-group-item">')
											.append(ministro.nomeGuerra));
							numEscalados++;
						}
					}

					for (const ministroSubstituto of ministrosSubstitutos) {
						escalados
								.append($('<li class="list-group-item substituto">')
										.append(ministroSubstituto.nomeGuerra));
						numEscalados++;
					}

					if (numEscalados >= numEscalar) {
						situacao.addClass('bg-success');
						situacao.append('ok');
					} else {
						situacao.addClass('bg-danger');
						const faltam = numEscalar - numEscalados;
						situacao.append('falta' + (faltam == 1 ? '' : 'm') + ' ' + faltam);
					}

					tbody
							.append($('<tr>')
									.append($('<td class="data">')
											.append(DateUtils.formataDDMMYYYYWWW(dataAtual)))
									.append($('<td class="hora">')
											.append(evento.hora))
									.append($('<td class="evento">')
											.append(evento.nome))
									.append($('<td class="escalar">')
											.append(numEscalar))
									.append($('<td class="escalados">')
											.append(situacao)
											.append(escalados)));
				}
			}

			dataAtual.setDate(dataAtual.getDate() + 1);
		}

		table.append(tbody);
	}
}

$(document).ready(function() {
	Menu.problemas();
});
