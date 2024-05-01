'use client';
import Image from 'next/image';
import CompanionArray from './CompanionArray';
import { useEffect, useState } from 'react';

const Companion = ({ score, stats }) => {
	const [companionImage, setCompanionImage] = useState(CompanionArray[0].url);

	useEffect(() => {
		const newUrl = getRandomUrlByType(score, companionImage);
		setCompanionImage(newUrl);
	}, [score, stats]);

	const getRandomUrlByType = (type, currentUrl) => {
		const filteredCompanions = CompanionArray.filter(
			(companion) =>
				companion.name.includes(type) && companion.url !== currentUrl
		);

		if (filteredCompanions.length === 0) {
			return currentUrl;
		}

		const randomIndex = Math.floor(Math.random() * filteredCompanions.length);
		return filteredCompanions[randomIndex].url;
	};

	return (
		<div>
			<div className='bg-white h-full w-full rounded-lg overflow-hidden'>
				<Image
					alt='pikachu'
					className='h-full w-full'
					src={companionImage}
					width={40}
					height={40}
				/>
			</div>
		</div>
	);
};

export default Companion;
