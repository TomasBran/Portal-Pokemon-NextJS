async function getPokemonMovements(pokemonName) {
	let pokemonMovements = [];
	pokemonName += '';

	await fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonName.toLowerCase())
		.then((res) => res.json())
		.then((fetchedPokemon) => {
			const movementsArray = fetchedPokemon.moves;
			const availableMovements = movementsArray.map((movement) =>
				movement.move.name.replace(/-/g, ' ')
			);

			while (pokemonMovements.length < 4) {
				const randomNumber = Math.floor(
					Math.random() * availableMovements.length
				);

				if (
					movementsArray[randomNumber].version_group_details[
						movementsArray[randomNumber].version_group_details.length - 1
					].move_learn_method.name === 'level-up'
				) {
					if (!pokemonMovements.includes(availableMovements[randomNumber])) {
						pokemonMovements.push(availableMovements[randomNumber]);
					}
				}
			} // 0 a 3

			const randomAbilityNumber = Math.floor(
				Math.random() * fetchedPokemon.abilities.length
			);
			pokemonMovements.push(
				fetchedPokemon.abilities[randomAbilityNumber].ability.name.replace(
					/-/g,
					' '
				)
			); // 4
			pokemonMovements.push(fetchedPokemon.name); // 5
			pokemonMovements.push(fetchedPokemon.id); // 6
		});

	return pokemonMovements;
}

export { getPokemonMovements };
