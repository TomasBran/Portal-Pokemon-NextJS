'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';

const routes = [
	{
		url: '/',
		text: 'Home',
		isDisabled: false,
		category: 'home',
	},
	{
		url: '/games/gym',
		text: 'Gimnasio',
		isDisabled: false,
		category: 'games',
	},
	{
		url: '/games/pokedle',
		text: 'Pokedle',
		isDisabled: false,
		category: 'games',
	},
	{
		url: '/games/moveset',
		text: 'Move Set',
		isDisabled: false,
		category: 'games',
	},
	{
		url: '/games/types-challenge',
		text: 'Desafío de Tipos',
		isDisabled: false,
		category: 'games',
	},
	{
		url: '/games/build-pokemon',
		text: 'Construye un Pokemon',
		isDisabled: false,
		category: 'games',
	},
	{
		url: '/tools/calculator',
		text: 'Calculadora',
		isDisabled: false,
		category: 'tools',
	},
];

const homeRoute = [
	{
		url: '/',
		text: 'Home',
		isDisabled: false,
	},
];

const gamesRoutes = [
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

const toolsRoutes = [
	{
		url: '/tools/calculator',
		text: 'Calculadora',
		isDisabled: false,
	},
];

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenGames, setIsOpenGames] = useState(false);
	const [isOpenTools, setIsOpenTools] = useState(false);
	const gamesMenuRef = useRef(null);
	const toolsMenuRef = useRef(null);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const toggleGamesMenu = () => {
		setIsOpenGames((prev) => !prev);
		setIsOpenTools(false);
	};

	const toggleToolsMenu = () => {
		setIsOpenTools((prev) => !prev);
		setIsOpenGames(false);
	};

	const handleClickOutside = (event) => {
		if (gamesMenuRef.current && !gamesMenuRef.current.contains(event.target)) {
			setIsOpenGames(false);
		}
		if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target)) {
			setIsOpenTools(false);
		}
	};

	useEffect(() => {
		if (isOpenGames || isOpenTools) {
			document.addEventListener('click', handleClickOutside);
		} else {
			document.removeEventListener('click', handleClickOutside);
		}

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [isOpenGames, isOpenTools]);

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
				{homeRoute.map((route, index) => (
					<li
						key={index}
						className='h-full'>
						<Link
							href={route.url}
							className='font-medium px-4 text-white hover:bg-blue-500 w-full md:w-[13vw] h-full flex justify-center gap-2 items-center'>
							{route.text}
						</Link>
					</li>
				))}
				<div
					ref={gamesMenuRef}
					className='h-full cursor-pointer'
					onClick={toggleGamesMenu}>
					<span
						className={`font-medium px-4 text-white hover:bg-blue-500 w-full md:w-[13vw] h-full flex justify-center gap-1 items-center relative z-20 ${
							isOpenGames ? 'bg-blue-500' : ' bg-yellow-500'
						}`}>
						Juegos
						<div className='text-white text-xl'>
							{isOpenGames ? <MdArrowDropUp /> : <MdArrowDropDown />}
						</div>
					</span>

					<ul
						className={`bg-blue-500 flex-col flex relative z-0
							${
								isOpenGames
									? 'scale-y-100 translate-y-0'
									: 'scale-y-0 -translate-y-full'
							} transition-all transform duration-300`}>
						{gamesRoutes.map((route, index) => (
							<li
								key={index}
								className='h-full'>
								<Link
									href={route.url}
									className='px-2 py-2 text-white hover:bg-yellow-500 text- w-full md:max-w-[13vw] h-full flex justify-center items-center '>
									{route.text}
								</Link>
							</li>
						))}
					</ul>
				</div>
				<div
					ref={toolsMenuRef}
					className='h-full cursor-pointer'
					onClick={toggleToolsMenu}>
					<span
						className={`font-medium px-4 text-white hover:bg-blue-500 w-full md:w-[13vw] h-full flex justify-center gap-1 items-center relative z-20 ${
							isOpenTools ? 'bg-blue-500' : 'bg-yellow-500'
						}`}>
						Herramientas
						<div className='text-white text-xl'>
							{isOpenTools ? <MdArrowDropUp /> : <MdArrowDropDown />}
						</div>
					</span>

					<ul
						className={`bg-blue-500 flex-col flex relative z-0
							${
								isOpenTools
									? 'scale-y-100 translate-y-0'
									: 'scale-y-0 -translate-y-full'
							} transition-all transform duration-300`}>
						{toolsRoutes.map((route, index) => (
							<li
								key={index}
								className='h-full'>
								<Link
									href={route.url}
									className='px-2 py-2 text-white hover:bg-yellow-500 text- w-full md:max-w-[13vw] h-full flex justify-center items-center '>
									{route.text}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</ul>
		</nav>
	);
};

export default Navbar;
