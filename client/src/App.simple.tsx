import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ZodiacSign } from "@shared/types";
import { zodiacSigns } from "@/utils/zodiac";

// Main application component
function App() {
  const [email, setEmail] = useState("");
  const [zodiacSign, setZodiacSign] = useState<ZodiacSign>("aries");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPhoneField, setShowPhoneField] = useState(false);

  // Form submission handler
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
          firstName,
          lastName,
          phone: smsOptIn ? phone : undefined,
          smsOptIn,
          newsletterOptIn: true,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Successfully signed up!");
        // Reset form on success
        setEmail("");
        setFirstName("");
        setLastName("");
        setPhone("");
        setSmsOptIn(false);
      } else {
        setMessage(data.message || "Error signing up. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-900">HoroscopeHealth</h1>
          <nav>
            <button className="text-indigo-600 hover:text-indigo-800 font-medium">
              Log In
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-indigo-900 mb-4">
              Your Daily Health Horoscope
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Personalized wellness guidance aligned with your zodiac sign, delivered daily to your inbox.
            </p>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-4 text-indigo-900">
                Sign up for your free daily health horoscope
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      First Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="First Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Last Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email Address*
                  </label>
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
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Your Zodiac Sign*
                  </label>
                  <select
                    value={zodiacSign}
                    onChange={(e) => setZodiacSign(e.target.value as ZodiacSign)}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    {zodiacSigns.map((sign) => (
                      <option key={sign.sign} value={sign.sign}>
                        {sign.name} ({sign.dateRange})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="smsOptIn"
                    checked={smsOptIn}
                    onChange={(e) => {
                      setSmsOptIn(e.target.checked);
                      setShowPhoneField(e.target.checked);
                    }}
                    className="mr-2 h-4 w-4"
                  />
                  <label htmlFor="smsOptIn" className="text-sm text-gray-700">
                    Receive SMS alerts (optional)
                  </label>
                </div>

                {showPhoneField && (
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="+1 (123) 456-7890"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
                >
                  {loading ? "Signing up..." : "Get My Daily Horoscope"}
                </button>
              </form>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg"
                alt="Cosmic wellness illustration"
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Personalized Insights</p>
                    <p className="text-xs text-gray-500">Updated daily for your sign</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Display success/error message */}
      {message && (
        <div className="fixed top-4 right-4 max-w-md p-4 bg-white border-l-4 border-green-500 rounded shadow-md">
          <p>{message}</p>
          <button 
            onClick={() => setMessage("")} 
            className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Zodiac Signs Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-indigo-900">Find Your Sign</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {zodiacSigns.map((sign) => (
              <button
                key={sign.sign}
                onClick={() => setZodiacSign(sign.sign)}
                className={`flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition duration-200 ${
                  zodiacSign === sign.sign ? 'bg-indigo-50 ring-2 ring-indigo-300' : ''
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                  <span className="text-xl">{sign.symbol}</span>
                </div>
                <span className="font-medium">{sign.name}</span>
                <span className="text-xs text-gray-500">{sign.dateRange}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">HoroscopeHealth</h3>
              <p className="text-indigo-200 mt-2">
                Your daily wellness guide, aligned with the stars.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p>&copy; {new Date().getFullYear()} HoroscopeHealth. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default App;