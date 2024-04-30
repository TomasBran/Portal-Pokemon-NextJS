'use client';
import { useDrag } from 'react-dnd';
import '../Type/type.css';
import { typeLogos } from '../Type/TypeLogos';
import Image from 'next/image';

const DraggableItem = ({ id, name, shortenText }) => {
	const [, drag] = useDrag(() => ({
		type: 'ITEM',
		item: { id, name },
	}));

	return (
		<div
			ref={drag}
			className={`border text-xs border-gray-300 p-2 sm:m-2 cursor-move min-w-[8%] min-h-[4vh] flex justify-center items-center text-white font-medium rounded-lg active:scale-90 gap-1 ${name.toLowerCase()}`}>
			<Image
				src={typeLogos[name.toLowerCase()]}
				alt={`${name} Logo`}
				className='h-[3.5vh] w-auto'
			/>
			{!shortenText && name}
		</div>
	);
};

export default DraggableItem;
