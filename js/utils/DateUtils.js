
class DateUtils {
	// TODO Procurar lugares do código onde não usa isso e deveria
	static adicionaDias(data, dias) {
		return new Date(data.getTime() + (dias * 86400000));
	}

	static dataSemHora(data) {
		return new Date(data.toDateString());
	}

	static diaMes(data) {
		return data.getDate().toString().padStart(2, "0") + '/' + (data.getMonth() + 1).toString().padStart(2, "0");
	}

	static mesmaData(data1, data2) {
		return data1.getTime() == data2.getTime();
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

	static stringToDate(str) {
		const spl = str.split("/");
		return new Date(spl[2], spl[1] - 1, spl[0]);
	}
}
