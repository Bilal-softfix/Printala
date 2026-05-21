export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  image: string;
  images?: string[];
  category: string;
  tags?: string[];
  sizes: Size[];
  type: "poster" | "split-poster";
  panels?: number; // 2, 3, 5 for split posters
  inStock: boolean;
  featured: boolean;
  bestseller?: boolean;
  isNew?: boolean;
  createdAt: string;
}

export interface Size {
  label: string;
  dimensions: string;
  priceModifier: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: Size;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface Category {
  name: string;
  slug: string;
  image: string;
  count: number;
  description: string;
}