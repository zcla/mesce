"use strict";

/*
class Evento {
	static instanciaEventosDoPeriodo(dataInicial, dataFinal) {
		// Retira a hora da data
		dataInicial = new Date(dataInicial.toDateString());
		dataFinal = new Date(dataFinal.toDateString());

		const result = [];

		const ministros = Ministro.ordenaPorNome(Ministro.listaTodos());

		let dataAtual = new Date(dataInicial);
		while (dataAtual <= dataFinal) {
			// Aniversários
			for (const ministro of ministros) {
				if (ministro.aniversario == dataAtual.getDate().toString().padStart(2, "0") + '/' + (dataAtual.getMonth() + 1).toString().padStart(2, "0")) {
					result.push(new EventoInstancia({
						data: new Date(dataAtual),
						tipo: 'aniversario',
						icone: "&#127874;",
						nome: ministro.nomeGuerra
					}));
				}
			}

			// Eventos
			const eventos = Evento.listaTodos();
			for (const evento of eventos) {
				switch (evento.frequencia) {
					// Mensais
					case "mensal":
						if (dataAtual.getDate() == evento.diaDoMes) {
							result.push(new EventoInstancia({
								data: new Date(dataAtual),
								hora: evento.hora,
								tipo: evento.tipo,
								icone: evento.icone,
								nome: evento.nome,
								eventoPai: evento
							}, evento));
						}
						break;
					
					// Semanais
					case "semanal":
						if (dataAtual.getDay() == evento.diaDaSemana) {
							result.push(new EventoInstancia({
								data: new Date(dataAtual),
								hora: evento.hora,
								tipo: evento.tipo,
								icone: evento.icone,
								nome: evento.nome,
								eventoPai: evento
							}));
						}
						break;
					
					// Únicos
					case "unico":
						if (DateUtils.mesmaData(dataAtual, DateUtils.stringToDate(evento.data))) {
							result.push(new EventoInstancia({
								data: DateUtils.stringToDate(evento.data),
								hora: evento.hora,
								tipo: evento.tipo,
								icone: evento.icone,
								nome: evento.nome,
								escalar: evento.escalar,
								escalados: evento.escalados
							}));
						}
					break;

					// Frequência desconhecida
					default:
						throw "Frequência desconhecida: " + evento.frequencia;
				}
			}

			dataAtual.setDate(dataAtual.getDate() + 1);
		}

		return result;
	}

	static listaTodos() {
		const result = [];
		const data = Backend.getEventos();
		const ids = Object.keys(data);
		for (const id of ids) {
			result.push(new Evento(id, data[id]));
		}
		return result;
	}

	static ordenaCronologicamente(eventos) {
		return eventos.sort(function(a, b) {
			if (a.data > b.data) {
				return 1;
			}
			if (a.data < b.data) {
				return -1;
			}
			if (a.hora > b.hora) {
				return 1;
			}
			if (a.hora < b.hora) {
				return -1;
			}
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
		this.frequencia = obj.frequencia;
		this.diaDaSemana = obj.diaDaSemana;
		this.diaDoMes = obj.diaDoMes;
		this.data = obj.data;
		this.hora = obj.hora;
		this.tipo = obj.tipo;
		this.icone = obj.icone;
		this.escalar = obj.escalar;
		this.escalados = obj.escalados;
	}
}

class EventoInstancia extends Evento {
	constructor(obj) {
		super(DominioUtils.generateId(), obj);
		this.eventoPai = obj.eventoPai;
	}
}
*/
