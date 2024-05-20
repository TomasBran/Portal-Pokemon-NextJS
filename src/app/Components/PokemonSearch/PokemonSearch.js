import React, { useState, useEffect, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import './PokemonSearch.css';
import { toast } from 'sonner';

function PokemonSearch(props) {
	const [value, setValue] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [pokemonData, setPokemonData] = useState([]);
	const inputRef = useRef(null);

	const { gimmickForms } = props;
	const gimmickFormsValue = gimmickForms !== undefined ? gimmickForms : false;

	useEffect(() => {
		async function fetchData() {
			try {
				let url = gimmickFormsValue
					? 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0'
					: 'https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0';
				const response = await fetch(url);
				const data = await response.json();
				const pokemonList = data.results;
				setPokemonData(pokemonList);
			} catch (error) {
				console.error('Error al cargar los datos de Pokemon', error);
			}
		}

		fetchData();
	}, [gimmickForms]);

	const getSuggestions = (inputValue) => {
		const inputValueLowerCase = inputValue.trim().toLowerCase();
		return pokemonData.filter((pokemon) =>
			pokemon.name.toLowerCase().startsWith(inputValueLowerCase)
		);
	};

	const onChange = (event, { newValue }) => {
		const capitalizedValue =
			newValue.charAt(0).toUpperCase() + newValue.slice(1);
		setValue(capitalizedValue);
		props.onInputChange(capitalizedValue);
	};

	const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

	const onSuggestionSelected = (event, { suggestion }) => {
		searchPokemon(suggestion.name);
	};

	const onSuggestionsFetchRequested = ({ value }) => {
		setSuggestions(getSuggestions(value));
	};

	const onSuggestionsClearRequested = () => {
		setSuggestions([]);
	};

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			if (value.length <= 0) {
				toast.error(`El buscador está vacío.`);
				return;
			}
			searchPokemon(value);
		}
	};

	const inputProps = {
		placeholder: 'Ej: Pikachu',
		value,
		onChange,
		onKeyDown: handleKeyDown,
	};

	const clearInput = () => {
		setValue('');
	};

	const searchPokemon = (pokemon) => {
		props.searchPokemon(pokemon);
		clearInput();
	};

	return (
		<div className='flex gap-4'>
			<Autosuggest
				suggestions={suggestions}
				onSuggestionSelected={onSuggestionSelected}
				onSuggestionsFetchRequested={onSuggestionsFetchRequested}
				onSuggestionsClearRequested={onSuggestionsClearRequested}
				getSuggestionValue={(suggestion) => suggestion.name}
				renderSuggestion={renderSuggestion}
				inputProps={{ ...inputProps, ref: inputRef, onKeyDown: handleKeyDown }}
			/>

			{props.showSearchButton && (
				<button
					className='md:py-2 md:px-6 px-1 rounded-2xl bg-gray-500 text-white font-semibold cursor-pointer hover:bg-gray-400 active:bg-gray-300 active:scale-95 transition duration-150'
					onClick={() => searchPokemon(value)}>
					Buscar
				</button>
			)}
		</div>
	);
}

PokemonSearch.defaultProps = {
	showSearchButton: true,
};

export default PokemonSearch;
