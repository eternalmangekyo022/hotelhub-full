export {};

declare global {
  type Hotel = {
    id: number;
    name: string;
    price: number;
    city: string;
    payment: string;
    owner_id: number;
    coords: { x: number; y: number };
    class: number;
    description: string;
    thumb: string; //  image URL
    averageRating?: number; //  rating
    ratingCount?: number; // rating count
  };

  interface User {
    id: number;
    age: number;
    name: string;
  }

  interface Card {
    name: string;
    description: string;
    rating: number;
    link?: string;
    image: string;
    cuisine?: string;
  }

  interface Experience {
    author: string;
    text: string;
  }

  interface Person {
    name: string;
    position: string;
    img: string;
  }

  interface TimeLine {
    date: number;
    description: string;
  }
}
