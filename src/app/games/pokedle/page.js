'use client';

import React, { useEffect, useRef, useState } from 'react';
import PokemonSearch from '../../Components/PokemonSearch/PokemonSearch.js';
import { getPokemon } from '../../utils/services/pokemon.js';
import { generateRandomPokemonNumber } from '../../utils/functions.js';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Generations from '../../Components/Generations/Generations.js';
import settings from '../../../../public/assets/settings.png';
import {
	getFromLocalStorage,
	saveToLocalStorage,
} from '../../utils/services/localStorage.js';
import Image from 'next/image.js';
import TutorialModal from '@/app/Components/TutorialModal/TutorialModal.js';
import { useTranslation } from 'react-i18next';

const Pokedle = () => {
	const { t } = useTranslation();

	//PONER FALSE CUANDO NO ESTE TESTEANDO
	const testing = false; //PONER FALSE CUANDO NO ESTE TESTEANDO
	if (testing) console.log('TESTING ON'); //PONER FALSE CUANDO NO ESTE TESTEANDO
	//PONER FALSE CUANDO NO ESTE TESTEANDO

	const MySwal = withReactContent(Swal);

	useEffect(() => {
		if (getFromLocalStorage('pokedle_streak') === null) {
			saveToLocalStorage('pokedle_streak', 0);
		}
		if (getFromLocalStorage('pokedle_stats') === null) {
			saveToLocalStorage('pokedle_stats', {
				guesses: {
					1: 0,
					2: 0,
					3: 0,
					4: 0,
					5: 0,
					6: 0,
					7: 0,
					8: 0,
					9: 0,
					10: 0,
				},
				games_restarted: 0,
			});
		}
	}, []);

	const tutorialModalOpened =
		getFromLocalStorage('pokedle_tutorial') === 'true';
	const [isModalOpen, setIsModalOpen] = useState(!tutorialModalOpened);

	const [comparisons, setComparisons] = useState([]);
	const [inputValue, setInputValue] = useState('');
	const [originalPokemon, setOriginalPokemon] = useState({});
	const [currentGenerations, setCurrentGenerations] = useState([
		true,
		true,
		true,
		true,
		true,
		true,
		true,
		true,
	]);
	const [showSettings, setShowSettings] = useState(false);
	const settingsRef = useRef(null);

	const [guessButtonDisabled, setGuessButtonDisabled] = useState(false);

	const tutorialSteps = [
		{
			image: '/assets/tutorial/pokedle/tutorial_1.png',
			text: t('pokedle.tutorial.1'),
		},
		{
			image: '/assets/tutorial/pokedle/tutorial_2.png',
			text: t('pokedle.tutorial.2'),
		},
		{
			image: '/assets/tutorial/pokedle/tutorial_3.png',
			text: t('pokedle.tutorial.3'),
		},
	];

	const attributes = [
		t('pokedle.attributes.image'),
		t('pokedle.attributes.name'),
		t('pokedle.attributes.generation'),
		t('pokedle.attributes.type_1'),
		t('pokedle.attributes.type_2'),
		t('pokedle.attributes.power'),
		t('pokedle.attributes.weight'),
		t('pokedle.attributes.height'),
	];

	useEffect(() => {
		startNewGame();
	}, []);

	const startNewGame = async () => {
		if (testing) {
			const newPokemon = await getPokemon('eevee');
			setOriginalPokemon(newPokemon);
			return;
		}
		const newPokemon = await getPokemon(
			generateRandomPokemonNumber(currentGenerations)
		);
		setOriginalPokemon(newPokemon);
	};

	const comparePokemon = async (chosenPokemon) => {
		const newChosenPokemon = await getPokemon(chosenPokemon.toLowerCase());

		if (newChosenPokemon === undefined) {
			return;
		}

		const results = {};

		for (const property in newChosenPokemon) {
			if (property === 'hasBeenChosen' || property === 'id') {
				setComparisons([results, ...comparisons]);
				break;
			}
			if (property !== 'stats') {
				if (property === 'img') {
					results[property] = {
						img: newChosenPokemon[property],
						class: 'image-guess',
					};
				} else if (property === 'name') {
					results[property] = { value: newChosenPokemon[property] };
				} else if (
					newChosenPokemon.hasOwnProperty(property) &&
					originalPokemon.hasOwnProperty(property)
				) {
					if (newChosenPokemon[property] === originalPokemon[property]) {
						results[property] = {
							value: newChosenPokemon[property],
							class: 'correct-guess',
						};
					} else if (property === 'type_1' || property === 'type_2') {
						const otherType = property === 'type_1' ? 'type_2' : 'type_1';
						if (originalPokemon[otherType] === newChosenPokemon[property]) {
							results[property] = {
								value: newChosenPokemon[property],
								class: 'partial-correct-guess',
							};
						} else {
							results[property] = {
								value: checkCorrection(property, newChosenPokemon[property]),
								class: 'wrong-guess',
							};
						}
					} else {
						results[property] = {
							value: checkCorrection(property, newChosenPokemon[property]),
							class: 'wrong-guess',
						};
					}
				}
			}
		}

		if (originalPokemon.name === newChosenPokemon.name) {
			const pokemon = originalPokemon.name.replace(/-/g, ' ');

			const tries = comparisons.length + 1;

			const response = await MySwal.fire({
				title: t('pokedle.messages.win.title', { pokemon }),
				text: `${
					comparisons.length === 0
						? t('pokedle.messages.win.text.one_try')
						: t('pokedle.messages.win.text.more_tries', { tries })
				}`,
				icon: 'success',
				showCancelButton: true,
				confirmButtonColor: '#007bff',
				cancelButtonColor: '#787878',
				confirmButtonText: t('pokedle.buttons.play_again'),
				cancelButtonText: t('pokedle.buttons.see_board'),
			});
			updatePokedleStats(comparisons.length + 1);
			if (response.isConfirmed) {
				reloadGame();
			} else {
				setGuessButtonDisabled(true);
			}
		}
	};

	const checkCorrection = (element, value) => {
		let newValue = value;

		if (
			element === 'height' ||
			element === 'weight' ||
			element === 'power' ||
			element === 'generation'
		) {
			if (originalPokemon[element] > value) {
				newValue += ' ↑';
			} else {
				newValue += ' ↓';
			}
		}

		return newValue;
	};

	const getGenerations = (childGenerations) => {
		setCurrentGenerations(childGenerations);
	};

	const reloadGame = () => {
		setComparisons([]);
		startNewGame();
		setGuessButtonDisabled(false);
	};

	const resetGame = async () => {
		if (document.getElementById('guess-button').disabled === true) {
			reloadGame();
			return;
		}

		const response = await MySwal.fire({
			title: t('pokedle.messages.restart.title'),
			text: t('pokedle.messages.restart.text'),
			icon: 'warning',
			showCancelButton: true,
			cancelButtonText: t('pokedle.buttons.cancel'),
			confirmButtonText: t('pokedle.buttons.confirm'),
			confirmButtonColor: 'rgb(99 102 241)',
			cancelButtonColor: 'rgb(239 68 68)',
		});
		if (response.isConfirmed) {
			const pokemon = originalPokemon.name.replace(/-/g, ' ');

			await MySwal.fire({
				title: t('pokedle.messages.lose.title'),
				html: t('pokedle.messages.lose.text', { pokemon }),
				icon: 'error',
				showCancelButton: false,
				confirmButtonText: t('pokedle.buttons.play_again'),
			});
			reloadGame();
			updatePokedleResetNumber();
		}
	};

	const handleInputChange = (value) => {
		setInputValue(value);
	};

	const putDataStyle = (data) => {
		switch (data) {
			case 'correct-guess':
				return 'bg-green-600';

			case 'wrong-guess':
				return 'bg-red-600';

			case 'partial-correct-guess':
				return 'bg-yellow-600';

			default:
				return 'bg-slate-700';
		}
	};

	const handleShowSettings = () => {
		setShowSettings((prev) => !prev);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				showSettings &&
				settingsRef.current &&
				!settingsRef.current.contains(event.target) &&
				!Swal.isVisible()
			) {
				setShowSettings(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showSettings]);

	const openPokedleTutorial = () => {
		setShowSettings(false);
		setIsModalOpen(true);
	};

	const updatePokedleResetNumber = () => {
		const pokedleStats = getFromLocalStorage('pokedle_stats') || {
			guesses: {
				1: 0,
				2: 0,
				3: 0,
				4: 0,
				5: 0,
				6: 0,
				7: 0,
				8: 0,
				9: 0,
				10: 0,
			},
			games_restarted: 0,
		};
		pokedleStats.games_restarted++;
		saveToLocalStorage('pokedle_stats', pokedleStats);
	};

	const updatePokedleStats = (score) => {
		const pokedleStats = getFromLocalStorage('pokedle_stats') || {
			guesses: {
				1: 0,
				2: 0,
				3: 0,
				4: 0,
				5: 0,
				6: 0,
				7: 0,
				8: 0,
				9: 0,
				10: 0,
			},
			games_restarted: 0,
		};

		if (score > 10) {
			score = 10;
		}
		pokedleStats.guesses[score]++;

		saveToLocalStorage('pokedle_stats', pokedleStats);
	};

	const openStats = () => {
		const pokedleStats = getFromLocalStorage('pokedle_stats');
		setShowSettings(false);

		const guesses_1 = pokedleStats.guesses[1];
		const guesses_2 = pokedleStats.guesses[2];
		const guesses_3 = pokedleStats.guesses[3];
		const guesses_4 = pokedleStats.guesses[4];
		const guesses_5 = pokedleStats.guesses[5];
		const guesses_6 = pokedleStats.guesses[6];
		const guesses_7 = pokedleStats.guesses[7];
		const guesses_8 = pokedleStats.guesses[8];
		const guesses_9 = pokedleStats.guesses[9];
		const guesses_10 = pokedleStats.guesses[10];
		const restarts = pokedleStats.games_restarted;

		MySwal.fire({
			title: t('pokedle.modals.stats.title'),
			html: t('pokedle.modals.stats.text', {
				guesses_1,
				guesses_2,
				guesses_3,
				guesses_4,
				guesses_5,
				guesses_6,
				guesses_7,
				guesses_8,
				guesses_9,
				guesses_10,
				restarts,
			}),
			showCancelButton: false,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: t('pokedle.buttons.keep_winning'),
		});
	};

	return (
		<div className='bg-gray-200 min-h-screen pb-4 p-1 text-center text-black '>
			<h2 className='sm:text-3xl text-lg pt-20 -mb-3 sm:mb-0 font-pokemon text-slate-700 text-center'>
				Pokedle
			</h2>
			<div className='flex sm:flex-row flex-col justify-center items-center gap-4 sm:py-6 pt-14 pb-6'>
				<span className='sm:block hidden'>
					{t('pokedle.text.choose_pokemon')}:
				</span>
				<PokemonSearch
					onInputChange={handleInputChange}
					searchPokemon={comparePokemon}
					showSearchButton={false}
				/>
				<div className='flex justify-center gap-2 sm:gap-4 sm:w-auto w-[65vw] text-sm'>
					<button
						id='guess-button'
						className='bg-green-500 enabled:hover:bg-green-400 enabled:active:bg-green-300 enabled:active:scale-95 transition duration-150 rounded-lg py-4 sm:px-8 px-4 text-white font-bold disabled:opacity-40'
						onClick={() => {
							comparePokemon(inputValue);
							setInputValue('');
						}}
						disabled={guessButtonDisabled}>
						{t('pokedle.buttons.guess')}
					</button>
					<button
						className={`bg-red-500 enabled:active:bg-red-300 enabled:active:scale-95 transition duration-150 enabled:hover:bg-red-400 disabled:opacity-40 rounded-lg py-4 sm:px-8 px-4 text-white font-bold
							${guessButtonDisabled && 'sm:animate-bounce'}`}
						onClick={() => resetGame()}
						disabled={comparisons.length === 0}>
						{t('pokedle.buttons.restart')}
					</button>
				</div>
			</div>
			<div className='flex overflow-auto sm:pb-0 pb-4'>
				{comparisons.length !== 0 && (
					<div className='flex flex-col sm:gap-5 gap-1 sm:w-full'>
						<div className='flex justify-center w-full sm:gap-8 gap-2'>
							{attributes.map((attribute, index) => (
								<div
									key={index}
									className='bg-slate-900 rounded-lg sm:py-2 px-4 sm:w-1/12 w-24 flex items-center justify-center'>
									<p className='font-bold text-white text-sm'>{attribute}</p>
								</div>
							))}
						</div>

						{comparisons.map((result, index) => (
							<div
								className='flex justify-center w-full sm:gap-8 gap-2'
								key={index}>
								{Object.entries(result).map(([property, data]) => (
									<div
										className='sm:w-1/12 w-24 flex justify-center'
										key={property}>
										<div
											key={property}
											className={`sm:w-5/6 w-full h-20 border-2 border-slate-700 text-white flex justify-center items-center rounded-lg ${putDataStyle(
												data.class
											)} bg-contain bg-center bg-no-repeat`}
											style={
												data.img !== undefined
													? { backgroundImage: `url(${data.img})` }
													: {}
											}>
											{data.value}
										</div>
									</div>
								))}
							</div>
						))}
					</div>
				)}
			</div>
			<div
				ref={settingsRef}
				className={`${
					showSettings
						? 'scale-100 translate-y-0 translate-x-0'
						: 'scale-0 translate-y-full translate-x-40'
				} transition-all duration-150 transform fixed right-0 bottom-0 sm:m-3 bg-slate-700 h-auto sm:w-[20vw] w-full flex flex-col items-center sm:rounded-2xl text-white font-medium`}>
				<div className='w-full hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-slate-700 active:text-slate-700 sm:rounded-t-xl'>
					<Generations
						getGenerations={getGenerations}
						resetGame={reloadGame}
						padding={2}
					/>
				</div>

				<div
					className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-slate-700 active:text-slate-700'
					onClick={openPokedleTutorial}>
					{t('pokedle.settings.how_to_play')}
				</div>

				<div
					className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-slate-700 active:text-slate-700'
					onClick={openStats}>
					{t('pokedle.settings.stats')}
				</div>

				<div
					className='w-full py-2 bg-red-500 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-slate-700 active:text-slate-700 sm:rounded-b-xl'
					onClick={() => setShowSettings(false)}>
					{t('pokedle.settings.close')}
				</div>
			</div>

			<div
				className={`fixed right-0 bottom-0 m-4 w-10 cursor-pointer bg-slate-700 rounded-lg p-2 hover:bg-slate-600 active:scale-95  active:hover:bg-slate-500 transition-all ease-in-out duration-150 transform ${
					!showSettings ? 'scale-100' : 'scale-0'
				}`}
				onClick={handleShowSettings}>
				<Image
					src={settings}
					alt='settings'
				/>
			</div>
			<TutorialModal
				steps={tutorialSteps}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				localStorageKey='pokedle_tutorial'
			/>
		</div>
	);
};

export default Pokedle;
