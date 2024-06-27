import TooltipImage from '../TooltipImage/TooltipImage';

const TeamContainer = ({ team }) => {
	return (
		<div className='flex justify-evenly bg-white w-full h-full sm:border-2 border-black sm:rounded-2xl sm:p-4 py-2 items-center'>
			{team.length === 0 && <span className='text-2xl'>Equipo Vacio</span>}
			{team.map((pokemon, index) => {
				return (
					<div
						className='flex justify-center items-center w-2/12 h-full'
						key={index}>
						<TooltipImage
							type_1={pokemon.type_1}
							type_2={pokemon.type_2}
							alt={pokemon.name}
							src={pokemon.img}
							tooltipText={pokemon.name}
							imgClasses={`sm:w-4/6 w-full h-full object-contain drop-shadow-xl`}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default TeamContainer;
