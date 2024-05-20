import { toast } from 'sonner';

async function getPokemonMoveset(pokemonName) {
	let pokemonMoveset = [];
	pokemonName += '';

	await fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonName.toLowerCase())
		.then((res) => res.json())
		.then((fetchedPokemon) => {
			const movementsArray = fetchedPokemon.moves;
			const availableMovements = movementsArray.map((movement) =>
				movement.move.name.replace(/-/g, ' ')
			);

			while (pokemonMoveset.length < 4) {
				const randomNumber = Math.floor(
					Math.random() * availableMovements.length
				);

				if (
					movementsArray[randomNumber].version_group_details[
						movementsArray[randomNumber].version_group_details.length - 1
					].move_learn_method.name === 'level-up'
				) {
					if (!pokemonMoveset.includes(availableMovements[randomNumber])) {
						pokemonMoveset.push(availableMovements[randomNumber]);
					}
				}
			} // 0 a 3

			const randomAbilityNumber = Math.floor(
				Math.random() * fetchedPokemon.abilities.length
			);
			pokemonMoveset.push(
				fetchedPokemon.abilities[randomAbilityNumber].ability.name.replace(
					/-/g,
					' '
				)
			); // 4
			pokemonMoveset.push(fetchedPokemon.name); // 5
			pokemonMoveset.push(fetchedPokemon.id); // 6
		});

	return pokemonMoveset;
}

export { getPokemonMoveset };

async function getMovementInfo(movementName) {
	let movement = {};
	movementName += '';

	if (movementName === '') {
		toast.error(`El buscador está vacio.`);
		return;
	}

	await fetch('https://pokeapi.co/api/v2/move/' + movementName.toLowerCase())
		.then((res) => res.json())
		.then((fetchedMovement) => {
			movement = fetchedMovement;
		})
		.catch((err) => {
			toast.error(`El movimiento "${movementName.toUpperCase()}" no existe`);
		});

	return movement;
}

export { getMovementInfo };
