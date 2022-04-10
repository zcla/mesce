"use strict";

class GuiUtils {
	static conteudoAdiciona(elemento) {
		return $('#mesce').append(elemento);
	}

	static conteudoLimpa() {
		$('#mesce').empty();
	}

	static isMobile() {
		// https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device#20293441
		try {
			document.createEvent("TouchEvent");
			return true;
		} catch(e) {
			return false;
		}
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
