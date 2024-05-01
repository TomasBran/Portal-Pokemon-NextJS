'use client';

import { useEffect, useRef, useState } from 'react';
import starIcon from '../../../../public/assets/star_svg.svg';
import Image from 'next/image';

function calculateTypePower(percentageType) {
	return Math.exp(-percentageType);
}

function resetTypeAmounts(synergiesObjectToReset) {
	const types = synergiesObjectToReset;
	for (const key in types) {
		if (types.hasOwnProperty(key)) {
			types[key].amount = 0;
		}
	}
	return types;
}

function resetGenerationAmounts(synergiesObjectToReset) {
	const generations = synergiesObjectToReset;
	for (const key in generations) {
		if (generations.hasOwnProperty(key)) {
			generations[key] = 0;
		}
	}
	return generations;
}

function addTypes(team, synergyObject) {
	resetTypeAmounts(synergyObject.sameTypeAmount.types);

	team.forEach((pokemon) => {
		const type1 = pokemon.type_1.toLowerCase();
		synergyObject.sameTypeAmount.types[type1].amount++;

		if (pokemon.type_2 !== 'Ninguno') {
			const type2 = pokemon.type_2.toLowerCase();
			synergyObject.sameTypeAmount.types[type2].amount++;
		}
	});

	return synergyObject;
}

function addGenerations(team, synergyObject) {
	resetGenerationAmounts(synergyObject.sameGenerationAmount.generations);

	team.forEach((pokemon) => {
		const generation = pokemon.generation;
		synergyObject.sameGenerationAmount.generations[generation]++;
	});

	return synergyObject;
}

function calculateElementalTrinity(synergyObject) {
	const elementTypes = ['water', 'grass', 'fire'];
	const minAmountRequired = 1;

	for (let i = minAmountRequired; i <= 3; i++) {
		const synergyKey = `elementalTrinity${i}`;
		if (
			elementTypes.every(
				(type) => synergyObject.sameTypeAmount.types[type].amount >= i
			)
		) {
			synergyObject[synergyKey].active = true;
		} else {
			synergyObject[synergyKey].active = false;
		}
	}
	return synergyObject;
}

function calculateMartialMindset(synergyObject) {
	const elementTypes = ['fighting', 'psychic', 'dark'];
	const minAmountRequired = 1;

	for (let i = minAmountRequired; i <= 3; i++) {
		const synergyKey = `martialMindset${i}`;
		if (
			elementTypes.every(
				(type) => synergyObject.sameTypeAmount.types[type].amount >= i
			)
		) {
			synergyObject[synergyKey].active = true;
		} else {
			synergyObject[synergyKey].active = false;
		}
	}
	return synergyObject;
}

function calculateFrozenFortress(synergyObject) {
	const elementTypes = ['ground', 'ice', 'steel'];
	const minAmountRequired = 1;

	for (let i = minAmountRequired; i <= 3; i++) {
		const synergyKey = `frozenFortress${i}`;
		if (
			elementTypes.every(
				(type) => synergyObject.sameTypeAmount.types[type].amount >= i
			)
		) {
			synergyObject[synergyKey].active = true;
		} else {
			synergyObject[synergyKey].active = false;
		}
	}
	return synergyObject;
}

function calculateSameTypeSynergy(synergyObject) {
	const amountRequiredForSynergy = 3;

	synergyObject.sameTypeAmount.active = Object.values(
		synergyObject.sameTypeAmount.types
	).some((type) => type.amount >= amountRequiredForSynergy);

	return synergyObject;
}

function calculateSameGenerations(synergyObject, allGenerations) {
	if (!allGenerations) {
		return synergyObject;
	}

	const amountRequiredForSynergy = 3;

	const generations = synergyObject.sameGenerationAmount.generations;
	const generationKeys = Object.keys(generations);
	synergyObject.sameGenerationAmount.active = generationKeys.some(
		(key) => generations[key] >= amountRequiredForSynergy
	);

	return synergyObject;
}

function calculateLegendary(team, synergyObject) {
	const legendaryRanges = [
		[150, 151],
		[249, 251],
		[377, 386],
		[480, 493],
		[638, 649],
		[716, 721],
		[785, 809],
		[888, 905],
		[1001, 1025],
	];

	let hasLegendary = false;
	for (const pokemon of team) {
		const pokemonId = pokemon.id;

		const isLegendary = legendaryRanges.some(
			(range) => pokemonId >= range[0] && pokemonId <= range[1]
		);

		if (isLegendary) {
			hasLegendary = true;
			break;
		}
	}

	synergyObject.legendaryAmount.active = !hasLegendary;

	return synergyObject;
}

