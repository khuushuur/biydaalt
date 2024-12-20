import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // Get request
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:10000/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError(err.message || "An error occurred");
      }
    };

    fetchOrders();
  }, []);

  // Post request to create order
  const handleCreateOrder = async () => {
    if (!userId || !totalAmount || !status) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:10000/createOrders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: parseInt(userId, 10),
          total_amount: parseFloat(totalAmount),
          status: status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      // Reset form fields
      setUserId("");
      setTotalAmount("");
      setStatus("");
      setError(null);

      // Refresh orders list
      const fetchResponse = await fetch("http://localhost:10000/orders");
      const data = await fetchResponse.json();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Error creating order");
    }
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-500";
      case "shipped":
        return "text-blue-500";
      case "delivered":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-10"></div>
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-8 relative z-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Order Management
        </h1>
  
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">
            Create a New Order
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <input
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID"
                className="w-full h-12 px-4 bg-gray-50 text-gray-800 rounded-full shadow-md border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="Enter Total Amount"
                className="w-full h-12 px-4 bg-gray-50 text-gray-800 rounded-full shadow-md border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-12 px-4 bg-gray-50 text-gray-800 rounded-full shadow-md border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            <button
              onClick={handleCreateOrder}
              className="h-12 px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600 focus:outline-none flex items-center justify-center transition-transform transform hover:scale-105"
            >
              <Plus size={20} className="mr-2" />
              Create
            </button>
          </div>
          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        </div>
  
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Existing Orders
          </h2>
          {orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.order_id}
                  className="p-4 bg-gray-50 rounded-lg shadow border border-gray-200"
                >
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>User ID:</strong> {order.user_id}
                    </p>
                    <p className="text-lg font-semibold text-green-500">
                      Total: ${order.total_amount}
                    </p>
                    <p className={`${getStatusColor(order.status)} font-medium`}>
                      Status: {order.status}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.order_date).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
}
