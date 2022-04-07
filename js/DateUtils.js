
class DateUtils {
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
