export {};

declare global {
	interface User {
		id: number
		age: number
		name: string
	}

	interface Card {
		name: string
		description: string
		rating: number
		link?: string
		image: string
		cuisine?: string
	}

	interface Experience {
		author: string
		text: string
	}

	interface Person {
		name: string
		position: string
		img: string
	}

	interface TimeLine {
		date: number
		description: string
	}
}