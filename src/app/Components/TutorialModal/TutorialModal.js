import {
	getFromLocalStorage,
	saveToLocalStorage,
} from '@/app/utils/services/localStorage';
import Image from 'next/image';
import React, { useState } from 'react';

const TutorialModal = ({ steps, isOpen, onClose, localStorageKey }) => {
	const [currentStep, setCurrentStep] = useState(0);

	const initialDontShow = getFromLocalStorage(localStorageKey) === 'true';

	const [dontShowAgain, setDontShowAgain] = useState(initialDontShow);

	console.log(dontShowAgain);

	if (!isOpen) return null;

	const nextStep = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleCheckboxChange = (e) => {
		const value = e.target.checked;
		setDontShowAgain(value);
		saveToLocalStorage(localStorageKey, value.toString());
	};

	return (
		<div className='fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-80'>
			<div className='bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2'>
				<span className='text-xl font-pokemon text-indigo-600'>
					TUTORIAL ({currentStep + 1}/{steps.length})
				</span>
				<div className='flex flex-col items-center pt-4'>
					<Image
						src={steps[currentStep].image}
						alt={`Step ${currentStep + 1}`}
						className='mb-4 w-full rounded-lg'
						width={2048}
						height={2048}
					/>
					<p className='text-lg mb-4'>{steps[currentStep].text}</p>
					<div className='flex sm:gap-10 gap-4'>
						<button
							onClick={prevStep}
							disabled={currentStep === 0}
							className='px-8 py-2 bg-indigo-500 enabled:hover:bg-indigo-600 enabled:active:bg-indigo-700 enabled:active:scale-95 transition-all duration-150 text-white rounded-lg disabled:opacity-30'>
							Anterior
						</button>
						<button
							onClick={nextStep}
							disabled={currentStep === steps.length - 1}
							className='px-8 py-2 bg-indigo-500 enabled:hover:bg-indigo-600 enabled:active:bg-indigo-700 enabled:active:scale-95 transition-all duration-150 text-white rounded-lg disabled:opacity-30'>
							Siguiente
						</button>
					</div>
					<div className='mt-6 flex flex-col gap-1'>
						<label className='flex items-center text-gray-700 cursor-pointer'>
							<input
								type='checkbox'
								className='mr-2 cursor-pointer'
								checked={dontShowAgain}
								onChange={handleCheckboxChange}
							/>
							No volver a mostrar
						</label>
						<button
							onClick={() => {
								onClose();
								setCurrentStep(0);
							}}
							className='text-red-500 border border-red-500 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-150'>
							Cerrar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TutorialModal;
