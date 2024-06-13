import Link from 'next/link';
import Image from 'next/image';
import gym from '../../public/assets/gym.png';
import calculator from '../../public/assets/calculator.png';
import pokedle from '../../public/assets/pokedle.png';
import moveset from '../../public/assets/moveset_background.jpg';
import typesChallenge from '../../public/assets/types_challenge.webp';
import build_pokemon from '../../public/assets/build_pokemon.png';

const buttonsArray = [
	{
		url: '/games/gym',
		text: 'Gimnasio',
		image: gym,
		typeText: 'Juego',
		isDisabled: false,
	},
	{
		url: '/games/pokedle',
		text: 'Pokedle',
		image: pokedle,
		typeText: 'Juego',
		isDisabled: false,
	},
	{
		url: '/games/moveset',
		text: 'Adivina el MoveSet',
		image: moveset,
		typeText: 'Juego',
		isDisabled: false,
	},
	{
		url: '/games/types-challenge',
		text: 'Desafío de Tipos',
		image: typesChallenge,
		typeText: 'Juego',
		isDisabled: false,
	},
	{
		url: '/games/build-pokemon',
		text: 'Construye un Pokemon',
		image: build_pokemon,
		typeText: 'Juego',
		isDisabled: false,
	},
	{
		url: '/tools/calculator',
		text: 'Calculadora',
		image: calculator,
		typeText: 'Herramienta',
		isDisabled: false,
	},
];

export default function Home() {
	return (
		<div className='min-h-screen pt-10 bg-yellow-200 sm:bg-yellow-100 flex flex-col justify-center items-center w-screen'>
			<h2 className='sm:block hidden sm:text-3xl text-lg pt-4 -mb-3 sm:mb-0 font-pokemon text-yellow-600 text-center'>
				Portal Pokemon
			</h2>
			<div className='flex flex-col w-full'>
				<div className='flex justify-evenly flex-wrap gap-7 w-full px-3 pb-3 pt-6'>
					{buttonsArray.map((button, index) => (
						<Link
							className='no-underline lg:w-3/12 w-full relative'
							href={`${button.url}`}
							key={index}>
							<button
								disabled={button.isDisabled}
								className={`p-2 md:p-4 w-full h-[35vh] rounded-lg border-none text-white no-underline bg-cover bg-center ease-in duration-150 enabled:active:scale-95 disabled:cursor-default group shadow-black/80 md:enabled:hover:shadow-lg shadow-lg md:enabled:hover:shadow-yellow-600 md:opacity-85 md:enabled:hover:opacity-100`}
								style={{ backgroundImage: `url(${button.image})` }}>
								<Image
									priority
									src={button.image}
									class='absolute inset-0 w-full h-full object-cover rounded-lg'
									alt={button.text}
								/>
								<div className='flex items-end justify-between w-full h-full flex-col'>
									{!button.isDisabled && (
										<div
											className={`absolute top-4 transform py-2 px-6 rounded-md transition duration-150 ease-in sm:font-bold font-medium text-shadow-md shadow-lg shadow-black group-hover:shadow-black/60
											${button.typeText === 'Herramienta' && 'bg-teal-200 text-teal-700 '}
											${button.typeText === 'Juego' && 'bg-indigo-200 text-indigo-700 '}`}>
											<span>{button.typeText}</span>
										</div>
									)}
									{!button.isDisabled && (
										<div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-zinc-300/80 text-gray-700 p-1 w-full  transition duration-150  ease-in group-hover:bg-yellow-300 group-hover:text-yellow-800'>
											<span className='no-underline sm:font-bold font-semibold sm:text-lg text-base text-shadow-md'>
												{button.text}
											</span>
										</div>
									)}
								</div>
							</button>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
