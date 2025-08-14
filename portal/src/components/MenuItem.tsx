import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { MenuItem as MenuItemType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
interface MenuItemProps {
  item: MenuItemType;

}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const {  t } = useLanguage();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!item.isAvailable || isAdding) return;
    
    setIsAdding(true);
    addToCart(item);
    
    // Show feedback animation
    setTimeout(() => setIsAdding(false), 1000);
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {t('unavailable')}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {item.name}
          </h3>
          <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
            {item.price} {t('currency')}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>
{/*         
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('ingredients')}:
          </p>
          <div className="flex flex-wrap gap-1">
            {item.ingredients[language].slice(0, 3).map((ingredient, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
              >
                {ingredient}
              </span>
            ))}
            {item.ingredients[language].length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                +{item.ingredients[language].length - 3}
              </span>
            )}
          </div>
        </div> */}
        
        <button
          onClick={handleAddToCart}
          disabled={!item.isAvailable || isAdding}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
            item.isAvailable
              ? isAdding
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-teal-500 to-orange-500 text-white hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {isAdding ? (
            <>
              <Check className="w-5 h-5" />
              <span>{t('itemAdded')}</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>{t('addToCart')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MenuItem;