import { Inter } from 'next/font/google';
import './globals.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import MainLayout from './Components/MainLayout/MainLayout';
import Navbar from './Components/Navbar/Navbar';
import { Toaster } from 'sonner';
import { PrimeReactProvider } from 'primereact/api';
import { SelectionProvider } from './utils/context/SelectionContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Portal Pokemon',
	description: 'El Portal donde todos los Pokemon se reunen.',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<MainLayout>{children}</MainLayout>
			</body>
		</html>
	);
}
