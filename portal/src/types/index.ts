export interface MenuItem {
  id: string;
  name: {
    en: string;
    am: string;
  };
  description: {
    en: string;
    am: string;
  };
  price: number;
  category: 'appetizers' | 'main-courses' | 'desserts' | 'drinks';
  ingredients: {
    en: string[];
    am: string[];
  };
  image: string;
  available: boolean;
}

export interface CartItem {
  id: string;
  quantity: number;
  menuItem: MenuItem;
}

export interface Order {
  serviceType: 'dine-in' | 'takeaway' | 'delivery';
  tableNumber?: string;
  phoneNumber: string;
  items: CartItem[];
  total: number;
  timestamp: string;
}

export type Language = 'en' | 'am';
export type Theme = 'light' | 'dark';
export type ServiceType = 'dine-in' | 'takeaway' | 'delivery';