'use client';
import { useEffect, useRef, useState } from 'react';
import { getPokemon } from '@/app/utils/services/pokemon';
import { typeLogos } from '@/app/Components/Type/TypeLogos';
import { generateRandomStrongPokemonNumber } from '@/app/utils/functions';
import settings from '@/../public/assets/settings.png';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
	getFromLocalStorage,
	saveToLocalStorage,
} from '@/app/utils/services/localStorage';
import Image from 'next/image';
import '@/app/Components/Type/type.css';

const BuildPokemon = () => {
	const MySwal = withReactContent(Swal);
	const [gameStarted, setGameStarted] = useState(false);
	const [gameEnded, setGameEnded] = useState(false);
	// const [currentGenerations, setCurrentGenerations] = useState([
	// 	true,
	// 	true,
	// 	true,
	// 	true,
	// 	true,
	// 	true,
	// 	true,
	// 	true,
	// ]);
	const [stats, setStats] = useState([
		{
			statName: 'hp',
			statLabel: 'Vida',
			pokemonAssigned: {},
		},
		{
			statName: 'attack',
			statLabel: 'Ataque',
			pokemonAssigned: {},
		},
		{
			statName: 'defense',
			statLabel: 'Defensa',
			pokemonAssigned: {},
		},
		{
			statName: 'special-attack',
			statLabel: 'Ataque Especial',
			pokemonAssigned: {},
		},
		{
			statName: 'special-defense',
			statLabel: 'Defensa Especial',
			pokemonAssigned: {},
		},
		{
			statName: 'speed',
			statLabel: 'Velocidad',
			pokemonAssigned: {},
		},
	]);
	const [offeredPokemon, setOfferedPokemon] = useState(null);
	const settingsRef = useRef(null);
	const [teamLength, setTeamLength] = useState(0);
	const [rerolls, setRerolls] = useState(3);
	const [loading, setLoading] = useState(false);
	const [showSettings, setShowSettings] = useState(false);

	const registerHighScore = (newScore) => {
		const highScores = getFromLocalStorage('buildpokemon_highscores') || [];

		highScores.push(newScore);

		highScores.sort((a, b) => b - a);

		const topFive = highScores.slice(0, 10);

		saveToLocalStorage('buildpokemon_highscores', topFive);
	};

	const startGame = async () => {
		setGameEnded(false);
		setRerolls(3);
		getNewpokemon();
		setGameStarted(true);
		setStats([
			{
				statName: 'hp',
				statLabel: 'Vida',
				pokemonAssigned: {},
			},
			{
				statName: 'attack',
				statLabel: 'Ataque',
				pokemonAssigned: {},
			},
			{
				statName: 'defense',
				statLabel: 'Defensa',
				pokemonAssigned: {},
			},
			{
				statName: 'special-attack',
				statLabel: 'Ataque Especial',
				pokemonAssigned: {},
			},
			{
				statName: 'special-defense',
				statLabel: 'Defensa Especial',
				pokemonAssigned: {},
			},
			{
				statName: 'speed',
				statLabel: 'Velocidad',
				pokemonAssigned: {},
			},
		]);
	};

	const getNewpokemon = async () => {
		setLoading(true);
		const newNumber = generateRandomStrongPokemonNumber();
		const newPokemon = await getPokemon(newNumber);
		setLoading(false);
		setOfferedPokemon(newPokemon);
	};

	const assignPokemon = (statLabel, pokemon) => {
		if (loading) {
			toast.warning('Por favor espera un segundo.');
			return;
		}

		const updatedStats = stats.map((stat) => {
			if (stat.statLabel === statLabel) {
				if (Object.keys(stat.pokemonAssigned).length !== 0) {
					toast.warning(
						`No se puede asignar un nuevo Pokémon a ${statLabel} porque ya tiene uno.`
					);
					return stat;
				} else {
					getNewpokemon();
					return { ...stat, pokemonAssigned: pokemon };
				}
			}
			return stat;
		});

		setStats(updatedStats);
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

	useEffect(() => {
		const assignedPokemonCount = stats.filter(
			(stat) => Object.keys(stat.pokemonAssigned).length !== 0
		).length;
		setTeamLength(assignedPokemonCount);
	}, [stats]);

	const getPokemonStats = (statsArray) => {
		const pokemonStats = [];

		statsArray.forEach((stat) => {
			const statName = stat.statLabel;
			const baseStat = stat.pokemonAssigned.stats.find(
				(pokemonStat) => pokemonStat.stat.name === stat.statName
			).base_stat;
			const pokemonName = stat.pokemonAssigned.name;

			pokemonStats.push({
				statName: statName,
				baseStat: baseStat,
				pokemonName: pokemonName,
			});
		});

		return pokemonStats;
	};

	const showPokemonStats = async (statsArray) => {
		const pokemonStats = getPokemonStats(statsArray);

		const totalPower = pokemonStats.reduce(
			(total, stat) => total + stat.baseStat,
			0
		);

		if (!gameEnded) {
			registerHighScore(totalPower);
		}

		const message = pokemonStats
			.map((stat) => {
				return `${stat.statName}: ${stat.baseStat} - ${stat.pokemonName}`;
			})
			.join('\n');

		const messageWithTotal = `${message}\n\nPODER TOTAL: ${totalPower}`;

		let result = await MySwal.fire({
			title: 'Estadísticas de los Pokémon asignados',
			html: `<pre>${messageWithTotal}</pre>`,
			icon: 'success',
			showCancelButton: true,
			confirmButtonText: 'Jugar de nuevo',
			cancelButtonText: 'Ver Tablero',
		});

		if (result.isConfirmed) {
			setGameStarted(false);
			return;
		}
		setGameEnded(true);
	};

	const showHighScores = () => {
		const highScores = getFromLocalStorage('buildpokemon_highscores') || [];

		let message = '';
		if (highScores.length > 0) {
			highScores.forEach((score, index) => {
				message += `<div>${index + 1}: <span class='font-semibold text-${
					index === 0
						? 'yellow-500'
						: index === 1
						? 'gray-400'
						: index === 2
						? 'orange-800'
						: 'black'
				}'>${score}</span></div>`;
			});
		} else {
			message =
				'No hay puntajes registrados aún. Juega alguna partida primero!';
		}

		MySwal.fire({
			title: 'Mejores puntajes',
			html: `<div class='flex flex-col gap-4'>${message}</div>`,
			confirmButtonText: 'Cerrar',
		});
	};

	const handleShowSettings = () => {
		setShowSettings((prev) => !prev);
	};

	const openBuildPokemonTutorial = () => {
		MySwal.fire({
			title: `¿Cómo se juega a <span class='text-blue-600'>Construye Un Pokemon</span>?`,
			html: `Al comenzar una partida te mostrará un Pokemon, el cual debes asignar a una estadística que elijas, en la que creas que este Pokemon es bueno. Por ejemplo, si te toca <span class='font-semibold text-purple-500'>Mewtwo</span>, lo mejor sería enviarlo a Ataque Especial (Si aun esta disponible).<br>
			Una vez que una estadística sea ocupada, no podrá volver a ser elegida, así que elige con cautela!<br>
			Al final, podrás ver el poder total del Pokemon que construiste. Si tiene 600 o más, es de poder <span class='font-semibold text-red-500'>Legendario</span>!!`,
			showCancelButton: true,
			confirmButtonColor: 'rgb(99 102 241)',
			cancelButtonColor: 'rgb(69 168 68)',
			confirmButtonText: 'Excelente!',
			cancelButtonText: 'Magnífico!',
		});
	};

	return (
		<div className='sm:h-screen min-h-screen bg-indigo-100 pt-14 px-1 text-black text-center'>
			{gameStarted ? (
				<div className='flex flex-col sm:flex-row justify-evenly items-center h-full '>
					{offeredPokemon !== null && teamLength !== 6 && (
						<div className='flex flex-col gap-6 h-full sm:w-auto w-full justify-center items-center'>
							{!loading ? (
								<div className='sm:h-[50vh] h-[30vh] flex sm:w-[20vw]'>
									<Image
										className='sm:max-h-[50vh] max-w-[200%] w-auto max-h-[30vh]'
										src={offeredPokemon.img}
										alt={offeredPokemon.name}
										width={1024}
										height={1024}
									/>
								</div>
							) : (
								<div className='flex justify-center items-center sm:h-full h-[30vh] w-full sm:w-[20vw]'>
									<div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900'></div>
								</div>
							)}
							{!loading && (
								<div className='w-full flex sm:flex-col sm:gap-4'>
									<span
										className={`${offeredPokemon.type_1.toLowerCase()} text-white font-semibold text-3xl sm:w-full w-full p-1 sm:rounded-lg sm:border-4 border-y-4 border-l-4 border-black/20 flex justify-center items-center truncate`}>
										{offeredPokemon.name}
									</span>
									<div className='flex justify-evenly'>
										<div
											className={`${offeredPokemon.type_1.toLowerCase()} h-14 sm:rounded-xl sm:px-4 sm:py-1 sm:border-4 border-y-4 border-l-4  border-black/20 ${
												offeredPokemon.type_2 === 'Ninguno' && 'border-r-4'
											} `}>
											<Image
												className='h-full w-auto'
												src={typeLogos[offeredPokemon.type_1.toLowerCase()]}
												alt=''
											/>
										</div>
										{offeredPokemon.type_2 !== 'Ninguno' && (
											<div
												className={`${offeredPokemon.type_2.toLowerCase()} h-14 sm:rounded-xl sm:px-4 sm:py-1 sm:border-4 border-y-4 border-r-4 border-black/20`}>
												<Image
													className='h-full w-auto'
													src={typeLogos[offeredPokemon.type_2.toLowerCase()]}
													alt=''
												/>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					)}

					<div className='flex flex-col sm:w-3/6 w-full items-center sm:gap-10 gap-4 '>
						{teamLength !== 6 ? (
							<button
								onClick={() => {
									getNewpokemon();
									setRerolls((prev) => prev - 1);
								}}
								disabled={rerolls === 0}
								className='bg-indigo-500 sm:p-4 p-2 sm:mt-0 mt-2 rounded-lg text-white font-semibold sm:w-5/12 w-full enabled:cursor-pointer cursor-not-allowed enabled:hover:bg-indigo-600 enabled:active:bg-indigo-700 enabled:active:scale-95 sm:shadow-lg shadow-indigo-500 transition enabled:opacity-100 opacity-60'>
								SALTAR POKEMON ({rerolls} REROLLS)
							</button>
						) : (
							<div className='w-full flex sm:flex-row flex-col items-center justify-around sm:gap-0 gap-3 sm:mt-0 mt-24'>
								<button
									onClick={() => showPokemonStats(stats)}
									className='bg-green-500 p-4 rounded-lg text-white font-semibold sm:w-5/12 w-full cursor-pointer hover:bg-green-600 active:bg-green-700 active:scale-95 sm:shadow-lg shadow-md shadow-black sm:shadow-green-500 hover:shadow-green-600 transition'>
									CALCULAR FUERZA
								</button>
								{gameEnded && (
									<button
										onClick={() => setGameStarted(false)}
										className='bg-indigo-500 p-4 rounded-lg text-white font-semibold sm:w-5/12 w-full cursor-pointer hover:bg-indigo-600 active:bg-indigo-700 active:scale-95 sm:shadow-lg shadow-md shadow-black sm:shadow-indigo-500 hover:shadow-indigo-600 transition'>
										REINICIAR
									</button>
								)}
							</div>
						)}
						<div className='grid grid-cols-2 sm:gap-4 gap-1 w-full'>
							{stats.map((stat, index) => (
								<div key={index}>
									<div className='bg-slate-500 sm:p-4 sm:rounded-t-lg text-white font-semibold'>
										{stat.statLabel}
									</div>
									<div className='relative sm:rounded-b-lg group'>
										<div
											onClick={() =>
												assignPokemon(stat.statLabel, offeredPokemon)
											}
											className={`${
												stat.pokemonAssigned.name === undefined &&
												'cursor-pointer'
											} w-full z-10 sm:rounded-b-lg p-2 font-semibold text-white relative overflow-x-auto whitespace-nowrap`}>
											{stat.pokemonAssigned.name !== undefined ? (
												stat.pokemonAssigned.name
											) : (
												<>
													Asignar
													<span className='hidden sm:inline'>
														{` a ${stat.statLabel.toUpperCase()}`}
													</span>
												</>
											)}
										</div>
										<div
											className={`${
												stat.pokemonAssigned.name === undefined &&
												'animate-pulse group-hover:animate-none group-hover:bg-blue-400 bg-green-600'
											}  ${
												stat.pokemonAssigned.type_1
													? stat.pokemonAssigned.type_1.toLowerCase()
													: ''
											}
											z-0 absolute  left-0 top-0 w-1/2 h-full sm:rounded-bl-lg `}></div>
										<div
											className={`${
												stat.pokemonAssigned.name === undefined &&
												'animate-pulse group-hover:animate-none group-hover:bg-blue-400 bg-green-600 '
											}  ${
												stat.pokemonAssigned.type_2 &&
												stat.pokemonAssigned.type_2 !== 'Ninguno'
													? stat.pokemonAssigned.type_2.toLowerCase()
													: stat.pokemonAssigned.type_1
													? stat.pokemonAssigned.type_1.toLowerCase()
													: ''
											}
											z-0 absolute right-0 top-0 w-1/2 h-full sm:rounded-br-lg `}></div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			) : (
				<div className='flex items-center justify-center sm:h-4/6 h-[80vh] '>
					<div
						className='bg-indigo-500 py-6 px-10 rounded-lg text-white font-bold cursor-pointer hover:bg-indigo-600 active:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-500'
						onClick={() => startGame()}>
						Comenzar Partida
					</div>
				</div>
			)}
			{showSettings && (
				<div
					ref={settingsRef}
					className='fixed sm:right-0 bottom-0 sm:m-3 bg-blue-500 h-auto sm:w-[20vw] w-full flex flex-col items-center sm:rounded-xl text-white font-medium'>
					<div
						className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 rounded-t-xl'
						onClick={() => {
							setShowSettings(false);
							openBuildPokemonTutorial();
						}}>
						¿Cómo se juega?
					</div>

					<div
						className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
						onClick={() => {
							setShowSettings(false);
							showHighScores();
						}}>
						Estadísticas
					</div>

					<div
						className='w-full py-2 bg-orange-400 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 sm:rounded-b-xl'
						onClick={() => setShowSettings(false)}>
						Cerrar
					</div>
				</div>
			)}
			{!showSettings && (
				<div
					className='w-10 cursor-pointer sm:bg-indigo-500 bg-slate-700 rounded-lg p-2 sm:hover:bg-indigo-400 active:scale-95 active:hover:bg-slate-500 sm:active:hover:bg-indigo-300 transition-all ease-in-out duration-150 fixed sm:right-4 sm:bottom-4 right-1 bottom-1'
					onClick={handleShowSettings}>
					<Image
						src={settings}
						alt='settings'
					/>
				</div>
			)}
		</div>
	);
};

export default BuildPokemon;
