'use client';

import unknown_pokemon from '../../../../public/assets/unknown_pokemon.png';
import { toast } from 'sonner';
import { capitalizeFirstLetter } from '../functions.js';
import i18next from 'i18next';

const pokemonNumberLimits = [151, 251, 386, 493, 649, 721, 809, 898, 1025];

async function pokemonExists(pokemonName) {
	const doesntExist = i18next.t('pokemon_search.messages.doesnt_exist', {
		pokemonName,
	});
	const response = await fetch(
		'https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0'
	);
	const data = await response.json();
	const pokemonList = data.results;

	if (
		pokemonList.some(
			(pokemon) => pokemon.name.toLowerCase() === pokemonName.toLowerCase()
		)
	) {
		return true;
	} else {
		toast.error(doesntExist);
		return false;
	}
}

function getPokemonsGeneration(pokemonId) {
	let wasGenerationAssigned = false;
	let generation;

	pokemonNumberLimits.forEach((element, index) => {
		if (pokemonId <= element && !wasGenerationAssigned) {
			generation = index + 1;
			wasGenerationAssigned = true;
		}
	});

	return generation;
}

async function getPokemon(pokemonName) {
	const no_type = i18next.t('common.no_type');
	const doesntExist = i18next.t('pokemon_search.messages.doesnt_exist', {
		pokemonName,
	});
	const search_empty = i18next.t('pokemon_search.messages.empty');
	let pokemon = {};
	pokemonName += '';

	if (pokemonName === '') {
		toast.error(search_empty);
		return;
	}

	await fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonName.toLowerCase())
		.then((res) => res.json())
		.then((fetchedPokemon) => {
			let totalStats = 0;
			fetchedPokemon.stats.forEach((stat) => {
				totalStats += stat.base_stat;
			});

			pokemon.stats = fetchedPokemon.stats;

			pokemon.img =
				fetchedPokemon.sprites.other['official-artwork'].front_default !== null
					? fetchedPokemon.sprites.other['official-artwork'].front_default
					: fetchedPokemon.sprites.other.dream_world.front_default !== null
					? fetchedPokemon.sprites.other.dream_world.front_default
					: fetchedPokemon.sprites.other.home.front_default !== null
					? fetchedPokemon.sprites.other.home.front_default
					: fetchedPokemon.sprites.front_default
					? fetchedPokemon.sprites.front_default
					: unknown_pokemon;

			if (pokemon.img.length > 120) {
				// ERROR CUANDO PIDE EL NOMBRE EN LUGAR DE NUMERO DE POKEMON, SE CREA MAL LA URL
				pokemon.img = pokemon.img.slice(57);
			}

			pokemon.name = capitalizeFirstLetter(fetchedPokemon.name);

			pokemon.generation = getPokemonsGeneration(fetchedPokemon.id);

			pokemon.type_1 = capitalizeFirstLetter(fetchedPokemon.types[0].type.name);
			pokemon.type_2 =
				fetchedPokemon.types.length > 1
					? capitalizeFirstLetter(fetchedPokemon.types[1].type.name)
					: no_type;
			pokemon.power = totalStats;
			pokemon.weight = fetchedPokemon.weight / 10;
			pokemon.height = fetchedPokemon.height / 10;
			pokemon.id = fetchedPokemon.id;
			pokemon.hasBeenChosen = false;
		})
		.catch((err) => {
			toast.error(doesntExist);
		});

	return pokemon;
}

export { getPokemon, pokemonExists, getPokemonsGeneration };
