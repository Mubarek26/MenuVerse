import React, { useState, useEffect } from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useLanguage } from "../contexts/LanguageContext";
import DeliveryLocationMap from "./DeliveryLocationMap";
const apiUrl = import.meta.env.VITE_API_BASE_URL;
import { ClipLoader } from "react-spinners";
interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { language, t } = useLanguage();

  const [serviceType, setServiceType] = useState("Dine-In");
  const [tableNumber, setTableNumber] = useState<number | "">("");
  const [phone, setPhone] = useState("");

  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 
  // const mapRef = useRef(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Validate order details before confirming
  const validateOrderDetails = () => {
    if (!serviceType) return false;
    if (serviceType === "Dine-In" && !tableNumber) return false;
    if (!phone) return false;
    if (serviceType === "Delivery" && !userLocation ||!location) return false;
    return true;
  };

  const handleConfirmOrder = async () => {
    if (!validateOrderDetails()) return;
    // Here you can handle the order confirmation logic, e.g., sending to backend
    const orderDetails = {
      items,
      // totalPrice:total,
      orderType: serviceType,
      tableNumber,
      phoneNumber: phone,
      location,
      notes: specialInstructions,
    };
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      // const data = await response.json();
      // console.log("Order confirmed:", data);
      setIsLoading(false);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  useEffect(() => {
    if (serviceType === "Delivery" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }
  }, [serviceType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div
        style={{
          // For mobile: slide up from bottom
          // For desktop/tablet: slide in from right
          willChange: "transform",
        }}
        className="absolute  transition-transform duration-300 right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("yourCart")}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <div
            className="flex-1 overflow-y-auto p-6"
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("cartEmpty")}
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
                          {item.menuItem.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {item.menuItem.price} {t("currency")} ×{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="p-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
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
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t("Total Price")}:
                    </span>
                    <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                      {total} {t("currency")}
                    </span>
                  </div>
                  {/* Order details below subtotal */}
                  {/* <ServiceTypeAndDetails /> */}
                </div>
              </div>
            )}
          </div>

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
                    className="absolute text-gray-600 dark:text-gray-300 p-1 rounded-xl 
  hover:bg-white/20 dark:hover:bg-white/10 
  backdrop-blur-sm
  transition-all duration-200 ease-in-out
  top-6 right-5 text-3xl font-bold z-10 bg-transparent border-none"
                    onClick={() => setShowOrderDetails(false)}
                    title="Close"
                    style={{ lineHeight: 1 }}
                  >
                    &times;
                  </button>
                  {/* <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button> */}
                  <div className="flex gap-3 mb-4 justify-start">
                    {["Dine-In", "Takeaway", "Delivery"].map((type) => (
                      <button
                        key={type}
                        className={`px-3 py-1 rounded-full font-semibold border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-base ${
                          serviceType === type
                            ? "bg-gradient-to-r from-orange-500 to-teal-500 text-white border-orange-500 scale-105"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => setServiceType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      Table Number
                    </label>
                    <select
                      className={`w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                        serviceType !== "Dine-In"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      value={tableNumber}
                      onChange={(e) => setTableNumber(Number(e.target.value))}
                      disabled={serviceType !== "Dine-In"}
                    >
                      <option value="">
                        {serviceType === "Dine-In"
                          ? "Select table"
                          : "Table selection disabled"}
                      </option>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(
                        (num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        )
                      )}
                    </select>
                    {serviceType !== "Dine-In" && (
                      <p className="text-xs text-gray-400 mt-1">
                        Table selection is only available for Dine-In orders.
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="+251 9XX XXX XXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  {serviceType === "Delivery" && (
                    <div className="mb-4">
                      <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                        Delivery Location
                      </label>
                      <DeliveryLocationMap
                        userLocation={userLocation}
                        location={location}
                        setLocation={setLocation}
                      />
                    </div>
                  )}
                  {/* Note / Special Instructions */}
                  <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      Special Instructions( optional )
                    </label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 border-gray-200 dark:border-gray-600"
                      placeholder="Add any notes or instructions for your order or you can leave it empty"
                      rows={3}
                    />
                  </div>
                  <button
                    className="w-full mt-2 py-3 bg-gradient-to-r from-orange-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:from-orange-600 hover:to-teal-600 transition-all text-lg"
                    disabled={
                      !serviceType ||
                      (serviceType === "Dine-In" && !tableNumber) ||
                      !phone
                    }
                    onClick={() => handleConfirmOrder()}
                  >
                    Confirm Order
                  </button>
                  {isLoading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                      <ClipLoader color="#ffffff" size={50} />
                    </div>
                  )}
                  {showConfirmation && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                          Order Placed!
                        </h2>
                        <p className="mb-6 text-gray-700 dark:text-gray-300">
                          Your order has been successfully submitted. Thank you!
                        </p>
                        <button
                          className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold shadow hover:bg-orange-600 transition-all"
                          onClick={() => {
                            setShowConfirmation(false);
                            setShowOrderDetails(false);
                            clearCart(); // Clear the cart after order confirmation
                            onClose();
                          }}
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
