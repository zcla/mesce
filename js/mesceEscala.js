"use strict";

class Escala {
	static async getData() {
		return await (await fetch('/api/v1/oldEscala')).json();
	}

	constructor() {
		return (async () => {
			this.escala = [];
			const data = await Escala.getData();
			const idsItens = Object.keys(data);
			for (const idItem of idsItens) {
				const item = data[idItem];

				const escalados = [];
				for (const escalado of item.escalados) {
					escalados.push(await Ministro.buscaPorId(escalado));
				}

				this.escala.push(new EscalaItem(idItem, {
					nome: item.nome,
					evento: await Evento.buscaPorId(item.evento),
					ordem: item.ordem,
					escalar: item.escalar,
					escalados: Ministro.ordenaPorNome(escalados)
				}));
			}
			return this;
		})();
	}
}

class EscalaItem {
	constructor(id, obj) {
		this.id = id;
		this.nome = obj.nome;
		this.evento = obj.evento;
		this.ordem = obj.ordem;
		this.escalar = obj.escalar;
		this.escalados = obj.escalados;
	}
}
