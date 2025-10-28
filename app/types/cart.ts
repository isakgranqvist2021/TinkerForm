export interface CartItem {
  id: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}
