import { useState, useEffect } from "react";
import axios from "axios";
import { Star, Send } from "lucide-react";

export default function Reviews() {
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:10000/reviews");
        setReviews(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch reviews");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleCreateReview = async () => {
    if (!userId || !productId || !rating || !reviewText) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setIsLoading(true);
      await axios.post("http://localhost:10000/createReviews", {
        user_id: parseInt(userId, 10),
        product_id: parseInt(productId, 10),
        rating: parseInt(rating, 10),
        review_text: reviewText,
      });
      // Reset form fields
      setUserId("");
      setProductId("");
      setRating("");
      setReviewText("");
      setError(null);
      // Refetch reviews
      const response = await axios.get("http://localhost:10000/reviews");
      setReviews(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error creating review");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-10"></div>
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-8 relative z-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Reviews</h1>
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">
            Submit a Review
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <input
                type="number"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="Product ID"
                className="w-full h-12 px-4 bg-gray-50 text-gray-800 rounded-full shadow-md border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="User ID"
                className="w-full h-12 px-4 bg-gray-50 text-gray-800 rounded-full shadow-md border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full h-12 px-4 mt-4 bg-gray-50 text-gray-800 rounded-full shadow-md border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select Rating</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} {[...Array(num)].map(() => "★")}
              </option>
            ))}
          </select>
          <input
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review..."
            className="w-full h-24 px-4 mt-4 bg-gray-50 text-gray-800 rounded-md shadow-md border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          ></input>
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
          <button
            onClick={handleCreateReview}
            disabled={isLoading}
            className="w-full h-12 mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600 focus:outline-none flex items-center justify-center transition-transform transform hover:scale-105 disabled:opacity-50"
          >
            <Send size={20} className="mr-2" />
            Submit Review
          </button>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Reviews
          </h2>
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500">No reviews found</p>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.review_id}
                  className="bg-gray-50 rounded-lg p-5 shadow border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">User #{review.user_id}</p>
                    <div className="flex text-yellow-500">
                      {review.rating}
                    </div>
                  </div>
                  <p className="text-gray-900 mb-2">{review.review_text}</p>
                  <div className="text-sm text-gray-500">
                    Product #{review.product_id} • {new Date(review.created_at).toLocaleDateString()}
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
