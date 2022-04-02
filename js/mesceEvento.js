"use strict";

class Evento {
	static async getData() {
		return await (await fetch('/api/v1/eventos')).json();
	}

	static async buscaPorId(id) {
		const data = await Evento.getData();
		return new Evento(id, data[id]);
	}

	static async instanciaEventosDoPeriodo(dataInicial, dataFinal) {
		// Retira a hora da data
		dataInicial = new Date(dataInicial.toDateString());
		dataFinal = new Date(dataFinal.toDateString());

		const result = [];

		const ministros = Ministro.ordenaPorNome(await Ministro.listaTodos());

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
			const eventos = await Evento.listaTodos();
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

	static async instanciaEventosNaEscalaDoPeriodo(dataInicial, dataFinal) {
		const eventos = await this.instanciaEventosDoPeriodo(dataInicial, dataFinal);
		const escala = await new Escala();
		const result = [];

		for (const evento of eventos) {
			if (evento.eventoPai) { // TODO Ignora eventos sem "pai" (feito para ignorar aniversários, mas pode dar problema)
				for (const item of escala.escala) {
					if (item.evento.id == evento.eventoPai.id) {
						result.push(new EventoInstanciaEscala({
							data: evento.data,
							hora: evento.hora,
							tipo: evento.tipo,
							icone: evento.icone,
							nome: evento.nome,
							eventoPai: evento.eventoPai,
							itemEscala: item
						}));
					}
				}
			} else {
				if (evento.tipo == 'aniversario') {
					// ignora
				} else {
					result.push(new EventoInstanciaEscala({
						data: evento.data,
						hora: evento.hora,
						tipo: evento.tipo,
						icone: evento.icone,
						nome: evento.nome,
						eventoPai: evento.eventoPai,
						escalar: evento.escalar,
						escalados: evento.escalados
					}));
				}
			}
		}

		return result;
	}

	static async listaTodos() {
		const result = [];
		const data = await Evento.getData();
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

class EventoInstanciaEscala extends EventoInstancia {
	constructor(obj) {
		super(obj);
		this.itemEscala = obj.itemEscala;
	}
}
