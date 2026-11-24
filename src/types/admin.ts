/* Shapes returned by the admin API (C4). Keep in sync with the backend. */
export interface AdminOrderItem {
  name: string;
  size: string;
  quantity: number;
  price: number;
}

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus?: string;
  items: AdminOrderItem[];
  shipping?: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  shippingCost: number;
  trackingNumber?: string;
  total: number;
  createdAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: string;
  createdAt: string;
}

export interface Subscriber {
  _id: string;
  email: string;
  active: boolean;
  createdAt: string;
}
