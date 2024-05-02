'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';
import settings from '@/../public/assets/settings.png';
import TeamContainer from '@/app/Components/TeamContainer/TeamContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { generateRandomPokemonNumber } from '@/app/utils/functions';
import { getPokemon } from '@/app/utils/services/pokemon';
import Generations from '@/app/Components/Generations/Generations.js';
import { ProgressSpinner } from 'primereact/progressspinner';
import pokeball from '@/../public/assets/pokeball.png';
import { toast } from 'sonner';

import {
	getFromLocalStorage,
	saveToLocalStorage,
} from '../../utils/services/localStorage.js';
import Synergies from '../../Components/Sinergies/Sinergies.js';
import Image from 'next/image';
import {
	getFromSessionStorage,
	saveToSessionStorage,
} from '@/app/utils/services/sessionStorage.js';

const PokeGym = () => {
	const testing = false; //CAMBIAR CUANDO ESTOY TESTEANDO

	if (getFromLocalStorage('gym_streak') === null) {
		saveToLocalStorage('gym_streak', 0);
	}
	if (getFromLocalStorage('gym_stats') === null) {
		saveToLocalStorage('gym_stats', {
			easymode_badges: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
			hardmode_badges: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
			games_restarted: 0,
		});
	}

	const MySwal = withReactContent(Swal);

	const [isLoading, setIsLoading] = useState(false);
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
	const [currentTeam, setCurrentTeam] = useState([]);
	const [chosenTeam, setChosenTeam] = useState([]);
	const [rerollsLeft, setRerollsLeft] = useState(testing ? 100 : 4);
	const [rollButtonText, setRollButtonText] = useState(
		`Generar ${6 - chosenTeam.length} pokemon (3 REROLLS)`
	);
	const [gameEnded, setGameEnded] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [hardmode, setHardmode] = useState(false);
	const [luckActive, setLuckActive] = useState(true);
	const settingsRef = useRef(null);
	const [synergiesActive, setSynergiesActive] = useState(true);
	const [synergyBonus, setSynergyBonus] = useState(null);

	const initialHasClickedSettings =
		getFromSessionStorage('hasClickedSettings') === 'true';
	const initialHasClickedSynergies =
		getFromSessionStorage('hasClickedSynergies') === 'true';
	const [hasClickedSettings, setHasClickedSettings] = useState(
		initialHasClickedSettings
	);
	const [hasClickedSynergies, setHasClickedSynergies] = useState(
		initialHasClickedSynergies
	);

	const [shouldDisable, setShouldDisable] = useState(false);

	const lockInPokemon = useCallback(
		(pokemon) => {
			if (pokemon.hasBeenChosen === true) {
				pokemon.hasBeenChosen = false;
				setChosenTeam((previousTeam) =>
					previousTeam.filter((poke) => poke.name !== pokemon.name)
				);
				return;
			}

			pokemon.hasBeenChosen = true;
			if (!chosenTeam.find((element) => element.name === pokemon.name)) {
				setChosenTeam((team) => [...team, pokemon]);
			}
		},
		[chosenTeam, setChosenTeam]
	);

	useEffect(() => {
		const handleKeyPress = (event) => {
			const key = event.key;

			switch (key) {
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
					if (currentTeam.length >= Number(key)) {
						lockInPokemon(currentTeam[Number(key) - 1]);
					}
					break;
				case 'r':
					if (rollButtonText !== 'Iniciar Juego') {
						resetGame(true);
					}
					break;
				case 'p':
					if (chosenTeam.length === 6) {
						fightGymLeaders();
					} else {
						toast.error(
							`Necesitas ${6 - chosenTeam.length} Pokemon más para poder pelear`
						);
					}
					break;

				default:
					break;
			}
		};

		document.addEventListener('keydown', handleKeyPress);

		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	}, [currentTeam, lockInPokemon, shouldDisable, rollButtonText]);

	const getGenerations = (childGenerations) => {
		setCurrentGenerations(childGenerations);
	};

	const updatePokemonTeam = async () => {
		setIsLoading(true);

		const gymButton = document.getElementById('fight-button');
		gymButton.disabled = true;
		const tempText = rollButtonText;

		setTimeout(() => {
			gymButton.textContent = 'Espera';
		}, 1);

		setCurrentTeam([]);
		setRerollsLeft((prev) => prev - 1);

		const imagesToLoad = 6 - chosenTeam.length;
		let currentGivenTeam = [];
		for (let index = 0; index < imagesToLoad; index++) {
			const randomNum = generateRandomPokemonNumber(
				currentGenerations,
				chosenTeam,
				currentGivenTeam
			);
			currentGivenTeam.push(randomNum);

			const newPokemon = await getPokemon(randomNum);

			setCurrentTeam((team) => [...team, newPokemon]);
		}

		setShouldDisable(true);
		setRollButtonText(tempText);
		setIsLoading(false);
	};

	useEffect(() => {
		handleButtonText();
	}, [chosenTeam, updatePokemonTeam, setShouldDisable]);

	useEffect(() => {
		setSynergiesActive(currentGenerations.every((element) => element === true));
	}, [currentGenerations]);

	const handleStars = (power) => {
		let stars, halfStars;

		if (power > 560) {
			stars = 3;
			halfStars = 0;
		} else if (power > 500) {
			stars = 2;
			halfStars = 1;
		} else if (power > 375) {
			stars = 2;
			halfStars = 0;
		} else if (power > 300) {
			stars = 1;
			halfStars = 1;
		} else if (power > 200) {
			stars = 1;
			halfStars = 0;
		} else {
			stars = 0;
			halfStars = 1;
		}

		const starsArray = Array.from({ length: 3 }, (_, index) => {
			if (index < stars) {
				return <BsStarFill key={index} />;
			} else if (index === stars && halfStars) {
				return <BsStarHalf key={index} />;
			} else {
				return <BsStar key={index} />;
			}
		});

		return <div className='flex gap-1 z-20'>{starsArray}</div>;
	};

	const handleButtonText = () => {
		if (rerollsLeft === 4 || rerollsLeft === 100) {
			setRollButtonText('Iniciar Juego');
			setShouldDisable(false);
			return;
		}
		if (rerollsLeft === 0) {
			setRollButtonText('NO QUEDAN REROLLS');
			setShouldDisable(true);
			return;
		}
		if (chosenTeam.length < 6) {
			setRollButtonText(
				`Generar ${6 - chosenTeam.length} pokemon (${rerollsLeft} ${
					rerollsLeft !== 1 ? 'RE-ROLLS' : 'RE-ROLL'
				})`
			);
			setShouldDisable(false);
		} else {
			setRollButtonText('EQUIPO COMPLETO');
			setShouldDisable(true);
		}
	};

	const getRandomArbitrary = (min, max) => {
		return Math.random() * (max - min) + min;
	};

	const fightGymLeaders = async () => {
		let synergyPower = synergiesActive ? synergyBonus * 75 : 0;
		let power = 0;
		let beatenGyms;
		let excessPower;
		let finalText = `Gimnasios vencidos: `;
		chosenTeam.forEach((element) => {
			power += element.power;
		});
		const minLuckValue = 97; // 0.97
		const maxLuckValue = 105; // 1.05
		const randomEnhancer = luckActive
			? getRandomArbitrary(minLuckValue / 100, maxLuckValue / 100)
			: 1;
		const bonusLuck = (randomEnhancer * 100).toFixed(0) - 100;

		power *= randomEnhancer;

		power += synergyPower;

		if (power >= 3200) {
			beatenGyms = 8;
			excessPower = Math.round((power - 3200).toFixed(0) / 9.5);
			finalText = `Felicitaciones! Conquistaste los <span style="color: green;">${beatenGyms}</span> gimnasios. Un maestro pokemon!\n- Te sobró un <span style="color: green;">${excessPower}%</span> de poder.`;
		} else if (power >= 3000) {
			beatenGyms = 6 + Math.floor((power - 3000) / 100);
			excessPower = (power - 3000) % 100; // MOSTRAR EL PROGRESO
			// excessPower = (power % 100 === 0) ? 0 : 100 - (power % 100); // MOSTRAR EL RESTANTE
			finalText += `<span style="color: green;">${beatenGyms}</span>. Impresionante!`;
		} else {
			beatenGyms = 1 + Math.floor((power - 2250) / 150);
			if (beatenGyms <= 0) {
				beatenGyms = 0;
			}
			finalText += `<span style="color: red;">${beatenGyms}.</span>`;
			excessPower = (((power - 2250) % 150) / 150) * 100; // MOSTRAR PROGRESO
			// excessPower = (((power-2250) % 150 === 0) ? 0 : 150 - ((power-2250) % 150))/150*100; // MOSTRAR RESTANTE

			if (beatenGyms >= 4) {
				finalText += ' Nada mal.';
			} else {
				finalText += ' Aun queda trabajo por hacer.';
			}
			if (beatenGyms === 0) {
				excessPower = ((2250 - power) / 2250) * 100;
				finalText += `\nTe faltó un <span style="color: blue;">~${excessPower.toFixed(
					0
				)}%</span> de progreso para conseguir la primera medalla.`;
			}
		}

		finalText += `${
			beatenGyms !== 8 && beatenGyms !== 0
				? `\n- Progreso hacia la ${
						beatenGyms + 1
				  }° medalla: <span style="color: blue;">~${excessPower.toFixed(
						0
				  )}%</span>.`
				: ''
		}
        ${
					luckActive
						? `- Bonus Suerte: <span style="color: ${
								bonusLuck === 0 ? 'blue' : bonusLuck >= 0 ? 'green' : 'red'
						  };">${bonusLuck}%</span>`
						: ''
				}`;

		let response = await MySwal.fire({
			title: `<span class='sm:text-lg text-sm'>${finalText}</span>`,
			text: `Tu equipo fue: ${chosenTeam
				.map(
					(pokemon) =>
						`${pokemon.name} ~${((pokemon.power / power) * 100).toFixed(0)}%`
				)
				.join(' | ')}`,
			icon: 'success',
			showCancelButton: true,
			confirmButtonColor: '#007bff',
			cancelButtonColor: '#787878',
			confirmButtonText: 'Jugar otra vez',
			cancelButtonText: 'Ver el tablero',
			width: '70vw',
		});
		updateGymStats(hardmode, beatenGyms);

		if (response.isConfirmed) {
			startNewGame();
			return;
		}
		setGameEnded(true);
	};

	const resetGame = async (shouldAsk) => {
		let result = false;
		if (shouldAsk && !testing && !gameEnded) {
			result = await MySwal.fire({
				title: 'Quieres reiniciar el juego?',
				text: 'Esto borrará todos los pokemon elegidos y ofrecidos',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: 'rgb(99 102 241)',
				cancelButtonColor: 'rgb(239 68 68)',
				cancelButtonText: 'Cancelar',
				confirmButtonText: 'Reiniciar',
			});
		}
		if (result.isConfirmed) {
			updateGymResetNumber();
		}

		if (result.isConfirmed || !shouldAsk || testing || gameEnded) {
			startNewGame();
		}
	};

	const startNewGame = () => {
		setGameEnded(false);
		setChosenTeam([]);
		setCurrentTeam([]);
		setRerollsLeft(testing ? 100 : 4);
		setRollButtonText('Iniciar Juego');
		setShouldDisable(false);
	};

	const updateGymResetNumber = () => {
		const gymStats = getFromLocalStorage('gym_stats') || {
			easymode_badges: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
			hardmode_badges: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
			games_restarted: 0,
		};

		gymStats.games_restarted++;

		saveToLocalStorage('gym_stats', gymStats);
	};

	const updateGymStats = (isHardmodeEnabled, badges) => {
		const gymStats = getFromLocalStorage('gym_stats') || {
			easymode_badges: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
			hardmode_badges: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
			games_restarted: 0,
		};

		const badgesMode = isHardmodeEnabled
			? gymStats.hardmode_badges
			: gymStats.easymode_badges;

		badgesMode[badges]++;

		saveToLocalStorage('gym_stats', gymStats);
	};

	const getSynergyNumber = (number) => {
		setSynergyBonus(number);
	};

	const handleHardMode = async () => {
		let result = await MySwal.fire({
			title: 'Quieres cambiar la dificultad?',
			text: 'En el modo difícil no se puede ver el poder de los Pokemon. Si comenzaste una partida, se reiniciará.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'rgb(99 102 241)',
			cancelButtonColor: 'rgb(239 68 68)',
			cancelButtonText: 'Cancelar',
			confirmButtonText: `${
				hardmode ? 'Cambiar a normal' : 'Cambiar a difícil'
			}`,
		});

		if (result.isConfirmed) {
			setHardmode((prev) => !prev);
			startNewGame();
			toast.warning(`Modo difícil ${!hardmode ? 'activado' : 'desactivado'}.`);
		}
	};

	const handleLuckActive = async () => {
		let result = await MySwal.fire({
			title: `Quieres ${luckActive ? 'desactivar' : 'activar'} la suerte?`,
			text: 'El factor suerte varía al azar entre -3% y +5%. Si comenzaste una partida, se reiniciará.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'rgb(99 102 241)',
			cancelButtonColor: 'rgb(239 68 68)',
			cancelButtonText: 'Cancelar',
			confirmButtonText: `${luckActive ? 'Desactivar' : 'Activar'}`,
		});

		if (result.isConfirmed) {
			setLuckActive((prev) => !prev);
			startNewGame();
			toast.warning(`Suerte ${!luckActive ? 'activada' : 'desactivada'}.`);
		}
	};

	const handleSynergiesActive = async () => {
		if (!currentGenerations.every((element) => element === true)) {
			toast.warning(`Habilita todas las generaciones para tener sinergias.`);
			return;
		}

		let result = await MySwal.fire({
			title: `Quieres ${
				synergiesActive ? 'desactivar' : 'activar'
			} las sinergias?`,
			text: 'Se recomienda dejar las sinergias activadas, representan efectos beneficiosos para el jugador, sin ninguna contra. Si comenzaste una partida, se reiniciará.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'rgb(99 102 241)',
			cancelButtonColor: 'rgb(239 68 68)',
			cancelButtonText: 'Cancelar',
			confirmButtonText: `${synergiesActive ? 'Desactivar' : 'Activar'}`,
		});

		if (result.isConfirmed) {
			setSynergiesActive((prev) => !prev);
			startNewGame();
			toast.warning(
				`Sinergias ${!synergiesActive ? 'activadas' : 'desactivadas'}.`
			);
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

	const openGymTutorial = () => {
		setShowSettings(false);
		MySwal.fire({
			title: '¿Cómo se juega?',
			html: `Paso 1: Dale a Iniciar juego.<br>
			Paso 2: Se te ofrecerán 6 Pokemon, puedes elegir la cantidad que quieras.<br>
			Paso 3: Si aun no completaste el equipo de 6, tendrás hasta 3 rerolls.<br>
			Paso 4: Pelea y gana las 8 medallas!!<br><br>
			Tip: Puedes activar/desactivar el modo difícil y la suerte en las opciones.`,
			showCancelButton: false,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: '¡Estoy listo!',
		});
	};

	const openFAQ = () => {
		setShowSettings(false);
		MySwal.fire({
			title: 'Preguntas Frecuentes',
			html: `<span class='font-bold sm:text-2xl text-lg'>¿Como se juega?</span><br>En las opciones está el tutorial.<br><br>
			<span class='font-bold sm:text-2xl text-lg'>¿Qué es el modo difícil?</span><br>En el modo difícil no se muestran las estrellas que indican el poder de un Pokemon. Se puede activar y desactivar en las opciones.<br><br>
			<span class='font-bold sm:text-2xl text-lg'>¿Cómo funciona la suerte?</span><br>La suerte es un factor al azar que potencia o desmejora tu puntaje final. Varía desde un -3% a un +5%, por lo que en promedio, te beneficiará. Se puede activar y desactivar en las opciones.<br><br>
			<span class='font-bold sm:text-2xl text-lg'>¿Cómo funcionan las sinergias?</span><br><br>Con algunas combinaciones de Pokemon, podes conseguir mas puntos que solamente con fuerza bruta. Para poder usarlas, las generaciones deben estar todas habilitadas. Para más información mirá la sección de <span class='font-bold'>Listado de Sinergias</span>
			`,
			showCancelButton: false,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: '¡Estoy listo!',
		});
	};

	const openSynergies = () => {
		setShowSettings(false);
		MySwal.fire({
			width: '90vw',
			title: 'Lista de Sinergias',
			html: `<span class='font-bold sm:text-2xl text-lg text-green-400'>Bonus de mismo tipo</span>
			<br> Se consigue cuando posees 3 pokemon que compartan 1 mismo tipo <br>

			<span class='font-bold sm:text-2xl text-lg text-green-400'>Bonus de misma generación</span>
			<br> Se consigue cuando posees 3 pokemon que pertenezcan a la misma generación <br>

			<span class='font-bold sm:text-2xl text-lg text-blue-400'>Bonus equipo sin Legendarios</span>
			<br> Se consigue cuando ningún pokemon en tu equipo es ni Legendario ni Singular <br>

			<span class='font-bold sm:text-2xl text-lg text-blue-400'>Bonus 1-Shot</span>
			<br> Se consigue solo cuando aún te quedan los 3 rerolls disponibles <br>

			<span class='font-bold sm:text-2xl text-lg text-blue-400'>Bonus desesperación</span>
			<br> Se consigue si al momento de utilizar el último reroll, aún te faltan 4 miembros del equipo <br>

			<span class='font-bold sm:text-2xl text-lg text-purple-400'>Trinidad Elemental</span>
			<br> Se consigue cuando posees los siguientes tipos en tu equipo: Fuego - Agua - Hoja. Tiene nivel 1, 2 y 3 <br>

			<span class='font-bold sm:text-2xl text-lg text-purple-400'>Mentalidad Marcial</span>
			<br> Se consigue cuando posees los siguientes tipos en tu equipo: Lucha - Psíquico - Siniestro. Tiene nivel 1, 2 y 3 <br>

			<span class='font-bold sm:text-2xl text-lg text-purple-400'>Fortaleza Helada</span>
			<br> Se consigue cuando posees los siguientes tipos en tu equipo: Tierra - Hielo - Acero. Tiene nivel 1, 2 y 3 <br>

			<span class='font-bold sm:text-2xl text-lg text-red-400'>Perfección Elemental</span>
			<br> Se consigue cuando posees 10 tipos distintos en tu equipo
			
			`,
			showCancelButton: false,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: '¡Estoy listo!',
		});
	};

	const openStats = () => {
		const gymStats = getFromLocalStorage('gym_stats');
		setShowSettings(false);
		MySwal.fire({
			title: 'Estadística de gimnasios derrotados',
			html: `
			<div class='flex w-full justify-evenly'>
				<div>
					<span class='font-bold'>Modo normal:</span>
					<br><br>
					0 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[0]} </span><br>
					1 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[1]} </span><br>
					2 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[2]} </span><br>
					3 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[3]} </span><br>
					4 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[4]} </span><br>
					5 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[5]} </span><br>
					6 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[6]} </span><br>
					7 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[7]} </span><br>
					8 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[8]} </span><br>
				</div>

				<div>
					<span class='font-bold'>Modo Difícil:</span>
					<br><br>
					0 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[0]} </span><br>
					1 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[1]} </span><br>
					2 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[2]} </span><br>
					3 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[3]} </span><br>
					4 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[4]} </span><br>
					5 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[5]} </span><br>
					6 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[6]} </span><br>
					7 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[7]} </span><br>
					8 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[8]} </span><br>
				</div>
			</div><br><br>
			<span class='font-bold'>Partidas reiniciadas: ${gymStats.games_restarted} </span>
			`,
			showCancelButton: false,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: '¡A seguir ganando!',
		});
	};

	const handleSettingsClick = () => {
		setHasClickedSettings(true);
		saveToSessionStorage('hasClickedSettings', 'true');
	};

	const handleSynergiesClick = () => {
		setHasClickedSynergies(true);
		saveToSessionStorage('hasClickedSynergies', 'true');
	};

	return (
		<div className='bg-indigo-100 pt-6 px-1 h-screen w-full flex flex-col sm:justify-center justify-start items-center text-center text-black'>
			<h2 className='sm:text-3xl text-lg sm:pt-10 pt-6 -mb-5 sm:mb-0 font-pokemon text-indigo-600 text-center'>
				Gimnasio Pokemon
			</h2>
			<div className='pt-7 sm:h-3/4 h-3/5 flex flex-wrap justify-center items-center w-full sm:gap-x-36'>
				{isLoading ? (
					<ProgressSpinner animationDuration='.5s' />
				) : (
					currentTeam.map((pokemon, index) => {
						return (
							<div
								style={{
									backgroundImage: `${
										window.innerWidth >= 450 && pokemon.hasBeenChosen
											? `url(${pokeball})`
											: ''
									}`,
								}}
								className={`sm:w-[14vw] sm:h-[14vw] w-[30vw] h-[30vw] relative ${
									window.innerWidth >= 450
										? pokemon.hasBeenChosen
											? `bg-cover bg-center`
											: 'bg-red-400/60'
										: pokemon.hasBeenChosen
										? 'bg-green-400/60'
										: 'bg-red-400/60'
								} m-1 sm:mx-10 ${
									!gameEnded && 'cursor-pointer'
								} flex flex-col items-center justify-center sm:gap-1 sm:p-5 sm:rounded-full rounded-lg`}
								key={index}
								onClick={() => !gameEnded && lockInPokemon(pokemon)}>
								<Image
									src={pokeball}
									alt='Pokeball'
									className={`absolute z-0 h-full sm:block hidden ${
										!pokemon.hasBeenChosen && 'sm:hidden'
									}`}
								/>
								<span className='font-bold text-sm text-ellipsis w-full px-1 z-10'>
									{pokemon.name}
								</span>

								<Image
									alt={pokemon.name}
									src={pokemon.img}
									className='sm:h-3/4 h-2/4 w-auto drop-shadow-2xl'
									height={1024}
									width={1024}
								/>

								{!hardmode && handleStars(pokemon.power)}
							</div>
						);
					})
				)}
			</div>

			<div className='flex sm:flex-row flex-col justify-center items-center w-full m-2'>
				<div className='sm:ml-2 sm:w-3/4 w-full sm:h-full h-20'>
					<TeamContainer team={chosenTeam} />
				</div>

				<div className='flex sm:flex-row flex-col justify-center sm:gap-4 gap-2 mt-2 w-full'>
					<button
						id='fight-button'
						className='bg-indigo-500 active:bg-indigo-300 text-white sm:my-6 p-3 sm:w-3/12 w-full sm:h-24 font-bold transition-all ease-in-out duration-150 sm:rounded-md enabled:hover:shadow-lg hover:bg-indigo-400 disabled:hover:bg-indigo-500 disabled:active:bg-indigo-500 enabled:active:scale-95 disabled:opacity-30'
						onClick={() => updatePokemonTeam()}
						disabled={shouldDisable || gameEnded}>
						{rollButtonText}
					</button>
					<button
						className='bg-indigo-500 active:bg-indigo-300 text-white sm:my-6 p-3 sm:w-3/12 w-full sm:h-24 font-bold transition-all ease-in-out duration-150 sm:rounded-md enabled:hover:shadow-lg hover:bg-indigo-400 disabled:hover:bg-indigo-500 disabled:active:bg-indigo-500 enabled:active:scale-95 disabled:opacity-30'
						disabled={chosenTeam.length !== 6 || gameEnded}
						onClick={fightGymLeaders}>
						<span className='text-red-500'>P</span>ELEAR{' '}
						{chosenTeam.length !== 6 ? `(Necesitas 6 Pokemon)` : ''}
					</button>
					<button
						className='bg-indigo-500 active:bg-indigo-300 text-white sm:my-6 p-3 sm:w-3/12 w-full sm:h-24 font-bold transition-all ease-in-out duration-150 sm:rounded-md enabled:hover:shadow-lg hover:bg-indigo-400 disabled:hover:bg-indigo-500 disabled:active:bg-indigo-500 enabled:active:scale-95 disabled:opacity-30'
						disabled={rollButtonText === 'Iniciar Juego'}
						onClick={() => resetGame(true)}>
						<span className='text-red-500'>R</span>EINICIAR JUEGO
					</button>
				</div>
				<div
					ref={settingsRef}
					className={`${
						showSettings
							? 'scale-100 translate-y-0 translate-x-0'
							: 'scale-0 translate-y-full translate-x-40'
					} transition-all duration-150 transform fixed sm:right-0 bottom-0 sm:m-3 bg-blue-500 h-auto sm:w-[20vw] w-full flex flex-col items-center sm:rounded-lg text-white font-medium z-50 `}>
					<div
						className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 sm:rounded-t-lg'
						onClick={handleHardMode}>
						Modo difícil: {hardmode ? 'ON' : 'OFF'}
					</div>

					<div
						className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
						onClick={handleLuckActive}>
						Suerte: {luckActive ? 'ON' : 'OFF'}
					</div>

					<div
						className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
						onClick={handleSynergiesActive}>
						Sinergias: {synergiesActive ? 'ON' : 'OFF'}
					</div>

					<div className='w-full hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'>
						<Generations
							getGenerations={getGenerations}
							resetGame={resetGame}
							padding={2}
						/>
					</div>
					<div
						className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
						onClick={openGymTutorial}>
						¿Cómo se juega?
					</div>
					<div
						className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
						onClick={openFAQ}>
						Preguntas Frecuentes
					</div>
					<div
						className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
						onClick={openSynergies}>
						Listado de Sinergias
					</div>
					<div
						className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
						onClick={openStats}>
						Estadísticas
					</div>
					<div
						className='w-full bg-orange-400 py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 sm:rounded-b-lg'
						onClick={() => setShowSettings(false)}>
						Cerrar
					</div>
				</div>

				<div
					className={`fixed right-4 bottom-4  ${
						!showSettings ? 'scale-100' : 'scale-0'
					} transition-all duration-150 transform`}>
					{!hasClickedSettings && (
						<div className='relative cursor-pointer flex h-3 w-3 top-2 left-8 pointer-events-none'>
							<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75' />
							<span className='relative inline-flex rounded-full h-3 w-3 bg-sky-500' />
						</div>
					)}
					<div
						className={`w-10 cursor-pointer bg-slate-700 active:bg-slate-600 sm:bg-indigo-500 rounded-lg p-2 hover:bg-indigo-400 active:scale-95 sm:active:bg-indigo-300 transition-all ease-in-out duration-150 `}
						onClick={() => {
							handleShowSettings();
							handleSettingsClick();
						}}>
						<Image
							src={settings}
							alt='settings'
						/>
					</div>
				</div>
			</div>
			<div
				className={`${
					!synergiesActive && 'hidden'
				} fixed right-0 bottom-0 mx-4 mb-16 z-30`}>
				{!hasClickedSynergies && (
					<div className='relative cursor-pointer flex h-3 w-3 top-2 left-8 pointer-events-none'>
						<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75'></span>
						<span className='relative inline-flex rounded-full h-3 w-3 bg-sky-500'></span>
					</div>
				)}
				<div
					className='rounded-lg'
					onClick={handleSynergiesClick}>
					<Synergies
						team={chosenTeam}
						rerollsLeft={rerollsLeft}
						allGenerations={currentGenerations.every((value) => value === true)}
						onSynergiesCalculate={getSynergyNumber}
					/>
				</div>
			</div>
		</div>
	);
};

export default PokeGym;
