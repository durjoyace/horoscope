import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const [email, setEmail] = useState("");
  const [zodiacSign, setZodiacSign] = useState("aries");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          zodiacSign,
          smsOptIn: false,
        }),
      });

      const data = await response.json();
      setMessage(data.message || "Successfully signed up!");
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Daily Health Horoscope
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Select Your Zodiac Sign
            </label>
            <select
              value={zodiacSign}
              onChange={(e) => setZodiacSign(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="aries">Aries</option>
              <option value="taurus">Taurus</option>
              <option value="gemini">Gemini</option>
              <option value="cancer">Cancer</option>
              <option value="leo">Leo</option>
              <option value="virgo">Virgo</option>
              <option value="libra">Libra</option>
              <option value="scorpio">Scorpio</option>
              <option value="sagittarius">Sagittarius</option>
              <option value="capricorn">Capricorn</option>
              <option value="aquarius">Aquarius</option>
              <option value="pisces">Pisces</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {loading ? "Signing up..." : "Get My Daily Horoscope"}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md">
            {message}
          </div>
        )}

        <div className="mt-8">
          <img
            src="https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg"
            alt="Cosmic wellness illustration"
            className="w-full h-auto rounded-md"
          />
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;