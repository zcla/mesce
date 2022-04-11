"use strict";

class Backend {
    static _data = {};

    static async getData(qual) {
        let result = this._data[qual];
        if (!result) {
            result = await (await fetch('data/' + qual + '.json')).json();
            this._data[qual] = result;
        }
        // TODO fazer uma checagem de "FK"s
        return result;
    }

    static async GET_Escala(nome) {
		const result = [];

        const escala = await this.getData('escala');

        for (const idItem of Object.keys(escala[nome])) {
            const item = escala[nome][idItem];
            item.id = idItem;
            result.push(item);
        }
        return result;
    }

    static async GET_Evento() {
		const result = [];

        const eventos = await this.getData('evento');

        for (const idEvento of Object.keys(eventos)) {
            const evento = eventos[idEvento];
            evento.id = idEvento;
            result.push(evento);
        }
        return result;
    }

	static async GET_Ministro() {
		const result = [];

        const ministros = await this.getData('ministro');

        for (const idMinistro of Object.keys(ministros)) {
            const ministro = ministros[idMinistro];
            ministro.id = idMinistro;
            result.push(ministro);
        }
        return result;
	}
}
