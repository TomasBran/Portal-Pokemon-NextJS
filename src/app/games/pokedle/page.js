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

const attributes = [
	'Foto',
	'Nombre',
	'Generación',
	'Tipo 1',
	'Tipo 2',
	'Fuerza',
	'Peso (kg)',
	'Altura (mts)',
];

const Pokedle = () => {
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

	useEffect(() => {
		startNewGame();
	}, []);

	const startNewGame = async () => {
		const newPokemon = await getPokemon(
			generateRandomPokemonNumber(currentGenerations)
		);
		setOriginalPokemon(newPokemon);
	};

	const comparePokemon = async (originalPokemon) => {
		const newChosenPokemon = await getPokemon(inputValue.toLowerCase());

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
			const response = await MySwal.fire({
				title: `Felicitaciones! El Pokemon era <span class="text-green-500 font-bold">${originalPokemon.name.replace(
					/-/g,
					' '
				)}</span>.`,
				text: `${
					comparisons.length !== 0
						? `Adivinaste en ${comparisons.length + 1} intentos`
						: 'Adivinaste a la primera. Wow.'
				}`,
				icon: 'success',
				showCancelButton: true,
				confirmButtonColor: 'green',
				confirmButtonText: 'Jugar otra vez',
				cancelButtonText: 'Ver el tablero',
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
			title: `Seguro que quieres reiniciar la partida?.`,
			text: `Esto borrará tu progreso e iniciará una nueva partida`,
			icon: 'warning',
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			confirmButtonText: 'Confirmar',
			confirmButtonColor: 'rgb(99 102 241)',
			cancelButtonColor: 'rgb(239 68 68)',
		});
		if (response.isConfirmed) {
			await MySwal.fire({
				title: `La partida ha finalizado.`,
				html: `No has adivinado. El Pokémon era <span class="text-red-500 font-bold">${originalPokemon.name.replace(
					/-/g,
					' '
				)}</span>`,
				icon: 'error',
				showCancelButton: false,
				confirmButtonText: 'Confirmar',
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
				return 'bg-green-500';
			case 'wrong-guess':
				return 'bg-red-500';

			case 'partial-correct-guess':
				return 'bg-yellow-500';

			default:
				return 'bg-indigo-500';
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
		MySwal.fire({
			title: '¿Cómo se juega?',
			html: `Debes adivinar el Pokemon escondido. Comienza eligiendo uno y continúa a partir de las pistas que éste te otorgue.<br>
			Por ejemplo, si el pokemon que tocó es <span class='font-bold text-gray-500'>Magnemite</span>, y yo elegí a <span class='font-bold text-yellow-500'>Pikachu</span>, me dirá que coinciden en su primer tipo (<span class='font-bold text-yellow-500'>Eléctrico</span>), pero no coincidirán en el segundo, ya que <span class='font-bold text-yellow-500'>Pikachu</span> es monotipo y <span class='font-bold text-gray-500'>Magnemite</span> es tipo <span class='font-bold text-yellow-500'>Eléctrico</span>/<span class='font-bold text-gray-500'>Acero</span>. También me comparará el resto de los datos.<br><br>
			<span class='font-bold text-green-500'>Dato</span>: En la generación, fuerza, peso y altura habrá una flecha hacia arriba/abajo que indica si el número del Pokemon objetivo es mayor o menor en caso de no coincidir.
			.`,
			showCancelButton: false,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: '¡Estoy listo!',
		});
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

		MySwal.fire({
			title: 'Estadísticas de Pokedle',
			html: `
					1 Intento: <span class='font-semibold text-blue-800'>${pokedleStats.guesses[1]} </span><br>
					2 Intentos: <span class='font-semibold text-blue-800'>${pokedleStats.guesses[2]} </span><br>
					3 Intentos: <span class='font-semibold text-blue-800'>${pokedleStats.guesses[3]} </span><br>
					4 Intentos: <span class='font-semibold text-blue-800'>${pokedleStats.guesses[4]} </span><br>
					5 Intentos: <span class='font-semibold text-blue-800'>${pokedleStats.guesses[5]} </span><br>
					6 Intentos: <span class='font-semibold text-blue-800'>${pokedleStats.guesses[6]} </span><br>
					7 Intentos: <span class='font-semibold text-blue-800'>${pokedleStats.guesses[7]} </span><br>
					8 Intentos: <span class='font-semibold text-blue-800'>${pokedleStats.guesses[8]} </span><br>
					9 Intentos: <span class='font-semibold text-blue-800'>${pokedleStats.guesses[9]} </span><br>
					10+ Intentos: <span class='font-semibold text-blue-800'>${pokedleStats.guesses[10]} </span><br>
			<br><br>
			<span class='font-bold'>Partidas reiniciadas: ${pokedleStats.games_restarted} </span><br>
			`,
			showCancelButton: false,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: '¡A seguir ganando!',
		});
	};

	return (
		<div className='bg-indigo-100 min-h-screen pb-4 p-1 text-center text-black'>
			<div className='flex sm:flex-row flex-col justify-center items-center gap-4 sm:py-20 pt-14 pb-6'>
				<span className='sm:block hidden'>Elige un Pokemon:</span>
				<PokemonSearch
					onInputChange={handleInputChange}
					searchPokemon={() => comparePokemon(originalPokemon)}
					showSearchButton={false}
				/>
				<div className='flex justify-center gap-2 sm:gap-4 sm:w-auto w-[65vw] text-sm'>
					<button
						id='guess-button'
						className='bg-indigo-500 enabled:hover:bg-indigo-400 enabled:active:bg-indigo-300 enabled:active:scale-95 transition duration-150 rounded-lg py-4 sm:px-8 px-4 text-white font-bold disabled:opacity-40'
						onClick={() => {
							comparePokemon(originalPokemon);
							setInputValue('');
						}}
						disabled={guessButtonDisabled}>
						ADIVINAR
					</button>
					<button
						className={`bg-indigo-500 enabled:active:bg-blue-300 enabled:active:scale-95 transition duration-150 enabled:hover:bg-blue-400 disabled:opacity-40 rounded-lg py-4 sm:px-8 px-4 text-white font-bold`}
						onClick={() => resetGame()}
						disabled={comparisons.length === 0}>
						REINICIAR
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
									className='bg-blue-700 rounded-lg sm:py-2 px-4 sm:w-1/12 w-24 flex items-center justify-center'>
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
											className={`sm:w-5/6 w-full h-20 border-2 border-white text-white flex justify-center items-center rounded-lg ${putDataStyle(
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
				} transition-all duration-150 transform fixed right-0 bottom-0 sm:m-3 bg-blue-500 h-auto sm:w-[20vw] w-full flex flex-col items-center sm:rounded-xl text-white font-medium`}>
				<div className='w-full hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 sm:rounded-t-xl'>
					<Generations
						getGenerations={getGenerations}
						resetGame={reloadGame}
						padding={2}
					/>
				</div>

				<div
					className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
					onClick={openPokedleTutorial}>
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
				className={`fixed right-0 bottom-0 m-4 w-10 cursor-pointer sm:bg-indigo-500 bg-gray-700 rounded-lg p-2 sm:hover:bg-indigo-400 active:scale-95 active:hover:bg-gray-500 sm:active:hover:bg-indigo-300 transition-all ease-in-out duration-150 transform ${
					!showSettings ? 'scale-100' : 'scale-0'
				}`}
				onClick={handleShowSettings}>
				<Image
					src={settings}
					alt='settings'
				/>
			</div>
		</div>
	);
};

export default Pokedle;
