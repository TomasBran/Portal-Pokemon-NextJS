'use client';

import { SelectionProvider } from '@/app/utils/context/SelectionContext';
import { PrimeReactProvider } from 'primereact/api';
import { DndProvider } from 'react-dnd';
import Navbar from '../Navbar/Navbar';
import { Toaster } from 'sonner';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function MainLayout({ children }) {
	return (
		<div>
			<DndProvider backend={HTML5Backend}>
				<PrimeReactProvider>
					<SelectionProvider>
						<Navbar />
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
