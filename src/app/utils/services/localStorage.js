export const saveToLocalStorage = (key, data) => {
	if (typeof window !== 'undefined') {
		try {
			const jsonData = JSON.stringify(data);
			localStorage.setItem(key, jsonData);
		} catch (error) {
			console.error('Error al guardar en localStorage:', error);
		}
	} else {
		console.error(
			'No se puede acceder a localStorage porque no estamos en un entorno de navegador.'
		);
	}
};

export const getFromLocalStorage = (key) => {
	if (typeof window !== 'undefined') {
		try {
			const jsonData = localStorage.getItem(key);
			const data = jsonData ? JSON.parse(jsonData) : null;
			return data;
		} catch (error) {
			console.error('Error al obtener de localStorage:', error);
			return null;
		}
	} else {
		console.error(
			'No se puede acceder a localStorage porque no estamos en un entorno de navegador.'
		);
		return null;
	}
};