function calculateElementalPerfection(team, synergyObject) {
	const typesSet = new Set();

	team.forEach((pokemon) => {
		typesSet.add(pokemon.type_1.toLowerCase());
		if (pokemon.type_2 !== 'Ninguno') {
			typesSet.add(pokemon.type_2.toLowerCase());
		}
	});

	const uniqueTypesCount = typesSet.size;
	const isElementalPerfection = uniqueTypesCount >= 10;
	synergyObject.elementalPerfection.active = isElementalPerfection;

	return synergyObject;
}

function calculateRerollsLeft(rerollsLeft, synergyObject) {
	synergyObject.rerollsLeft.active = rerollsLeft >= 3;
	return synergyObject;
}

function calculateLastReroll(rerollsLeft, team, synergyObject) {
	if (rerollsLeft === 0) {
		const numberOfPokemon = team.length;
		synergyObject.lastRerollPokemonAmount.active = numberOfPokemon <= 2;
	} else {
		synergyObject.lastRerollPokemonAmount.active = false;
	}
	return synergyObject;
}

const calculateSynergyPower = (synergyObject) => {
	let synergyPowerTotal = 0;

	Object.values(synergyObject).forEach((trait) => {
		if (trait.active) {
			synergyPowerTotal += trait.synergyPower;
		}
	});

	return synergyPowerTotal;
};

const getClassBySynergyPower = (synergyPower) => {
	switch (synergyPower) {
		case 1:
			return 'text-green-300';
		case 2:
			return 'text-blue-300';
		case 3:
			return 'text-purple-300';
		case 4:
			return 'text-orange-400';
		case 5:
			return 'text-red-400';
		default:
			return '';
	}
};

