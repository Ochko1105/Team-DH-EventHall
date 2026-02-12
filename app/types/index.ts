// /types/hall.ts
export interface Hall {
  _id?: string; // optional because MongoDB generates it
  name: string;
  location: string;
  capacity: string;
  rating: number;
  price: number;
  image: string;
}
