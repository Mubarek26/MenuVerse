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
   <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-md border border-gray-800 overflow-hidden flex flex-col w-full max-w-xs mx-auto">
  {/* Smaller Image */}
  <div className="relative">
    <img
      src={item.imageUrl}
      alt={item.name}
      className="w-full h-36 object-cover" // reduced height
      style={{ borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem' }}
    />
    {!item.isAvailable && (
      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
        <span className="text-white text-sm font-bold px-2 py-1 rounded-lg bg-opacity-80">
          Not Available
        </span>
      </div>
    )}
  </div>

  {/* Compact Content */}
  <div className="px-3 pt-3 pb-2 flex flex-col gap-1">
    {/* Category */}
    <span className="self-start px-2 py-0.5 bg-gray-700 text-teal-300 text-[10px] font-semibold rounded-full">
      {item.category}
    </span>

    {/* Name */}
    <h3 className="text-lg font-bold text-white leading-snug truncate">
      {item.name}
    </h3>

    {/* Short Description */}
    <p className="text-xs text-gray-400 line-clamp-2">
      {item.description}
    </p>

    {/* Price + Button inline */}
    <div className="flex items-center justify-between mt-2">
      <span className="text-base font-bold text-orange-400">
        {item.price} ETB
      </span>
      <button
        onClick={handleAddToCart}
        disabled={!item.isAvailable || isAdding}
        className={`px-3 py-1.5 rounded-lg font-medium text-sm flex items-center space-x-1 transition-all ${
          item.isAvailable
            ? isAdding
              ? "bg-green-500 text-white"
              : "bg-gradient-to-r from-teal-500 to-orange-500 text-white hover:shadow-md"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isAdding ? (
          <>
            <Check className="w-4 h-4" />
            <span>Added</span>
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            <span>Add</span>
          </>
        )}
      </button>
    </div>
  </div>
</div>

  );
};

export default MenuItem;
