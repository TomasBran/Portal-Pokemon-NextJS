import TypeIcon from './TypeIcon';

const Type = ({ type, showIcon }) => {
	return (
		<div
			className={`${type} p-2 md:p-4 text-white font-semibold rounded-xl border-2 border-white text-xs md:text-sm flex justify-center items-center sm:min-w-[4vw] sm:max-w-[6vw] sm:h-[5vh] capitalize shadow shadow-black/30`}
			key={type}>
			{showIcon ? <TypeIcon type={type} /> : <span>{type}</span>}
		</div>
	);
};

export default Type;
