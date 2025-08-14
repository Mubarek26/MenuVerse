import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import DeliveryLocationMap from './DeliveryLocationMap';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, total } = useCart();
  const { language, t } = useLanguage();
  const [serviceType, setServiceType] = useState('Dine-In');
  const [tableNumber, setTableNumber] = useState<number | "">("");
  const [phone, setPhone] = useState("");
  
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  // const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (serviceType === 'Delivery' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          if (!location) setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }
  }, [serviceType, location]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('yourCart')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {t('cartEmpty')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.menuItem.imageUrl}
                        alt={item.menuItem.name[language]}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {item.menuItem.name[language]}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {item.menuItem.price} {t('currency')} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {items.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('subtotal')}:
                </span>
                <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                  {total} {t('currency')}
                </span>
              </div>
              {/* Order details below subtotal */}
              {/* <ServiceTypeAndDetails /> */}
            </div>
          )}
          {items.length > 0 && (
            <>
              {!showOrderDetails ? (
                <button
                  className="w-full mt-2 py-3 bg-gradient-to-r from-orange-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:from-orange-600 hover:to-teal-600 transition-all text-lg"
                  onClick={() => setShowOrderDetails(true)}
                >
                  Place Order
                </button>
              ) : (
                <div className="mt-6 relative bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 overflow-y-auto max-h-[80vh]">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 bg-transparent border-none"
                    onClick={() => setShowOrderDetails(false)}
                    title="Close"
                    style={{ lineHeight: 1 }}
                  >
                    &times;
                  </button>
                  <div className="flex gap-3 mb-4 justify-center">
                    {["Dine-In", "Takeaway", "Delivery"].map((type) => (
                      <button
                        key={type}
                        className={`px-5 py-2 rounded-full font-semibold border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-base ${
                          serviceType === type
                            ? 'bg-gradient-to-r from-orange-500 to-teal-500 text-white border-orange-500 scale-105'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setServiceType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">Table Number</label>
                    <select
                      className={`w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${serviceType !== 'Dine-In' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      value={tableNumber}
                      onChange={(e) => setTableNumber(Number(e.target.value))}
                      disabled={serviceType !== 'Dine-In'}
                    >
                      <option value="">{serviceType === 'Dine-In' ? 'Select table' : 'Table selection disabled'}</option>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    {serviceType !== 'Dine-In' && (
                      <p className="text-xs text-gray-400 mt-1">Table selection is only available for Dine-In orders.</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="+251 9XX XXX XXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  {serviceType === 'Delivery' && (
                    <div className="mb-4">
                      <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">Delivery Location</label>
                      <DeliveryLocationMap
                        location={location}
                        setLocation={setLocation}
                        userLocation={userLocation}
                      />
                    </div>
                  )}
                  <button
                    className="w-full mt-2 py-3 bg-gradient-to-r from-orange-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:from-orange-600 hover:to-teal-600 transition-all text-lg"
                    disabled={
                      !serviceType || (serviceType === 'Dine-In' && !tableNumber) || !phone
                    }
                    onClick={() => setShowConfirmation(true)}
                  >
                    Confirm Order
                  </button>
                  {showConfirmation && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Order Placed!</h2>
                        <p className="mb-6 text-gray-700 dark:text-gray-300">Your order has been successfully submitted. Thank you!</p>
                        <button
                          className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold shadow hover:bg-orange-600 transition-all"
                          onClick={() => { setShowConfirmation(false); setShowOrderDetails(false); }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;