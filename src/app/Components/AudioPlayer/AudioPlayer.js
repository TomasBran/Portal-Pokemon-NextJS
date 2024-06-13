import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ audioSrc, shouldPlay, volume }) => {
	const audioRef = useRef(null);

	useEffect(() => {
		if (shouldPlay && audioSrc) {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
			}

			const audio = new Audio(audioSrc);
			audio.loop = false;
			audio.volume = volume;
			audio
				.play()
				.then(() => {})
				.catch((error) => {
					console.error('Error playing audio:', error);
				});

			audioRef.current = audio;
		}
	}, [shouldPlay, audioSrc]);

	return <div></div>;
};

export default AudioPlayer;
