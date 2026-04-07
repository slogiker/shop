export interface Review {
  username: string;
  rating: number;
  comment: string;
}

export interface Product {
  name: string;
  priceBTC: number;
  priceETH: number;
  image: string;
  description?: string;
  reviews?: Review[];
}
