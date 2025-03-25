import "../global";

export { };

declare global {
  type ISortBy =
    | "name"
    | "rating"
    | "ratingtotal"
    | "price"
    | "";
}
