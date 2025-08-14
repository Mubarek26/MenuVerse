import React, { useState, useMemo,useEffect } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import MenuItem from './components/MenuItem';
import Cart from './components/Cart';
// import OrderForm from './components/OrderForm';
import OrderSummary from './components/OrderSummary';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { useLanguage } from './contexts/LanguageContext';
const apiUrl = import.meta.env.VITE_API_BASE_URL;
export type MenuItemType = {
  _id: string;
  category: string;
  name: Record<string, string>;
  description: Record<string, string>;
  ingredients: Record<string, string[]>;
  price: number;
  isAvailable: boolean;
  item: any;
  imageUrl: string;
  image: string; // Added property
  // add other properties as needed
};


const AppContent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuDataState, setMenuDataState] = useState<MenuItemType[]>([]); // use imported menuData as initial value
  const { language, t } = useLanguage();

  const categories = ['appetizers', 'main-courses', 'desserts', 'drinks'];

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${apiUrl}/menu`, {
          method: "GET"
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setMenuDataState(data.data?.menuItems || []);
      } catch (error) {
        console.error('Error in MenuItem component:', error);
      }
    }
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    return menuDataState.filter(item => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesSearch = !searchTerm || 
        item.name[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ingredients[language].some(ingredient => 
          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, language, menuDataState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header onCartToggle={() => setIsCartOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <div className="lg:col-span-1 space-y-6">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
            
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>

        <div className="mt-3 grid-cols-1 lg:grid-cols-4 gap-8">
       
       
          {/* Main Content - Menu Items */}
          <div className="lg:col-span-2">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {t('noResults')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3  gap-6">
                {filteredItems.map(item => (
                  <MenuItem key={item._id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar - Order Management */}
          <div className="lg:col-span-1 space-y-6">
            {/* <OrderForm /> */}
            <OrderSummary />
          </div>
        </div>
      </main>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CartProvider>
          <OrderProvider>
            <AppContent />
          </OrderProvider>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;