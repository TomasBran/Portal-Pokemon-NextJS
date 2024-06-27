import React, { useState } from 'react';
import '../Type/type.css';

function TooltipImage({ src, alt, tooltipText, imgClasses, type_1, type_2 }) {
	const [isTooltipVisible, setIsTooltipVisible] = useState(false);
	const [isTooltipPinned, setIsTooltipPinned] = useState(false);

	const handleMouseEnter = () => {
		setIsTooltipVisible(true);
	};

	const handleMouseLeave = () => {
		if (!isTooltipPinned) {
			setIsTooltipVisible(false);
		}
	};

	const handleClick = () => {
		setIsTooltipPinned(!isTooltipPinned);
	};

	return (
		<div
			className='relative flex justify-center cursor-pointer'
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={handleClick}>
			<img
				src={src}
				alt={alt}
				className={imgClasses}
			/>
			<div
				className={`absolute bottom-full mb-2 w-max px-2 py-1 ${
					isTooltipPinned ? 'bg-slate-600' : 'bg-gray-800'
				} text-white text-xs rounded shadow-lg transition-opacity duration-300 ${
					isTooltipVisible || isTooltipPinned ? 'opacity-100' : 'opacity-0'
				} hidden sm:block`}>
				{tooltipText}
			</div>
			<div
				className={`absolute top-full flex gap-0.5 transition-opacity duration-300 ${
					isTooltipVisible || isTooltipPinned ? 'opacity-100' : 'opacity-0'
				} hidden sm:flex`}>
				{type_1 !== 'Ninguno' && (
					<div
						className={`mb-2 w-max px-2 py-1 ${type_1.toLowerCase()} text-white text-xs rounded shadow-lg`}>
						{type_1}
					</div>
				)}
				{type_2 !== 'Ninguno' && (
					<div
						className={`mb-2 w-max px-2 py-1 ${type_2.toLowerCase()} text-white text-xs rounded shadow-lg`}>
						{type_2}
					</div>
				)}
			</div>
		</div>
	);
}

export default TooltipImage;
