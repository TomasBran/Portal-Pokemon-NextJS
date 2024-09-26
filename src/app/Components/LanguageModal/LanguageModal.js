import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Flag from 'react-world-flags';

const LanguageModal = () => {
	const { i18n } = useTranslation();
	const [isModalVisible, setIsModalVisible] = useState(false);

	useEffect(() => {
		const language = localStorage.getItem('language');
		if (!language) {
			setIsModalVisible(true);
		} else {
			i18n.changeLanguage(language);
		}
	}, [i18n]);

	const handleLanguageSelect = (lang) => {
		localStorage.setItem('language', lang);
		i18n.changeLanguage(lang);
		setIsModalVisible(false);
	};

	return (
		isModalVisible && (
			<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90'>
				<div className='bg-white p-8 sm:rounded-lg shadow-lg sm:w-[50vw] w-screen h-[50vh] flex flex-col items-center justify-center gap-10'>
					<h2 className='text-2xl font-pokemon font-bold mb-4 text-black text-center'>
						Choose your language
					</h2>
					<div className='flex sm:gap-20 gap-8'>
						<button
							className=' h-20 w-32 hover:drop-shadow-2xl shadow-black hover:scale-105 transition-all duration-150 '
							onClick={() => handleLanguageSelect('en')}>
							<Flag
								code='GB'
								style={{
									height: '100%',
									objectFit: 'cover',
									borderRadius: '10px',
								}}
							/>
						</button>
						<button
							className=' h-20 w-32 hover:drop-shadow-2xl shadow-black hover:scale-105 transition-all duration-150 '
							onClick={() => handleLanguageSelect('es')}>
							<Flag
								code='ES'
								style={{
									height: '100%',
									objectFit: 'cover',
									borderRadius: '10px',
								}}
							/>
						</button>
					</div>
				</div>
			</div>
		)
	);
};

export default LanguageModal;
