import React, { useState } from "react";
import { Plus, Check } from "lucide-react";
import type { MenuItem } from "../types";
import { useCart } from "../contexts/CartContext";

interface MenuItemProps {
  item: MenuItem;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!item.isAvailable || isAdding) return;
    setIsAdding(true);
    addToCart(item);
    setTimeout(() => setIsAdding(false), 1000);
    
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-lg border border-gray-800 overflow-hidden flex flex-col w-full max-w-sm mx-auto">
      {/* Large Food Image */}
      <div className="relative">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-56 object-cover"
          style={{ borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
        />
          {!item.isAvailable && (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <span className="text-white text-lg font-bold px-4 py-2 rounded-xl  bg-opacity-80">
        Not Available
      </span>
    </div>
  )}
      </div>
    
      {/* Card Content */}
      <div className="px-4 pt-4 pb-3 flex flex-col gap-2">
        {/* Category Tag */}
        <span className="self-start px-3 py-1 bg-gray-700 text-teal-300 text-xs font-semibold rounded-full mb-1 shadow-sm">
          {item.category}
        </span>
        {/* Dish Name */}
        <h3 className="text-xl font-extrabold text-white leading-tight tracking-tight mb-1">
          {item.name}
        </h3>
        {/* Description */}
        <p className="text-sm text-gray-300 font-medium mb-1">
          {item.description}
        </p>
        {/* Price */}
        <span className="text-lg font-bold text-orange-400 mb-2">
          {item.price} ETB
        </span>
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!item.isAvailable || isAdding}
          className={`w-full py-2 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 text-base mt-2 shadow-md ${
            item.isAvailable
              ? isAdding
                ? "bg-green-500 text-white"
                : "bg-gradient-to-r from-teal-500 to-orange-500 text-white hover:shadow-lg transform hover:scale-105"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isAdding ? (
            <>
              <Check className="w-5 h-5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MenuItem;
