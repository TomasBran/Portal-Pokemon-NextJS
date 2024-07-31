'use client';

import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'sonner';
import unknown_pokemon from '@/../public/assets/unresolved_pokemon.png';
import settings from '@/../public/assets/settings.png';
import PokemonSearch from '@/app/Components/PokemonSearch/PokemonSearch.js';
import Generations from '@/app/Components/Generations/Generations.js';
import { getPokemonMoveset } from '@/app/utils/services/movements';
import {
	getPokemonsGeneration,
	pokemonExists,
} from '@/app/utils/services/pokemon';
import {
	generateRandomPokemonNumber,
	capitalizeFirstLetter,
} from '@/app/utils/functions';
import {
	getFromLocalStorage,
	saveToLocalStorage,
} from '@/app/utils/services/localStorage';
import Image from 'next/image';
import TutorialModal from '@/app/Components/TutorialModal/TutorialModal';
import { useTranslation } from 'react-i18next';

const MoveSet = () => {
	const { t } = useTranslation();
	// ***IMPORTANTE*** DESHABILITAR CUANDO NO ESTE TESTEANDO //
	const testing = false; // PONER FALSE AL NO TESTEAR
	if (testing) console.log('EL MODO TESTING ESTA ON');
	// ***IMPORTANTE*** DESHABILITAR CUANDO NO ESTE TESTEANDO //

	const MySwal = withReactContent(Swal);
	const [originalPokemonMovements, setOriginalPokemonMovements] = useState([]);
	const [currentGenerations, setCurrentGenerations] = useState([
		true,
		true,
		true,
		true,
		true,
		true,
		true,
		true,
		true,
	]);
	const [movesShown, setMovesShown] = useState(0);
	const [inputValue, setInputValue] = useState('');
	const [guessedPokemons, setGuessedPokemons] = useState([]);
	const [showSettings, setShowSettings] = useState(false);
	const settingsRef = useRef(null);
	const [guessButtonDisabled, setGuessButtonDisabled] = useState(false);

	const tutorialModalOpened =
		getFromLocalStorage('moveset_tutorial') === 'true';
	const [isModalOpen, setIsModalOpen] = useState(!tutorialModalOpened);

	const tutorialSteps = [
		{
			image: '/assets/tutorial/moveset/tutorial_1.png',
			text: t('moveset.tutorial.1'),
		},
		{
			image: '/assets/tutorial/moveset/tutorial_2.png',
			text: t('moveset.tutorial.2'),
		},
		{
			image: '/assets/tutorial/moveset/tutorial_3.png',
			text: t('moveset.tutorial.3'),
		},
	];

	useEffect(() => {
		if (getFromLocalStorage('moveset_streak') === null) {
			saveToLocalStorage('moveset_streak', 0);
		}
		if (getFromLocalStorage('moveset_stats') === null) {
			saveToLocalStorage('moveset_stats', {
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

	const startNewGame = async () => {
		if (testing) {
			const newPokemon = await getPokemonMoveset('eevee');
			setOriginalPokemonMovements(newPokemon);
			return;
		}

		const newPokemon = await getPokemonMoveset(
			generateRandomPokemonNumber(currentGenerations)
		);
		setOriginalPokemonMovements(newPokemon);
	};

	const resetGame = async (shouldAsk) => {
		if (guessButtonDisabled) {
			reloadGame();
			return;
		}
		let result = false;
		if (shouldAsk) {
			result = await MySwal.fire({
				title: t('moveset.messages.restart.title'),
				text: t('moveset.messages.restart.text'),
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				cancelButtonText: t('moveset.buttons.cancel'),
				confirmButtonText: t('moveset.buttons.confirm'),
			});
			if (result.isConfirmed) {
				updateMovesetResetNumber();
				const pokemon = capitalizeFirstLetter(originalPokemonMovements[5]);
				await MySwal.fire({
					title: t('moveset.messages.restart.confirmed.title', { pokemon }),
					text: t('moveset.messages.restart.confirmed.text'),
					icon: 'error',
					showCancelButton: false,
					confirmButtonColor: '#3085d6',
					confirmButtonText: t('moveset.buttons.play_again'),
				});
			} else {
				return;
			}
		}

		reloadGame();
	};

	const reloadGame = () => {
		setMovesShown(0);
		setGuessButtonDisabled(false);
		setGuessedPokemons([]);
		startNewGame();
	};

	const getGenerations = (childGenerations) => {
		setCurrentGenerations(childGenerations);
	};

	const handleInputChange = (value) => {
		setInputValue(value);
	};

	const guess = async (pokemon) => {
		if (pokemon === '') {
			toast.error(t('pokemon_search.messages.empty'));
			return;
		}

		const doesPokemonExist = await pokemonExists(pokemon);
		if (!doesPokemonExist) {
			return;
		}
		setGuessedPokemons((prev) => [...prev, pokemon]);
		if (pokemon.toLowerCase() === originalPokemonMovements[5]) {
			const tries = guessedPokemons.length + 1;
			await MySwal.fire({
				title: t('moveset.messages.win.title', { pokemon }),
				text: `${
					guessedPokemons.length === 0
						? t('moveset.messages.win.text.one_try')
						: t('moveset.messages.win.text.more_tries', { tries })
				}`,
				icon: 'success',
				showCancelButton: true,
				confirmButtonColor: '#007bff',
				cancelButtonColor: '#787878',
				confirmButtonText: t('moveset.buttons.play_again'),
				cancelButtonText: t('moveset.buttons.see_board'),
			}).then((response) => {
				updateMovesetStats(guessedPokemons.length + 1);
				if (response.isConfirmed) {
					resetGame(false);
				} else {
					setGuessButtonDisabled(true);
				}
			});
			return;
		}
		movesShown <= 4 && setMovesShown((prev) => prev + 1);
	};

	useEffect(() => {}, [originalPokemonMovements]);

	useEffect(() => {
		startNewGame();
	}, []);

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

	const openMovesetTutorial = () => {
		setShowSettings(false);
		setIsModalOpen(true);
	};

	const updateMovesetResetNumber = () => {
		const movesetStats = getFromLocalStorage('moveset_stats') || {
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
		movesetStats.games_restarted++;
		saveToLocalStorage('moveset_stats', movesetStats);
	};

	const updateMovesetStats = (score) => {
		const movesetStats = getFromLocalStorage('moveset_stats') || {
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
		movesetStats.guesses[score]++;

		saveToLocalStorage('moveset_stats', movesetStats);
	};

	const openStats = () => {
		const movesetStats = getFromLocalStorage('moveset_stats');
		setShowSettings(false);

		const guesses_1 = movesetStats.guesses[1];
		const guesses_2 = movesetStats.guesses[2];
		const guesses_3 = movesetStats.guesses[3];
		const guesses_4 = movesetStats.guesses[4];
		const guesses_5 = movesetStats.guesses[5];
		const guesses_6 = movesetStats.guesses[6];
		const guesses_7 = movesetStats.guesses[7];
		const guesses_8 = movesetStats.guesses[8];
		const guesses_9 = movesetStats.guesses[9];
		const guesses_10 = movesetStats.guesses[10];
		const restarts = movesetStats.games_restarted;

		MySwal.fire({
			title: t('moveset.modals.stats.title'),
			html: t('moveset.modals.stats.text', {
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
			confirmButtonText: t('moveset.buttons.keep_winning'),
		});
	};

	return (
		<div className='sm:h-screen min-h-screen pt-14 p-1 sm:pt-0 bg-gray-200 w-full flex flex-col sm:items-center sm:justify-center text-center text-black'>
			<h2 className='sm:text-3xl text-lg sm:pt-20 sm:mb-0 font-pokemon text-slate-700 text-center'>
				{t('moveset.html.title')}
			</h2>
			<div className='w-full sm:h-9/12 h-full flex sm:flex-row flex-col justify-center gap-4 items-center'>
				<div className='sm:w-3/12 h-full flex flex-col justify-center items-center gap-4'>
					<div className='w-4/6 sm:block hidden '>
						<Image
							alt=''
							src={unknown_pokemon}
						/>
					</div>

					<PokemonSearch
						onInputChange={handleInputChange}
						showSearchButton={false}
						searchPokemon={guess}
					/>

					<div className='flex justify-center gap-4 text-white font-medium'>
						<button
							disabled={guessButtonDisabled}
							onClick={() => guess(inputValue)}
							className='rounded-lg disabled:opacity-40 bg-green-500 font-bold enabled:hover:bg-green-400 enabled:active:bg-green-300 enabled:cursor-pointer py-4 px-4 flex items-center justify-center'>
							{t('moveset.buttons.guess')}
						</button>
						<button
							className={`bg-red-500 hover:bg-red-400 active:bg-red-300 cursor-pointer py-4 px-4 rounded-lg flex items-center justify-center font-bold ${
								guessButtonDisabled && 'animate-bounce'
							}`}
							onClick={() => resetGame(true)}>
							{t('moveset.buttons.restart').toUpperCase()}
						</button>
					</div>
				</div>

				<div className='flex sm:flex-row flex-col-reverse sm:w-3/6 w-full sm:gap-16 gap-4'>
					<div className='sm:w-3/6 w-full sm:pb-0 pb-2 sm:h-[50vh] sm:max-h-[50vh] max-h-60 bg-white text-white sm:rounded-2xl border-2 border-gray-900 flex flex-col items-center overflow-y-auto'>
						<div className='text-gray-800 font-bold border-b-2 border-black sm:w-1/6 h-2/12 sm:fixed bg-white flex justify-center pt-2 items-center'>
							{t('moveset.html.tries')} ({guessedPokemons.length}):
						</div>
						<div className='flex flex-col-reverse items-center gap-1 sm:mt-10 mt-2'>
							{guessedPokemons.map((pokemon, index) => (
								<div key={index}>
									<span
										className={`${
											pokemon.toLowerCase() === originalPokemonMovements[5]
												? 'bg-green-500'
												: 'bg-red-500'
										} flex justify-center font-bold text-white border-2 rounded-xl px-6 py-1`}>
										{capitalizeFirstLetter(pokemon)}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className='sm:w-3/6 w-full h-full flex flex-col flex-wrap items-center justify-center sm:gap-10 gap-4'>
						<div className='bg-slate-700 rounded px-10 py-3 text-white font-medium'>
							{t('moveset.html.generation')}:{' '}
							{getPokemonsGeneration(originalPokemonMovements[6])}{' '}
						</div>
						<div className='flex flex-wrap w-full justify-center items-center sm:gap-3 gap-1 text-sm sm:text-base'>
							{originalPokemonMovements.slice(0, 4).map((movement, index) => (
								<div
									key={index}
									className={`p-4 rounded-xl capitalize text-white font-medium flex justify-center items-center sm:h-3/6 h-24 w-5/12 ${
										movesShown >= index ? 'bg-blue-400' : 'bg-slate-800'
									}`}>
									<span>
										{`${t('moveset.html.movement')} ${index + 1}:`}
										<br />
										{movesShown >= index ? movement : '???'}
									</span>
								</div>
							))}
						</div>
						<div
							className={`p-4 rounded-xl capitalize text-white font-medium flex justify-center items-center w-full ${
								movesShown >= 4 ? 'bg-blue-500' : 'bg-slate-800'
							}`}>{`${t('moveset.html.ability')}: ${
							movesShown >= 4 ? originalPokemonMovements[4] : '???'
						}`}</div>
					</div>
				</div>
			</div>

			<div
				ref={settingsRef}
				className={`${
					showSettings
						? 'scale-100 translate-y-0 translate-x-0'
						: 'scale-0 translate-y-full translate-x-40'
				} transition-all duration-150 transform fixed right-0 bottom-0 sm:m-4 bg-slate-700 h-auto sm:w-[20vw] w-full flex flex-col items-center sm:rounded-2xl text-white font-medium`}>
				<div className='w-full hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-slate-700 sm:rounded-t-xl'>
					<Generations
						getGenerations={getGenerations}
						resetGame={resetGame}
						padding={2}
					/>
				</div>

				<div
					className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-slate-700'
					onClick={openMovesetTutorial}>
					{t('moveset.settings.how_to_play')}
				</div>

				<div
					className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-slate-700'
					onClick={openStats}>
					{t('moveset.settings.stats')}
				</div>

				<div
					className='w-full py-2 bg-red-500 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-slate-700 sm:rounded-b-xl'
					onClick={() => setShowSettings(false)}>
					{t('moveset.settings.close')}
				</div>
			</div>

			<div
				className={`fixed right-0 bottom-0 m-4 w-10 cursor-pointer bg-slate-700 rounded-lg p-2 hover:bg-slate-600 active:scale-95  active:hover:bg-slate-500 transition-all ease-in-out duration-150 transform
					${!showSettings ? 'scale-100' : 'scale-0'}`}
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
				localStorageKey='moveset_tutorial'
			/>
		</div>
	);
};

export default MoveSet;
