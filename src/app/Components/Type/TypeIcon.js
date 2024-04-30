import Image from 'next/image';
import { typeLogos } from './TypeLogos';

const TypeIcon = ({ type }) => {
	return (
		<Image
			src={typeLogos[type.toLowerCase()]}
			alt={`${type} Logo`}
			className='h-[3.5vh] w-[3.5vh] '
		/>
	);
};

export default TypeIcon;
