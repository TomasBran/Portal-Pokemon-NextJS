'use client';

import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'sonner';
import unknown_pokemon from '@/../public/assets/unresolved_pokemon.png';
import settings from '@/../public/assets/settings.png';
import PokemonSearch from '@/app/Components/PokemonSearch/PokemonSearch.js';
import Generations from '@/app/Components/Generations/Generations.js';
import { getPokemonMovements } from '@/app/utils/services/movements';
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

const MoveSet = () => {
	// ***IMPORTANTE*** DESHABILITAR CUANDO NO ESTE TESTEANDO //
	const testing = true; // PONER FALSE AL NO TESTEAR
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
			const newPokemon = await getPokemonMovements('eevee');
			setOriginalPokemonMovements(newPokemon);
			return;
		}

		const newPokemon = await getPokemonMovements(
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
				title: '¿Querés reiniciar el juego?',
				text: 'Esto borrará la lista de pokemon, y elegirá uno nuevo.',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Reiniciar',
			});
			if (result.isConfirmed) {
				updateMovesetResetNumber();
				await MySwal.fire({
					title: `Estuviste cerca! El Pokemon era <span class='text-red-400'>${capitalizeFirstLetter(
						originalPokemonMovements[5]
					)}</span>.`,
					text: 'La próxima seguro lo adivinas!',
					icon: 'error',
					showCancelButton: false,
					confirmButtonColor: '#3085d6',
					confirmButtonText: ':(',
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
			toast.error(`El buscador está vacío.`);
			return;
		}

		const doesPokemonExist = await pokemonExists(pokemon);
		if (!doesPokemonExist) {
			return;
		}
		setGuessedPokemons((prev) => [...prev, pokemon]);
		if (pokemon.toLowerCase() === originalPokemonMovements[5]) {
			await MySwal.fire({
				title: `Felicitaciones! El Pokemon era ${pokemon}.`,
				text: `${
					guessedPokemons.length !== 0
						? `Adivinaste en ${guessedPokemons.length + 1} intentos`
						: 'Adivinaste con 1 solo movimiento? Quizá pueda aprender una cosa o dos al verte.'
				}`,
				icon: 'success',
				showCancelButton: true,
				confirmButtonColor: '#007bff',
				cancelButtonColor: '#787878',
				confirmButtonText: 'Jugar otra vez',
				cancelButtonText: 'Ver el tablero',
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
		MySwal.fire({
			title: '¿Cómo se juega?',
			html: `Debes adivinar el Pokemon escondido. Comienza eligiendo uno y continúa a partir de las pistas que éste te otorgue.<br>
			Las pistas serán 5, y se te otorgará una por cada intento. Las primeras 4 serán movimientos que el Pokemon oculto sea capaz de aprender por nivel, y la última pista será una de las habilidades que este Pokemon pueda tener (incluso habilidades ocultas).<br><br>
			<span class='font-bold text-green-500'>Dato</span>: Puedes cambiar las generaciones a las que gustes, para que el pokemon a adivinar pertenezca a esas generaciones.`,
			showCancelButton: false,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: '¡Estoy listo!',
		});
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

		MySwal.fire({
			title: 'Estadísticas de Move Set',
			html: `
					1 Intento: <span class='font-semibold text-blue-800'>${movesetStats.guesses[1]} </span><br>
					2 Intentos: <span class='font-semibold text-blue-800'>${movesetStats.guesses[2]} </span><br>
					3 Intentos: <span class='font-semibold text-blue-800'>${movesetStats.guesses[3]} </span><br>
					4 Intentos: <span class='font-semibold text-blue-800'>${movesetStats.guesses[4]} </span><br>
					5 Intentos: <span class='font-semibold text-blue-800'>${movesetStats.guesses[5]} </span><br>
					6 Intentos: <span class='font-semibold text-blue-800'>${movesetStats.guesses[6]} </span><br>
					7 Intentos: <span class='font-semibold text-blue-800'>${movesetStats.guesses[7]} </span><br>
					8 Intentos: <span class='font-semibold text-blue-800'>${movesetStats.guesses[8]} </span><br>
					9 Intentos: <span class='font-semibold text-blue-800'>${movesetStats.guesses[9]} </span><br>
					10+ Intentos: <span class='font-semibold text-blue-800'>${movesetStats.guesses[10]} </span><br>
			<br><br>
			<span class='font-bold'>Partidas reiniciadas: ${movesetStats.games_restarted} </span><br>
			`,
			showCancelButton: false,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: '¡A seguir ganando!',
		});
	};

	return (
		<div className='sm:h-screen min-h-screen pt-14 p-1 sm:pt-0 bg-indigo-100 w-full flex flex-col sm:items-center sm:justify-center text-center text-black'>
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
						searchPokemon={() => guess(inputValue)}
					/>

					<div className='flex justify-center gap-4 text-white font-medium'>
						<button
							disabled={guessButtonDisabled}
							onClick={() => guess(inputValue)}
							className='rounded-lg disabled:opacity-40 bg-indigo-500 font-bold enabled:hover:bg-indigo-400 enabled:active:bg-indigo-300 enabled:cursor-pointer py-4 px-4 flex items-center justify-center'>
							ADIVINAR
						</button>
						<button
							className='bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-300 cursor-pointer py-4 px-4 rounded-lg flex items-center justify-center font-bold'
							onClick={() => resetGame(true)}>
							REINICIAR
						</button>
					</div>
				</div>

				<div className='flex flex-col sm:flex-row flex-col-reverse sm:w-3/6 w-full sm:gap-16 gap-4'>
					<div className='sm:w-3/6 w-full sm:pb-0 pb-2 sm:h-[50vh] sm:max-h-[50vh] max-h-60 bg-white text-white sm:rounded-2xl border-2 border-gray-900 flex flex-col items-center overflow-y-auto'>
						<div className='text-gray-800 font-bold border-b-2 border-black sm:w-1/6 h-2/12 sm:fixed bg-white flex justify-center pt-2 items-center'>
							Intentos ({guessedPokemons.length}):
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
										{pokemon}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className='sm:w-3/6 w-full h-full flex flex-col flex-wrap items-center justify-center sm:gap-10 gap-4'>
						<div className='bg-stone-500 rounded px-10 py-3 text-white font-medium'>
							Generación: {getPokemonsGeneration(originalPokemonMovements[6])}{' '}
						</div>
						<div className='flex flex-wrap w-full justify-center items-center sm:gap-3 gap-1 text-sm sm:text-base'>
							{originalPokemonMovements.slice(0, 4).map((movement, index) => (
								<div
									key={index}
									className={`p-4 rounded-xl capitalize text-white font-medium flex justify-center items-center sm:h-3/6 h-24 w-5/12 ${
										movesShown >= index ? 'bg-blue-500' : 'bg-red-500'
									}`}>
									<span>
										{`Movimiento ${index + 1}:`}
										<br />
										{movesShown >= index ? movement : '???'}
									</span>
								</div>
							))}
						</div>
						<div
							className={`p-4 rounded-xl capitalize text-white font-medium flex justify-center items-center w-full ${
								movesShown >= 4 ? 'bg-blue-500' : 'bg-red-500'
							}`}>{`Habilidad: ${
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
				} transition-all duration-150 transform fixed right-0 bottom-0 sm:m-4 bg-blue-500 h-auto sm:w-[20vw] w-full flex flex-col items-center sm:rounded-xl text-white font-medium`}>
				<div className='w-full hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 sm:rounded-t-xl'>
					<Generations
						getGenerations={getGenerations}
						resetGame={resetGame}
						padding={2}
					/>
				</div>

				<div
					className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
					onClick={openMovesetTutorial}>
					¿Cómo se juega?
				</div>

				<div
					className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
					onClick={openStats}>
					Estadísticas
				</div>

				<div
					className='w-full py-2 bg-orange-400 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 sm:rounded-b-xl'
					onClick={() => setShowSettings(false)}>
					Cerrar
				</div>
			</div>

			<div
				className={`fixed right-0 bottom-0 m-4 w-10 cursor-pointer sm:bg-indigo-500 bg-gray-700 rounded-lg p-2 sm:hover:bg-indigo-400 active:scale-95 active:hover:bg-gray-500 sm:active:hover:bg-indigo-300 transition-all ease-in-out duration-150 transform
					${!showSettings ? 'scale-100' : 'scale-0'}`}
				onClick={handleShowSettings}>
				<Image
					src={settings}
					alt='settings'
				/>
			</div>
		</div>
	);
};

export default MoveSet;
