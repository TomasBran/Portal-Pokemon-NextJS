'use client';

import Image from 'next/image';
import gym from '../../public/assets/gym.png';
import calculator from '../../public/assets/calculator.png';
import pokedle from '../../public/assets/pokedle.png';
import moveset from '../../public/assets/moveset_background.jpg';
import typesChallenge from '../../public/assets/types_challenge.webp';
import build_pokemon from '../../public/assets/build_pokemon.png';
import { useTranslation } from 'react-i18next';
import '../../config/i18n';
import GameModal from './Components/GameModal/GameModal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
	const { t } = useTranslation();
	const [selectedItem, setSelectedItem] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter();

	const buttonsArray = [
		{
			url: '/games/gym',
			text: t('home.modals.gym.description'),
			image: gym,
			typeText: 'Juego',
			isDisabled: false,
			code: 'gym',
			typeCode: 'game',
			buttonText: t('home.modals.gym.button'),
			onAction: () => router.push('/games/gym'),
		},
		{
			url: '/games/pokedle',
			text: t('home.modals.pokedle.description'),
			image: pokedle,
			typeText: 'Juego',
			isDisabled: false,
			code: 'pokedle',
			typeCode: 'game',
			buttonText: t('home.modals.pokedle.button'),
			onAction: () => router.push('/games/pokedle'),
		},
		{
			url: '/games/moveset',
			text: t('home.modals.moveset.description'),
			image: moveset,
			typeText: 'Juego',
			isDisabled: false,
			code: 'moveset',
			typeCode: 'game',
			buttonText: t('home.modals.moveset.button'),
			onAction: () => router.push('/games/moveset'),
		},
		{
			url: '/games/types-challenge',
			text: t('home.modals.types_challenge.description'),
			image: typesChallenge,
			typeText: 'Juego',
			isDisabled: false,
			code: 'types_challenge',
			typeCode: 'game',
			buttonText: t('home.modals.types_challenge.button'),
			onAction: () => router.push('/games/types-challenge'),
		},
		{
			url: '/games/build-pokemon',
			text: t('home.modals.build_pokemon.description'),
			image: build_pokemon,
			typeText: 'Juego',
			isDisabled: false,
			code: 'build_pokemon',
			typeCode: 'game',
			buttonText: t('home.modals.build_pokemon.button'),
			onAction: () => router.push('/games/build-pokemon'),
		},
		{
			url: '/tools/calculator',
			text: t('home.modals.calculator.description'),
			image: calculator,
			typeText: 'Herramienta',
			isDisabled: false,
			code: 'calculator',
			typeCode: 'tool',
			buttonText: t('home.modals.calculator.button'),
			onAction: () => router.push('/tools/calculator'),
		},
	];

	const openModal = (item) => {
		setSelectedItem(item);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div className='min-h-screen pt-10 bg-gray-200 sm:bg-gray-200 flex flex-col justify-center items-center w-screen'>
			<h2 className='sm:block hidden sm:text-3xl text-lg pt-4 -mb-3 sm:mb-0 font-pokemon text-gray-700 text-center'>
				{t('home.portal')}
			</h2>
			<div className='flex flex-col w-full'>
				<div className='flex justify-evenly flex-wrap gap-7 w-full px-3 pb-3 pt-6'>
					{buttonsArray.map((button, index) => (
						<div
							className='no-underline lg:w-3/12 w-full relative'
							// href={`${button.url}`}
							key={index}
							onClick={() => openModal(button)}>
							<button
								disabled={button.isDisabled}
								className={`p-2 md:p-4 w-full h-[35vh] rounded-lg border-none text-white no-underline bg-cover bg-center ease-in duration-150 enabled:active:scale-95 disabled:cursor-default group shadow-black/80 shadow-lg md:opacity-85 md:enabled:hover:opacity-100`}
								style={{ backgroundImage: `url(${button.image})` }}>
								<Image
									priority
									src={button.image}
									class='absolute inset-0 w-full h-full object-cover rounded-lg'
									alt={button.text}
								/>
								<div className='flex items-end justify-between w-full h-full flex-col'>
									{!button.isDisabled && (
										<div
											className={`absolute top-4 transform py-2 px-6 rounded-md transition duration-150 ease-in sm:font-bold font-medium text-shadow-md shadow-lg shadow-black group-hover:shadow-black/60
											${button.typeText === 'Herramienta' && 'bg-teal-200 text-teal-700 '}
											${button.typeText === 'Juego' && 'bg-slate-300 text-slate-600 '}`}>
											<span>{t(`home.type.${button.typeCode}`)}</span>
										</div>
									)}
									{!button.isDisabled && (
										<div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-zinc-300/80 text-gray-700 p-1 w-full  transition duration-150  ease-in group-hover:bg-yellow-300 group-hover:text-yellow-800'>
											<span className='no-underline sm:font-bold font-semibold sm:text-lg text-base text-shadow-md'>
												{t(`home.buttons.${button.code}`)}
											</span>
										</div>
									)}
								</div>
							</button>
						</div>
					))}
				</div>
			</div>
			{selectedItem && (
				<GameModal
					isOpen={isModalOpen}
					onClose={closeModal}
					imageSrc={selectedItem.image}
					description={selectedItem.text}
					buttonText={selectedItem.buttonText}
					onAction={() => {
						closeModal();
						selectedItem.onAction();
					}}
				/>
			)}
		</div>
	);
}
