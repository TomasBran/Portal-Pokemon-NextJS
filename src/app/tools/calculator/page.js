'use client';
import { useState, useEffect, React, useRef } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'sonner';
import { ProgressSpinner } from 'primereact/progressspinner';
import '@/app/Components/Type/type.css';
import { useSelection } from '@/app/utils/context/SelectionContext';
import { getPokemon } from '@/app/utils/services/pokemon';
import PokemonSearch from '@/app/Components/PokemonSearch/PokemonSearch.js';
import { typeLogos } from '@/app/Components/Type/TypeLogos';
import { pokemonTypesArray } from '@/app/Components/Type/TypeArray';
import Type from '@/app/Components/Type/Type';
import pokedex from '@/../public/assets/pokedex.webp';
import settings from '@/../public/assets/settings.png';

const Calculator = () => {
	const [loading, setLoading] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [isVisible, setIsVisible] = useState(false);
	const [currentPokemonImage, setCurrentPokemonImage] = useState();
	const [currentPokemonName, setCurrentPokemonName] = useState('');
	const [currentPokemonId, setCurrentPokemonId] = useState('');
	const [showSettings, setShowSettings] = useState(false);
	const settingsRef = useRef(null);
	const [showIcons, setShowIcons] = useState(false);
	const [gimmickForms, setGimmickForms] = useState(false);
	const [types_x4, setTypes_x4] = useState([]);
	const [types_x2, setTypes_x2] = useState([]);
	const [types_x1, setTypes_x1] = useState([]);
	const [types_x05, setTypes_x05] = useState([]);
	const [types_x025, setTypes_x025] = useState([]);
	const [types_x0, setTypes_x0] = useState([]);

	const MySwal = withReactContent(Swal);

	const {
		currentFirstSelection,
		currentSecondSelection,
		setSelection,
		deleteSelection,
		setBothTypes,
		deleteBothTypes,
	} = useSelection();

	useEffect(() => {
		deleteSelection();
		deleteBothTypes();
	}, []);

	const handleInputChange = (value) => {
		setInputValue(value);
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

	const handleClick = (type) => {
		if (type === currentFirstSelection || type === currentSecondSelection) {
			type === currentFirstSelection ? deleteSelection(1) : deleteSelection(2);
			resetTypes();
			setIsVisible(false);
		} else {
			let shouldReset = true;
			currentSecondSelection === ''
				? setSelection(type)
				: currentFirstSelection === ''
				? setSelection(type)
				: (shouldReset = false);

			if (shouldReset) {
				resetTypes();
				setIsVisible(false);
			} else {
				toast.error(`Ya estás utilizando 2 tipos. Elimina uno primero`);
			}
		}
	};

	const resetTypes = () => {
		setTypes_x4([]);
		setTypes_x2([]);
		setTypes_x1([]);
		setTypes_x05([]);
		setTypes_x025([]);
		setTypes_x0([]);
	};

	const HandleEffectiveness = (currentType1, currentType2) => {
		pokemonTypesArray.forEach((type) => {
			let efectiveness = 1;
			type.isEffectiveAgainst.includes(currentType1) && (efectiveness *= 2);
			type.isEffectiveAgainst.includes(currentType2) && (efectiveness *= 2);
			type.isNotEffectiveAgainst.includes(currentType1) && (efectiveness /= 2);
			type.isNotEffectiveAgainst.includes(currentType2) && (efectiveness /= 2);
			type.isImmuneAgainstMyAttacks.includes(currentType1) &&
				(efectiveness *= 0);
			type.isImmuneAgainstMyAttacks.includes(currentType2) &&
				(efectiveness *= 0);

			efectiveness === 4 && setTypes_x4((prev) => [...prev, type.name]);
			efectiveness === 2 && setTypes_x2((prev) => [...prev, type.name]);
			efectiveness === 1 && setTypes_x1((prev) => [...prev, type.name]);

			if (currentType1 === '' && currentType2 === '') {
				setTypes_x1([]);
			}

			efectiveness === 0.5 && setTypes_x05((prev) => [...prev, type.name]);
			efectiveness === 0.25 && setTypes_x025((prev) => [...prev, type.name]);
			efectiveness === 0 && setTypes_x0((prev) => [...prev, type.name]);
		});
	};

	useEffect(() => {
		HandleEffectiveness(currentFirstSelection, currentSecondSelection);
	}, [currentFirstSelection, currentSecondSelection]);

	const searchPokemon = async (selectedPokemon) => {
		setLoading(true);

		try {
			const searchedPokemon = await getPokemon(selectedPokemon);

			searchedPokemon.type_1 = searchedPokemon.type_1.toLowerCase();
			searchedPokemon.type_2 = searchedPokemon.type_2.toLowerCase();

			renderPokemon(
				searchedPokemon.img,
				searchedPokemon.name,
				searchedPokemon.id
			);
			deleteBothTypes();
			if (searchedPokemon.type_2 !== 'ninguno') {
				(searchedPokemon.type_1 !== currentFirstSelection ||
					searchedPokemon.type_2 !== currentSecondSelection) &&
					resetTypes();
				setBothTypes(searchedPokemon.type_1, searchedPokemon.type_2);
			} else {
				resetTypes();
				setSelection(searchedPokemon.type_1);
			}
		} catch (error) {
			setLoading(false);
			setIsVisible(false);
			deleteBothTypes();
			resetTypes();
			console.log(error);
		}
	};

	const renderPokemon = (url, name, id) => {
		setCurrentPokemonImage(url);
		setCurrentPokemonName(name);
		setCurrentPokemonId(id);
		setIsVisible(true);
		setLoading(false);
	};

	function isArrayEmpty(array) {
		return array.length === 0;
	}

	const pickRandomType = () => {
		const randomIndex = Math.floor(Math.random() * pokemonTypesArray.length);
		const randomPokemonType = pokemonTypesArray[randomIndex];
		setSelection(randomPokemonType.name);
	};

	const pickTwoRandomTypes = () => {
		let randomIndex = Math.floor(Math.random() * pokemonTypesArray.length);
		let randomPokemonType = pokemonTypesArray[randomIndex];

		let randomIndex2;
		let randomPokemonType2;

		do {
			randomIndex2 = Math.floor(Math.random() * pokemonTypesArray.length);
			randomPokemonType2 = pokemonTypesArray[randomIndex2];
		} while (randomPokemonType2.name === randomPokemonType.name);

		setBothTypes(randomPokemonType.name, randomPokemonType2.name);
	};

	const openCalculatorTutorial = () => {
		MySwal.fire({
			title: '¿Cómo funciona la Calculadora Pokemon?',
			html: `Debes elegir uno o dos tipos para que te muestre sus puntos débiles, inmunidades, o fortalezas frente a otros ataques.<br>
			Existe la opción de dejar que se elija al azar, o buscar al Pokemon en cuestión en la Pokedex en caso de que no sepas sus tipos!<br><br>
			Formas Gimmick: Son las formas especiales de los Pokemon (por ej. Mega evoluciones). Se puede elegir verlas o no en la Pokedex.`,
			showCancelButton: true,
			confirmButtonColor: 'rgb(99 102 241)',
			cancelButtonColor: 'rgb(69 168 68)',
			confirmButtonText: 'Excelente!',
			cancelButtonText: 'Magnífico!',
		});
	};

	const handleShowIcons = () => {
		setShowIcons((prev) => !prev);
	};

	const handleShowGimmickForms = () => {
		setGimmickForms((prev) => !prev);
	};

	return (
		<div className='min-h-screen sm:bg-teal-200 bg-teal-200/80 sm:pt-16 pt-12 p-1 sm:p-0 flex flex-col items-center w-screen text-black text-center'>
			<h2
				className={`${
					currentFirstSelection === '' && currentSecondSelection === ''
						? 'sm:block'
						: 'sm:hidden'
				} sm:text-3xl text-lg sm:py-2 font-pokemon text-teal-600 text-center`}>
				Calculadora
			</h2>
			<div className='flex justify-start flex-col items-center w-full h-full '>
				<div className='flex justify-center sm:gap-14 gap-2 w-full sm:h-60 h-full sm:flex-row flex-col flex-col-reverse'>
					<div className='flex justify-center items-center sm:w-6/12 w-full h-full flex-wrap gap-3 p-2 bg-teal-700 sm:rounded-lg overflow-auto'>
						{pokemonTypesArray.map((type) => (
							<button
								onClick={() => handleClick(type.name)}
								className={`${type.name} pr-3 pl-1 py-2 text-white font-bold text-md rounded-lg shadow hover:shadow-black/80 active:scale-95 transition duration-150 capitalize max-w-2/12 flex justify-center items-center gap-1 sm:h-auto h-[6vh] `}
								key={type.name}>
								<Image
									src={typeLogos[type.name.toLowerCase()]}
									alt={`${type.name} Logo`}
									className='sm:h-[3.5vh] w-auto h-full '
								/>
								<span>{type.name}</span>
							</button>
						))}
					</div>

					<div
						className={`overflow-auto sm:w-5/12 w-full h-full px-6 py-3 sm:rounded-lg ${
							isVisible
								? currentFirstSelection !== ''
									? currentFirstSelection
									: currentSecondSelection
								: 'bg-teal-700'
						} ${
							currentFirstSelection === '' &&
							currentSecondSelection === '' &&
							'bg-teal-700'
						}`}>
						<div className='flex gap-2 justify-between w-full mb-2'>
							<Image
								alt='pokedex'
								src={pokedex}
								className='relative h-14 w-auto sm:flex hidden'
							/>
							<PokemonSearch
								onInputChange={handleInputChange}
								searchPokemon={() => searchPokemon(inputValue)}
								gimmickForms={gimmickForms}
							/>
						</div>

						{loading ? (
							<ProgressSpinner />
						) : (
							<div
								className={`items-center justify-evenly sm:flex-row flex-col ${
									isVisible ? 'flex' : 'hidden'
								}`}>
								<div className='flex sm:flex-col flex-row sm:gap-0 gap-4 items-center sm:mb-0 mb-4'>
									<span className='text-base sm:text-3xl text-gray-800 bg-white rounded-lg outline outline-3 outline-white/50 min-w-10/12 p-2 capitalize truncate'>
										{currentPokemonId < 1026 && `#${currentPokemonId} - `}{' '}
										{currentPokemonName.replace(/-/g, ' ')}
									</span>
									<div className='flex gap-2 py-2 '>
										<div
											className={`${
												currentFirstSelection !== ''
													? currentFirstSelection
													: 'hidden'
											} p-2 border-2 border-white sm:rounded-2xl rounded-full `}>
											<Image
												className={`sm:h-[7vh] w-auto h-[4vh] `}
												src={typeLogos[currentFirstSelection]}
												alt={`${currentFirstSelection} logo`}
											/>
										</div>

										<div
											className={`${
												currentSecondSelection !== ''
													? currentSecondSelection
													: 'hidden'
											} p-2 border-2 sm:rounded-2xl rounded-full `}>
											<Image
												className={`sm:h-[7vh] w-auto h-[4vh] `}
												src={typeLogos[currentSecondSelection]}
												alt={`${currentSecondSelection} logo`}
											/>
										</div>
									</div>
								</div>
								<Image
									alt={currentPokemonName}
									src={currentPokemonImage}
									className='h-36 w-auto'
									width={1024}
									height={1024}
									loading='lazy'
								/>
							</div>
						)}
					</div>
				</div>
				<div className='bg-teal-700/80 sm:py-8 py-3 px-2 m-4 sm:rounded-2xl xl:w-4/12 lg:w-5/12 sm:w-7/12 w-full sm:h-2'>
					{currentFirstSelection || currentSecondSelection ? (
						<div className='sm:flex-row flex-col flex sm:px-4 justify-between items-center w-full h-full'>
							<p className='text-xl text-white font-semibold'>Seleccionados:</p>
							<div className='flex justify-evenly sm:w-8/12 w-full gap-4'>
								<button
									className={` ${
										currentFirstSelection !== ''
											? `${currentFirstSelection} px-4 py-2 my-1 text-white font-bold text-sm rounded-lg shadow hover:shadow-black/80 capitalize sm:w-[7vw] w-4/6 justify-center items-center flex cursor-pointer hover:bg-red-500 active:scale-95 transition duration-150`
											: 'hidden'
									}`}
									onClick={() => handleClick(currentFirstSelection)}>
									<span>{currentFirstSelection}</span>
								</button>
								<button
									className={
										currentSecondSelection !== ''
											? `${currentSecondSelection} px-4 py-2 my-1 text-white font-bold text-sm rounded-lg shadow hover:shadow-black/80 capitalize sm:w-[7vw] w-4/6 justify-center items-center flex cursor-pointer hover:bg-red-500 active:scale-95 transition duration-150`
											: 'hidden'
									}
									onClick={() => handleClick(currentSecondSelection)}>
									<span>{currentSecondSelection}</span>
								</button>
							</div>
						</div>
					) : (
						<div className='flex sm:flex-row flex-col gap-2 justify-evenly items-center w-full h-full'>
							<p className='xl:text-lg text-sm text-white font-bold'>
								Selecciona un tipo, o random
							</p>
							<p
								className='text-white font-semibold bg-teal-500 cursor-pointer p-2 rounded-lg hover:bg-teal-400 active:bg-teal-300 active:scale-90 transition truncate sm:text-base text-sm sm:w-auto w-4/6'
								onClick={pickRandomType}>
								1 Random
							</p>
							<p
								className='text-white font-semibold bg-teal-500 cursor-pointer p-2 rounded-lg hover:bg-teal-400 active:bg-teal-300 active:scale-90 transition truncate sm:text-base text-sm sm:w-auto w-4/6'
								onClick={pickTwoRandomTypes}>
								2 Random
							</p>
						</div>
					)}
				</div>

				<div
					className={`flex sm:flex-row flex-col w-full justify-evenly sm:gap-4 sm:divide-y-0 divide-y-2 ${
						currentFirstSelection === '' && currentSecondSelection === ''
							? 'hidden'
							: ''
					}`}>
					<div
						className={`bg-teal-500 sm:min-h-[43vh] sm:w-[23vw] w-full sm:rounded-lg sm:p-4 p-2 sm:p-4 p-2 ${
							isArrayEmpty(types_x4) && isArrayEmpty(types_x2) ? 'hidden' : ''
						}`}>
						<p>Efectivo:</p>
						<div className={`${isArrayEmpty(types_x4) ? 'hidden' : ''}`}>
							<p className='my-3'>x4:</p>
							<div className='flex justify-center flex-wrap gap-4'>
								{types_x4.map((type, index) => (
									<Type
										key={index}
										type={type}
										showIcon={showIcons}
									/>
								))}
							</div>
						</div>
						<div className={`${isArrayEmpty(types_x2) ? 'hidden' : ''}`}>
							<p className='my-3'>x2:</p>
							<div className='flex justify-center flex-wrap gap-4'>
								{types_x2.map((type, index) => (
									<Type
										key={index}
										type={type}
										showIcon={showIcons}
									/>
								))}
							</div>
						</div>
					</div>
					<div
						className={`bg-teal-500 sm:min-h-[43vh] sm:w-[23vw] w-full sm:rounded-lg sm:p-4 p-2  ${
							isArrayEmpty(types_x1) ? 'hidden' : ''
						}`}>
						<p>Neutral:</p>
						<p className='my-3'>x1:</p>
						<div className='flex justify-center flex-wrap gap-4'>
							{types_x1.map((type, index) => (
								<Type
									key={index}
									type={type}
									showIcon={showIcons}
								/>
							))}
						</div>
					</div>
					<div
						className={`bg-teal-500 sm:min-h-[43vh] sm:w-[23vw] w-full sm:rounded-lg sm:p-4 p-2  ${
							isArrayEmpty(types_x05) && isArrayEmpty(types_x025)
								? 'hidden'
								: ''
						}`}>
						<p>Poco efectivo:</p>
						<div className={`${isArrayEmpty(types_x05) ? 'hidden' : ''}`}>
							<p className='my-3'>x1/2:</p>
							<div className='flex justify-center flex-wrap gap-4'>
								{types_x05.map((type, index) => (
									<Type
										key={index}
										type={type}
										showIcon={showIcons}
									/>
								))}
							</div>
						</div>
						<div className={`${isArrayEmpty(types_x025) ? 'hidden' : ''}`}>
							<p className='my-3'>x1/4:</p>
							<div className='flex justify-center flex-wrap gap-4'>
								{types_x025.map((type, index) => (
									<Type
										key={index}
										type={type}
										showIcon={showIcons}
									/>
								))}
							</div>
						</div>
					</div>

					<div
						className={`bg-teal-500 sm:min-h-[43vh] sm:w-[23vw] w-full sm:rounded-lg sm:p-4 p-2  ${
							isArrayEmpty(types_x0) ? 'hidden' : ''
						}`}>
						<p>Inmune:</p>
						<p className='my-3'>x0:</p>
						<div className='flex justify-center flex-wrap gap-4'>
							{types_x0.map((type, index) => (
								<Type
									key={index}
									type={type}
									showIcon={showIcons}
								/>
							))}
						</div>
					</div>
				</div>
			</div>

			<div
				ref={settingsRef}
				className={`fixed sm:right-0 bottom-0 sm:m-3 bg-blue-500 h-auto sm:w-[20vw] w-full flex flex-col items-center sm:rounded-lg text-white font-medium ${
					showSettings
						? 'scale-100 translate-y-0 translate-x-0'
						: 'scale-0 translate-y-full translate-x-40'
				} transition-all duration-150 transform`}>
				<div
					className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 rounded-t-lg'
					onClick={() => {
						openCalculatorTutorial();
						setShowSettings(false);
					}}>
					¿Cómo funciona?
				</div>

				<div
					className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
					onClick={handleShowIcons}>
					{`Mostrar ${showIcons ? 'nombres' : 'iconos'}`}
				</div>

				<div
					className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
					onClick={handleShowGimmickForms}>
					{`Formas Gimmick en Pokedex: ${gimmickForms ? 'SI' : 'NO'} `}
				</div>

				<div
					className='w-full py-2 bg-orange-400 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 sm:rounded-b-lg'
					onClick={() => setShowSettings(false)}>
					Cerrar
				</div>
			</div>

			<div
				className={`fixed right-0 bottom-0 m-4 w-10 cursor-pointer sm:bg-teal-600 bg-gray-700 rounded-lg p-2 sm:hover:bg-teal-500 active:scale-95 active:hover:bg-gray-500 sm:active:hover:bg-teal-400 transition-all ease-in-out duration-150 transform ${
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

export default Calculator;
