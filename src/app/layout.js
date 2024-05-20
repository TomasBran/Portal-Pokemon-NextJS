import { Inter } from 'next/font/google';
import './globals.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import MainLayout from './Components/MainLayout/MainLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Portal Pokemon',
	description: 'El Portal donde todos los Pokemon se reunen.',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<head>
				<link
					href='data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAC4uLgAz8/PAAAAAAD///8A29vbAAAA/wCmpqYA6+vrAAAAhwAAAOMAkZGRAAAA1AAAAL0AAACmAAAAAAAAAAAAIiIiIiIiIiIiIiN0EGIiIiIjMzdBBqIiIjMzM3QQaiIiMzMzN0EGIiMzMyIidBBiIzMyIiInQQIiIiIiIiIiIiIiIiIiIiIiJVVSIiIlm9IlVVUiIlm8giJVVVVVm80iIlVVVVm82CIiJVVVm82CIiIiJVm80iIiIiIiIiIiIiL4HwAA4AcAAMADAACAAQAAgAEAAAAAAAADwAAAAkAAAAJAAAADwAAAAAAAAIABAACAAQAAwAMAAOAHAAD4HwAA'
					rel='icon'
					type='image/x-icon'
				/>
				<link
					rel='stylesheet'
					href='https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
				/>
			</head>
			<body className={inter.className}>
				<MainLayout>{children}</MainLayout>
			</body>
		</html>
	);
}
