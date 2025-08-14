import React, { useState, useMemo } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import MenuItem from './components/MenuItem';
import Cart from './components/Cart';
import OrderForm from './components/OrderForm';
import OrderSummary from './components/OrderSummary';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { menuData } from './data/menuData';
import { useLanguage } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { language, t } = useLanguage();

  const categories = ['appetizers', 'main-courses', 'desserts', 'drinks'];

  const filteredItems = useMemo(() => {
    return menuData.filter(item => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesSearch = !searchTerm || 
        item.name[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ingredients[language].some(ingredient => 
          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, language]);

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
                  <MenuItem key={item.id} item={item} />
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