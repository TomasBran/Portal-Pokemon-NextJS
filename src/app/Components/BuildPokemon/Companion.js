'use client';
import Image from 'next/image';
import CompanionArray from './CompanionArray';
import { useEffect, useState } from 'react';

const Companion = ({ score, stats }) => {
	const [playScore, setPlayScore] = useState(score);
	const [companionImage, setCompanionImage] = useState(CompanionArray[0].url);

	useEffect(() => {
		const newUrl = getRandomUrlByType(score, companionImage);
		setCompanionImage(newUrl);
		setPlayScore(score);
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

	const getScoreSign = (score) => {
		switch (score) {
			case 'good':
			case 'bad':
				return '❔';
			case 'best':
				return '✔️';
			case 'worst':
				return '❌';
			default:
				return '';
		}
	};

	const getScoreClassName = (score) => {
		switch (score) {
			case 'good':
			case 'bad':
				return 'bg-white/80';
			case 'best':
				return 'bg-green-600/80';
			case 'worst':
				return 'bg-black/80';
			default:
				return '';
		}
	};

	return (
		<div>
			<div className='bg-white h-full w-full rounded-lg overflow-hidden'>
				<span
					className={`${getScoreClassName(
						playScore
					)} absolute right-0 bottom-0 m-2 p-1 rounded-full`}>
					{getScoreSign(playScore)}
				</span>
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
