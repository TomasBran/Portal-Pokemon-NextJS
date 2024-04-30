'use client';
import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import DraggableItem from './DraggableItem.js';

const DroppableArea = ({ id, items, onDrop, enabledContainer = true }) => {
	const [shortenText, setShortenText] = useState(false);

	const [{ isOver }, drop] = useDrop(() => ({
		accept: enabledContainer ? 'ITEM' : 'none',
		drop: (item) => {
			onDrop(item, id);
			setShortenText(id !== 'main');
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));

	useEffect(() => {
		setShortenText(id !== 'main');
	}, [items, id]);

	return (
		<div
			ref={drop}
			className={`overflow-auto sm:h-full h-32 w-full items-start flex flex-wrap justify-center sm:gap-2 gap-1 p-2 border-2 rounded-lg ${
				isOver
					? 'border-blue-800 bg-blue-300'
					: 'border-violet-800 bg-violet-300'
			}`}>
			{items.map((item) => (
				<DraggableItem
					key={item.id}
					id={item.id}
					name={item.name}
					text={item.text}
					shortenText={shortenText}
				/>
			))}
		</div>
	);
};

export default DroppableArea;
