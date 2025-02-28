interface Hotel {
  id: number;
  name: string;
  city: string;
  price: number;
  images: { full: string }[];
  averageRating: number;
  ratingCount: number;
  payment: string;
  class: number;
  description: string;
}
