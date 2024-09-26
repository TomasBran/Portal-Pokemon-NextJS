'use client';

import Flag from 'react-world-flags';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
	const { i18n } = useTranslation();
	const [activeLang, setActiveLang] = useState(i18n.language || 'es');

	const toggleLanguage = () => {
		const newLang = activeLang === 'es' ? 'en' : 'es';
		i18n.changeLanguage(newLang);
		setActiveLang(newLang);
	};

	return (
		<div
			className='fixed sm:bottom-1/2 bottom-0 left-0 sm:transform sm:translate-y-1/2 flex flex-col sm:rounded-r-lg rounded-tr-lg rounded-none overflow-auto cursor-pointer sm:opacity-40 hover:opacity-100'
			onClick={toggleLanguage}>
			<div
				className={`px-2 py-1 transition-all text-xs ${
					activeLang === 'es' ? 'bg-green-500 text-white' : 'bg-gray-500'
				}`}>
				<Flag
					code='ES'
					style={{ width: '24px', height: '24px' }}
				/>
			</div>
			<div
				className={`px-2 py-1 transition-all text-xs ${
					activeLang === 'en' ? 'bg-green-500 text-white' : 'bg-gray-500'
				}`}>
				<Flag
					code='GB'
					style={{ width: '24px', height: '24px' }}
				/>
			</div>
		</div>
	);
};

export default LanguageSwitcher;
