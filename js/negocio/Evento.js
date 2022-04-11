"use strict";

class Evento {
	static async agendaMes(data) {
		const result = {
		};

		result.inicioMes = new Date(data.toDateString());
		result.inicioMes.setDate(1);
		result.fimMes = new Date(data.toDateString());
		while (result.fimMes.getMonth() == data.getMonth()) {
			result.fimMes.setDate(result.fimMes.getDate() + 1);
		}
		result.fimMes.setDate(result.fimMes.getDate() - 1);
		result.eventos = this.ordenaCronologicamente(await this.instanciaEventosDoPeriodo(result.inicioMes, result.fimMes));
		
		return result;
	}

	static async instanciaEventosDoPeriodo(dataInicial, dataFinal) {
		// Retira a hora da data
		dataInicial = DateUtils.dataSemHora(dataInicial);
		dataFinal = DateUtils.dataSemHora(dataFinal);
		
		const result = [];
		
		const eventos = await Backend.GET_Evento();
		const ministros = Ministro.ordenaPorNome(await Backend.GET_Ministro());
		
		let dataAtual = new Date(dataInicial);
		while (dataAtual <= dataFinal) {
			// Aniversários
			for (const ministro of ministros) {
				if (ministro.aniversario == DateUtils.diaMes(dataAtual)) {
					result.push(new EventoInstancia({
						data: new Date(dataAtual),
						tipo: 'aniversario',
						icone: "&#127874;",
						nome: ministro.nomeGuerra
					}));
				}
			}
			
			// Eventos
			for (const evento of eventos) {
				switch (evento.frequencia) {
					// Mensais
					case "mensal":
						let desconhecido = true;
						if (evento.diaDoMes) {
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
							desconhecido = false;
						}
						if (evento.diaDaSemana && evento.enesimo) {
							let data = new Date(dataInicial);
							let incremento = 1;
							if (evento.enesimo < 0) {
								data = new Date(dataFinal);
								incremento = -1;
							}
							data.setDate(data.getDate() + (incremento * -1));
							let qual = 0;
							while (qual != evento.enesimo) {
								data.setDate(data.getDate() + incremento);
								if (data.getDay() == evento.diaDaSemana) {
									qual += incremento;
								}
							}
							if (DateUtils.mesmaData(data, dataAtual)) {
								result.push(new EventoInstancia({
									data: new Date(dataAtual),
									hora: evento.hora,
									tipo: evento.tipo,
									icone: evento.icone,
									nome: evento.nome,
									eventoPai: evento
								}, evento));
							}
							desconhecido = false;
						}
						if (desconhecido) {
							throw "Configuração desconhecida: " + evento.nome + " (" + evento.tipo + ")";
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
					
					// TODO testar quando houver
					/*
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
					*/

					// Frequência desconhecida
					default:
						throw "Frequência desconhecida: " + evento.frequencia;
				}
			}

			dataAtual.setDate(dataAtual.getDate() + 1);
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
			if (a.hora && !(b.hora)) {
				return 1;
			}
			if (!(a.hora) && b.hora) {
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
