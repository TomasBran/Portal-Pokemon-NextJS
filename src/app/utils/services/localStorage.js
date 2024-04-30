export const saveToLocalStorage = (key, data) => {
	try {
		const jsonData = JSON.stringify(data);
		localStorage.setItem(key, jsonData);
	} catch (error) {
		console.error('Error al guardar en localStorage:', error);
	}
};

export const getFromLocalStorage = (key) => {
	try {
		const jsonData = localStorage.getItem(key);
		const data = jsonData ? JSON.parse(jsonData) : null;
		return data;
	} catch (error) {
		console.error('Error al obtener de localStorage:', error);
		return null;
	}
};
