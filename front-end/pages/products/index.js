import { useState, useEffect } from "react";

export default function ProductManagement() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  // Fetch products from the server
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:10000/products");
      const data = await response.json();
      setProducts(data);
    } catch {
      setError("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    const { name, description, price, stock } = form;

    if (!name || !description || !price || !stock) {
      setError("All fields are required");
      return;
    }

    try {
      await fetch("http://localhost:10000/createProducts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: name,
          description,
          price: +price,
          stock: +stock,
        }),
      });
      setForm({ name: "", description: "", price: "", stock: "" });
      setError("");
      fetchProducts();
    } catch {
      setError("Failed to create product");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-10"></div>
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-8 relative z-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Product Management
        </h1>

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">
            Create a New Product
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter Product Name"
                className="w-full h-12 px-4 bg-gray-50 text-gray-800 rounded-full shadow-md border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Enter Price"
                className="w-full h-12 px-4 bg-gray-50 text-gray-800 rounded-full shadow-md border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                min="0"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="Enter Stock"
                className="w-full h-12 px-4 bg-gray-50 text-gray-800 rounded-full shadow-md border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                min="0"
              />
            </div>
            <div className="flex justify-center w-full gap-4">
              <button
                onClick={handleSubmit}
                className="h-12 px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600 focus:outline-none flex items-center justify-center transition-transform transform hover:scale-105"
              >
                Add Product
              </button>
              <button
                onClick={() => setForm({ name: '', description: '', price: '', stock: '' })}
                className="h-12 px-6 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-full shadow-lg hover:shadow-xl hover:from-gray-600 hover:to-gray-800 focus:outline-none flex items-center justify-center transition-transform transform hover:scale-105"
              >
                Reset Form
              </button>
            </div>
            <div className="flex-1 w-full mt-4">
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter Product Description"
                className="w-full h-24 px-4 bg-gray-50 text-gray-800 rounded-md shadow-md border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center w-full mt-2">{error}</p>}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Product List
          </h2>
          {products.length === 0 ? (
            <p className="text-center text-gray-500">No products found</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.product_id}
                  className="p-4 bg-gray-50 rounded-lg shadow border border-gray-200"
                >
                  <h3 className="text-lg font-bold text-gray-800">
                    {product.product_name}
                  </h3>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-green-500 font-semibold">
                    Price: ${product.price}
                  </p>
                  <p className="text-yellow-500">Stock: {product.stock}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
}
