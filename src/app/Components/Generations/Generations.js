'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Generations = ({ getGenerations, resetGame, padding = 4 }) => {
	const MySwal = withReactContent(Swal);
	const [showGenerationsContainer, setShowGenerationsContainer] =
		useState(false);

	const [currentGenerations, setCurrentGenerations] = useState([
		true,
		true,
		true,
		true,
		true,
		true,
		true,
		true,
		true,
	]);

	const toggleGeneration = (index) => {
		const trueCount = currentGenerations.filter(
			(value) => value === true
		).length;

		if (trueCount === 1 && currentGenerations[index]) {
			toast.error(`Se necesita por lo menos 1 generación disponible`);
			return;
		}

		let newGenerations = currentGenerations.slice();
		newGenerations[index] = !newGenerations[index];
		setCurrentGenerations(newGenerations);
	};

	useEffect(() => {
		getGenerations(currentGenerations);
	}, [currentGenerations]);

	const toggleGenerationPanel = async () => {
		if (showGenerationsContainer) {
			setShowGenerationsContainer((prev) => !prev);
			resetGame(false);
			return;
		}

		let result = await MySwal.fire({
			title: 'Quieres cambiar las generaciones disponibles?',
			text: 'Si comenzaste una partida, se reiniciará.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'rgb(99 102 241)',
			cancelButtonColor: 'rgb(239 68 68)',
			confirmButtonText: 'Cambiar',
		});

		if (result.isConfirmed) {
			setShowGenerationsContainer((prev) => !prev);
			resetGame(false);
		}
	};

	return (
		<div>
			<div
				className={`w-full p-${padding} cursor-pointer`}
				onClick={toggleGenerationPanel}>
				<button className='w-full'>Cambiar Generación</button>
			</div>

			<div
				className={`sm:p-4 py-8 sm:w-[36vw] w-full fixed right-0 bottom-0 bg-white sm:rounded-lg border-2 border-gray-600 flex flex-col gap-6 items-center text-white ${
					!showGenerationsContainer && 'hidden'
				}`}>
				<div className='flex flex-wrap sm:gap-6 gap-4 justify-center'>
					{currentGenerations.map((element, index) => (
						<div
							key={index}
							className={`w-3/12 py-2 rounded-lg cursor-pointer active:scale-95 ${
								element === true
									? 'bg-green-600 hover:bg-green-500 active:bg-green-400'
									: 'bg-red-600 hover:bg-red-500 active:bg-red-400'
							}`}
							onClick={() => toggleGeneration(index)}>
							<span>
								{index + 1}° Gen
								<span className='sm:inline hidden'>eración</span>
							</span>
						</div>
					))}
				</div>

				<button
					className='py-3 rounded-lg bg-indigo-600 w-2/6 hover:bg-indigo-500 active:bg-indigo-400 active:scale-95'
					onClick={() => {
						toggleGenerationPanel();
						resetGame(false);
					}}>
					Listo
				</button>
			</div>
		</div>
	);
};

export default Generations;
