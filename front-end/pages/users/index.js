import { useState, useEffect } from "react";

export default function Home() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:10000/users`);
      if (!response.ok) throw new Error("Failed to fetch users");
      setUsers(await response.json());
      setError(null);
    } catch (err) {
      setError(err.message || "Error fetching users");
    } 
  };

  const handleFormChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async () => {
    if (Object.values(form).some((field) => !field)) {
      setError("All fields are required");
      return;
    }
    try {
      const response = await fetch(`http://localhost:10000/createUsers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to create user");
      setForm({ name: "", email: "", password: "" });
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Error creating user");
    } 
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-10"></div>
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-8 relative z-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          User Management
        </h1>

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">
            Create a New User
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            {Object.keys(form).map((key, index) => (
              <div key={key} className="flex-1">
                <input
                  name={key}
                  type={key === "password" ? "password" : "text"}
                  value={form[key]}
                  onChange={handleFormChange}
                  placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                  className="w-full h-12 px-4 bg-gray-50 text-gray-800 rounded-full shadow-md border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            ))}
          </div>
          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleCreateUser}
              className="h-12 px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600 focus:outline-none flex items-center justify-center transition-transform transform hover:scale-105 disabled:opacity-50"
            >
              Create User
            </button>
            <button
              onClick={() => setForm({ username: '', email: '', password: '' })}
              className="h-12 px-6 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-full shadow-lg hover:shadow-xl hover:from-gray-600 hover:to-gray-800 focus:outline-none flex items-center justify-center transition-transform transform hover:scale-105"
            >
              Reset Form
            </button>
          </div>
        </div>
  
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            User List
          </h2>
        
            <div className="space-y-4">
              {users.map(({ user_id, username, email }) => (
                <div
                  key={user_id}
                  className="p-4 bg-gray-50 rounded-lg shadow border border-gray-200"
                >
                  <h3 className="text-lg font-bold text-gray-800">{username}</h3>
                  <p className="text-gray-600">{email}</p>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
  
}
