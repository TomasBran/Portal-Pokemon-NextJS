'use client';

import { SelectionProvider } from '@/app/utils/context/SelectionContext';
import { PrimeReactProvider } from 'primereact/api';
import { DndProvider } from 'react-dnd';
import Navbar from '../Navbar/Navbar';
import { Toaster } from 'sonner';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageModal from '../LanguageModal/LanguageModal';

export default function MainLayout({ children }) {
	const { i18n } = useTranslation();

	useEffect(() => {
		const language = localStorage.getItem('language');
		if (language) {
			i18n.changeLanguage(language);
		}
	}, [i18n]);
	return (
		<div className='overflow-x-hidden'>
			<DndProvider backend={HTML5Backend}>
				<PrimeReactProvider>
					<SelectionProvider>
						<Navbar />
						<LanguageModal />
						{children}
						<Toaster
							position='bottom-left'
							richColors
							duration={2000}
						/>
					</SelectionProvider>
				</PrimeReactProvider>
			</DndProvider>
		</div>
	);
}
