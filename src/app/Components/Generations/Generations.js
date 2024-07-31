'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Generations = ({ getGenerations, resetGame, padding = 4 }) => {
	const { t } = useTranslation();
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
			toast.error(t('generations.messages.error'));
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
			title: t('generations.messages.warn_title'),
			text: t('generations.messages.warn_text'),
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'rgb(99 102 241)',
			cancelButtonColor: 'rgb(239 68 68)',
			confirmButtonText: t('generations.buttons.confirm'),
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
				<button className='w-full'>{t('generations.buttons.base_text')}</button>
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
							<span>Gen. {index + 1}</span>
						</div>
					))}
				</div>

				<button
					className='py-3 rounded-lg bg-indigo-600 w-2/6 hover:bg-indigo-500 active:bg-indigo-400 active:scale-95'
					onClick={() => {
						toggleGenerationPanel();
						resetGame(false);
					}}>
					{t('generations.buttons.save')}
				</button>
			</div>
		</div>
	);
};

export default Generations;
