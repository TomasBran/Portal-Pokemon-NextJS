export const saveToSessionStorage = (key, data) => {
	if (typeof window !== 'undefined') {
		try {
			const jsonData = JSON.stringify(data);
			sessionStorage.setItem(key, jsonData);
		} catch (error) {
			console.error('Error al guardar en sessionStorage:', error);
		}
	} else {
		console.error(
			'No se puede acceder a sessionStorage porque no estamos en un entorno de navegador.'
		);
	}
};

export const getFromSessionStorage = (key) => {
	if (typeof window !== 'undefined') {
		try {
			const jsonData = sessionStorage.getItem(key);
			const data = jsonData ? JSON.parse(jsonData) : null;
			return data;
		} catch (error) {
			console.error('Error al obtener de sessionStorage:', error);
			return null;
		}
	} else {
		console.error(
			'No se puede acceder a sessionStorage porque no estamos en un entorno de navegador.'
		);
		return null;
	}
};
