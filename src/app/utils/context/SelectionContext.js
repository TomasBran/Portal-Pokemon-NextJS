'use client';
import { createContext, useContext, useState } from 'react';

export const SelectionContext = createContext('Initial Value');

export const SelectionProvider = ({ children }) => {
	const [currentFirstSelection, setCurrentFirstSelection] = useState('');
	const [currentSecondSelection, setCurrentSecondSelection] = useState('');
	const [currentEnemyFirstSelection, setCurrentEnemyFirstSelection] =
		useState('');
	const [currentEnemySecondSelection, setCurrentEnemySecondSelection] =
		useState('');

	const setSelection = (type) => {
		currentFirstSelection === ''
			? setCurrentFirstSelection(type)
			: setCurrentSecondSelection(type);
	};

	const setBothTypes = (type1, type2) => {
		setCurrentFirstSelection(type1);
		setCurrentSecondSelection(type2);
	};

	const deleteBothTypes = () => {
		deleteSelection(1);
		deleteSelection(2);
	};

	const setEnemySelection = (type) => {
		currentEnemyFirstSelection === ''
			? setCurrentEnemyFirstSelection(type)
			: setCurrentEnemySecondSelection(type);
	};

	const deleteSelection = (number) => {
		number === 1 ? setCurrentFirstSelection('') : setCurrentSecondSelection('');
	};

	const deleteEnemySelection = (number) => {
		number === 1
			? setCurrentEnemyFirstSelection('')
			: setCurrentEnemySecondSelection('');
	};

	return (
		<SelectionContext.Provider
			value={{
				currentFirstSelection,
				currentSecondSelection,
				currentEnemyFirstSelection,
				currentEnemySecondSelection,
				setSelection,
				setEnemySelection,
				deleteSelection,
				deleteEnemySelection,
				setBothTypes,
				deleteBothTypes,
			}}>
			{children}
		</SelectionContext.Provider>
	);
};

export const useSelection = () => {
	return useContext(SelectionContext);
};
