import { useState, useEffect } from 'react'

export default function useScreen(cb?: (...args: unknown[]) => void) {
	const [screen, setScreen] = useState<[number, number]>([innerWidth, innerHeight])

	useEffect(() => {
		if(cb) cb()
		window.addEventListener('resize', () => setScreen([innerWidth, innerHeight]))

		return () => {
			window.onresize = null;
		}
	}, [])
	return screen;
}