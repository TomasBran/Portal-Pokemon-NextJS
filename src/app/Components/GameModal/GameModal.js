'use client';

import Image from 'next/image';
import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const GameModal = ({
	isOpen,
	onClose,
	imageSrc,
	description,
	onAction,
	buttonText,
}) => {
	const { t } = useTranslation();
	const modalRef = useRef(null);
	const [isTransitioning, setIsTransitioning] = useState(isOpen);

	useEffect(() => {
		if (isOpen) {
			setIsTransitioning(true);
		} else {
			setIsTransitioning(false);
		}
	}, [isOpen]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				onClose();
			}
		};

		if (isTransitioning) {
			document.addEventListener('mousedown', handleClickOutside);
			return () =>
				document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [isTransitioning, onClose]);

	if (!isTransitioning && !isOpen) return null;

	return (
		<div
			className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 z-50 transition-opacity duration-300 ${
				isOpen ? 'opacity-100' : 'opacity-0'
			}`}>
			<div
				ref={modalRef}
				className={`bg-white sm:p-6 p-4 sm:w-screen flex flex-col items-center transform transition-transform duration-300 ${
					isOpen ? 'scale-100' : 'scale-90'
				}`}>
				<div className='sm:w-1/2 h-[40vh]'>
					<Image
						src={imageSrc}
						alt='Game'
						className='h-full w-full rounded-md object-cover'
						width={1024}
						height={1024}
					/>
				</div>
				<p className='mt-4 sm:w-1/2 text-gray-700 text-center font-semibold'>
					{description}
				</p>
				<div className='flex justify-center gap-8 sm:w-1/2'>
					<button
						onClick={onClose}
						className='mt-4 bg-gray-500 ring-offset-2 hover:ring-offset-1 ring-2 ring-gray-500 text-white py-2 px-8 rounded hover:bg-gray-700 active:bg-gray-800 active:scale-95 transition-all duration-150 font-bold'>
						{t('common.close').toUpperCase()}
					</button>
					<button
						onClick={onAction}
						className='mt-4 bg-green-500 ring-offset-2 hover:ring-offset-1 ring-2 ring-green-500 text-white py-2 px-8 rounded hover:bg-green-600 active:bg-green-700 active:scale-95 transition-all duration-150 font-bold'>
						{buttonText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default GameModal;
