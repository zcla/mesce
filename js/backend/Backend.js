"use strict";

class Backend {
    static __data = {};
    static _data = null;

    static async getData(qual) {
        let result = this.__data[qual];
        if (!result) {
            result = await (await fetch('data/' + qual + '.json')).json();
            this.__data[qual] = result;
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

/*
    static getEventos() {
        return this._data.eventos;
    }
*/
}