const Synergies = ({
	team,
	rerollsLeft,
	allGenerations,
	onSynergiesCalculate,
}) => {
	const initialSynergiesObject = {
		sameTypeAmount: {
			types: {
				water: { name: 'water', amount: 0, percentageType: 9.68 },
				normal: { name: 'normal', amount: 0, percentageType: 8.14 },
				grass: { name: 'grass', amount: 0, percentageType: 7.64 },
				flying: { name: 'flying', amount: 0, percentageType: 6.91 },
				psychic: { name: 'psychic', amount: 0, percentageType: 6.47 },
				bug: { name: 'bug', amount: 0, percentageType: 5.67 },
				fire: { name: 'fire', amount: 0, percentageType: 5.3 },
				poison: { name: 'poison', amount: 0, percentageType: 5.12 },
				dark: { name: 'dark', amount: 0, percentageType: 5.12 },
				fighting: { name: 'fighting', amount: 0, percentageType: 5.06 },
				ground: { name: 'ground', amount: 0, percentageType: 4.75 },
				rock: { name: 'rock', amount: 0, percentageType: 4.69 },
				steel: { name: 'steel', amount: 0, percentageType: 4.62 },
				electric: { name: 'electric', amount: 0, percentageType: 4.44 },
				ghost: { name: 'ghost', amount: 0, percentageType: 4.32 },
				dragon: { name: 'dragon', amount: 0, percentageType: 4.25 },
				fairy: { name: 'fairy', amount: 0, percentageType: 4.25 },
				ice: { name: 'ice', amount: 0, percentageType: 3.58 },
			},
			displayName: 'Bonus de mismo tipo',
			active: false,
			synergyPower: 1,
		},
		sameGenerationAmount: {
			generations: {
				1: 0,
				2: 0,
				3: 0,
				4: 0,
				5: 0,
				6: 0,
				7: 0,
				8: 0,
				9: 0,
			},
			displayName: 'Bonus de misma generación',
			active: false,
			synergyPower: 1,
		},

		legendaryAmount: {
			value: 0,
			displayName: 'Bonus equipo sin Legendarios',
			active: false,
			synergyPower: 2,
		},
		rerollsLeft: {
			value: 3,
			displayName: 'Bonus 1-Shot',
			active: false,
			synergyPower: 2,
		},
		lastRerollPokemonAmount: {
			value: 4,
			displayName: 'Bonus desesperación',
			active: false,
			synergyPower: 2,
		},
		elementalTrinity1: {
			active: false,
			displayName: 'Trinidad Elemental Nivel 1',
			synergyPower: 1,
		},
		elementalTrinity2: {
			active: false,
			displayName: 'Trinidad Elemental Nivel 2',
			synergyPower: 3,
		},
		elementalTrinity3: {
			active: false,
			displayName: 'Trinidad Elemental Nivel 3',
			synergyPower: 4,
		},
		martialMindset1: {
			active: false,
			displayName: 'Mentalidad Marcial Nivel 1',
			synergyPower: 1,
		},
		martialMindset2: {
			active: false,
			displayName: 'Mentalidad Marcial Nivel 2',
			synergyPower: 3,
		},
		martialMindset3: {
			active: false,
			displayName: 'Mentalidad Marcial Nivel 3',
			synergyPower: 4,
		},
		frozenFortress1: {
			active: false,
			displayName: 'Fortaleza Helada Nivel 1',
			synergyPower: 1,
		},
		frozenFortress2: {
			active: false,
			displayName: 'Fortaleza Helada Nivel 2',
			synergyPower: 3,
		},
		frozenFortress3: {
			active: false,
			displayName: 'Fortaleza Helada Nivel 3',
			synergyPower: 4,
		},
		elementalPerfection: {
			active: false,
			displayName: 'Perfección Elemental',
			synergyPower: 5,
		},
	};

	const [showSynergies, setShowSynergies] = useState(false);
	const [synergyObject, setSynergyObject] = useState(initialSynergiesObject);
	const synergiesRef = useRef(null);
	const [synergyPower, setSynergyPower] = useState(0);

	useEffect(() => {
		setSynergyObject(addTypes(team, synergyObject));
		setSynergyObject(addGenerations(team, synergyObject));
		setSynergyObject(calculateElementalTrinity(synergyObject));
		setSynergyObject(calculateMartialMindset(synergyObject));
		setSynergyObject(calculateFrozenFortress(synergyObject));
		setSynergyObject(calculateSameTypeSynergy(synergyObject));
		setSynergyObject(calculateSameGenerations(synergyObject, allGenerations));
		setSynergyObject(calculateLegendary(team, synergyObject));
		setSynergyObject(calculateElementalPerfection(team, synergyObject));
		setSynergyObject(calculateRerollsLeft(rerollsLeft, synergyObject));

		setSynergyPower(calculateSynergyPower(synergyObject));
	}, [team]);

	useEffect(() => {
		onSynergiesCalculate(synergyPower);
	}, [onSynergiesCalculate, synergyPower]);

	useEffect(() => {
		setSynergyObject(calculateRerollsLeft(rerollsLeft, synergyObject));
		setSynergyObject(calculateLastReroll(rerollsLeft, team, synergyObject));
	}, [rerollsLeft]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				showSynergies &&
				synergiesRef.current &&
				!synergiesRef.current.contains(event.target)
			) {
				setShowSynergies(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showSynergies]);

	return (
		<div
			className={`bg-indigo-500 rounded-lg ${
				showSynergies && 'border-4 border-indigo-900 '
			}`}
			ref={synergiesRef}>
			<div
				className={`rounded-xl transition-all duration-150 overflow-hidden ${
					showSynergies ? 'h-60 sm:w-80 w-[80vw] py-2' : 'h-0 w-0'
				} `}>
				{true && (
					<div className='h-full '>
						{rerollsLeft !== 4 ? (
							<div className='flex flex-col justify-between h-full'>
								<div className='flex flex-col gap-1'>
									<span className='text-white underline text-lg'>
										Sinergias activas:
									</span>
									<ul className='list-disc list-inside px-2'>
										{Object.values(synergyObject).map((item, index) => (
											<li
												key={index}
												className={`${getClassBySynergyPower(
													item.synergyPower
												)} ${item.active ? 'mb-2' : 'hidden'}`}>
												{item.active && item.displayName}
											</li>
										))}
									</ul>
								</div>
								<span className='text-white font-semibold'>
									Bonus total:{' '}
									<span className='text-yellow-400'>+{synergyPower}</span>
								</span>
							</div>
						) : (
							<div className='text-white h-full px-8 flex justify-center items-center'>
								Inicia una partida para ver las sinergias aqui
							</div>
						)}
					</div>
				)}
			</div>
			<div className='flex justify-end items-center h-full'>
				<Image
					src={starIcon}
					alt='synergies'
					onClick={() => setShowSynergies((prev) => !prev)}
					className={`w-10 p-2 cursor-pointer rounded-lg rounded-lg bg-indigo-500 hover:bg-indigo-400 active:scale-95 active:hover:bg-indigo-300 transition-all ease-in-out duration-150`}
				/>
			</div>
		</div>
	);
};

export default Synergies;
