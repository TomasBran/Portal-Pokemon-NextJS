import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../public/locales/en/translation.json'; // Ruta ajustada
import esTranslations from '../public/locales/es/translation.json'; // Ruta ajustada

i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: enTranslations,
		},
		es: {
			translation: esTranslations,
		},
	},
	lng: 'es', // Idioma predeterminado
	fallbackLng: 'es', // Idioma de reserva
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
