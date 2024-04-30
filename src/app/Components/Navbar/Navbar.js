'use client';

import Link from 'next/link';
import { useState } from 'react';

const routes = [
	{
		url: '/',
		text: 'Home',
		isDisabled: false,
	},
	{
		url: '/tools/calculator',
		text: 'Calculadora',
		isDisabled: false,
	},
	{
		url: '/games/gym',
		text: 'Gimnasio',
		isDisabled: false,
	},
	{
		url: '/games/pokedle',
		text: 'Pokedle',
		isDisabled: false,
	},
	{
		url: '/games/moveset',
		text: 'Move Set',
		isDisabled: false,
	},
	{
		url: '/games/types-challenge',
		text: 'Desafío de Tipos',
		isDisabled: false,
	},
	{
		url: '/games/build-pokemon',
		text: 'Construye un Pokemon',
		isDisabled: false,
	},
];

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<nav className='bg-yellow-500 fixed top-0 w-screen z-10'>
			<div
				className={`md:hidden visible flex h-full justify-between items-center px-4 py-2`}>
				<Link
					href='/'
					className='text-white font-bold text-md h-full'
					onClick={() => setIsOpen(false)}>
					Portal Pokemon
				</Link>
				<button
					className='block md:hidden text-white focus:outline-none'
					onClick={toggleMenu}>
					{isOpen ? (
						<svg
							className='w-6 h-6'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					) : (
						<svg
							className='w-6 h-6'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M4 6h16M4 12h16m-7 6h7'
							/>
						</svg>
					)}
				</button>
			</div>
			<div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
				<ul className='bg-yellow-400 shadow-lg shadow-yellow-400'>
					{routes.map((route, index) => (
						<li key={index}>
							<Link
								href={route.url}
								className='block py-2 px-4 text-white hover:bg-blue-400'
								onClick={toggleMenu}>
								{route.text}
							</Link>
						</li>
					))}
				</ul>
			</div>

			<ul className='hidden md:flex h-14 items-center'>
				{routes.map((route, index) => (
					<li
						key={index}
						className='h-full'>
						<Link
							href={route.url}
							className='block font-medium px-4 text-white hover:bg-blue-500 w-full md:min-w-[8vw] h-full flex justify-center items-center '>
							{route.text}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default Navbar;
