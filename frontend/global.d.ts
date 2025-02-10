import "../global";

export {};

declare global {
  type ISortBy =
    | "name-asc"
    | "name-desc"
    | "rating-asc"
    | "rating-desc"
    | "ratingtotal-asc"
    | "ratingtotal-desc"
    | "price-asc"
    | "price-desc"
    | "";
}
