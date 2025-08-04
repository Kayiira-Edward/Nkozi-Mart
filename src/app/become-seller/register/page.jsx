// become-seller/register/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import ToastNotification from '../../components/ToastNotification'; // New: Import ToastNotification

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState('signup'); // 'signup' or 'login'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Updated fields for marketplace sellers
  const [countryCode, setCountryCode] = useState('+256'); // Changed default to Uganda
  const [phoneNumber, setPhoneNumber] = useState('');
  const [brandName, setBrandName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');

  // New: State for managing the toast notification
  const [toast, setToast] = useState({
    message: "",
    type: "info",
    isVisible: false,
  });

  // Effect to reset form fields when mode changes
  useEffect(() => {
    // Clear all form fields and password strength feedback when toggling mode
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPasswordStrength('');
    setCountryCode('+256'); // Reset country code to default
    setPhoneNumber('');
    setBrandName('');
    setProductCategory('');
    setBusinessDescription('');
    setToast({ ...toast, isVisible: false }); // Dismiss toast on mode change
  }, [mode]);

  // Function to check password strength
  const checkPasswordStrength = (pwd) => {
    if (pwd.length === 0) {
      setPasswordStrength('');
      return;
    }
    let strength = 0;
    if (pwd.length >= 8) strength += 1; // Min length
    if (/[A-Z]/.test(pwd)) strength += 1; // Uppercase
    if (/[a-z]/.test(pwd)) strength += 1; // Lowercase
    if (/[0-9]/.test(pwd)) strength += 1; // Numbers
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1; // Special characters

    if (strength <= 2) {
      setPasswordStrength('Weak');
    } else if (strength <= 4) {
      setPasswordStrength('Medium');
    } else {
      setPasswordStrength('Strong');
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (mode === 'signup') {
      checkPasswordStrength(newPassword);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setToast({
          message: 'Passwords do not match.',
          type: 'error',
          isVisible: true,
        });
        return;
      }
      if (passwordStrength !== 'Strong' && password.length > 0) {
        setToast({
          message: 'Please choose a stronger password.',
          type: 'error',
          isVisible: true,
        });
        return;
      }

      // Create a mock seller profile to be stored in localStorage
      const newSellerProfile = {
        id: 'brin-mart-12345', // In a real app, this would be a unique ID from a database
        shopName: brandName,
        whatsapp: `${countryCode}${phoneNumber}`,
        description: businessDescription,
        location: 'Kampala', // Mock location
        productCategory: productCategory,
      };

      // Save the seller profile and login state to localStorage
      localStorage.setItem('sellerProfile', JSON.stringify(newSellerProfile));
      localStorage.setItem('currentSellerId', newSellerProfile.id);

      // Show success message and redirect
      setToast({
        message: 'Registration successful! Redirecting to your dashboard...',
        type: 'success',
        isVisible: true,
      });

      setTimeout(() => {
        router.push('/seller');
      }, 2000);

    } else { // Login mode
      // This is a demo login; in a real app, you'd verify credentials
      // For now, we'll just redirect to the seller dashboard
      setToast({
        message: 'Login successful! Redirecting to dashboard...',
        type: 'success',
        isVisible: true,
      });

      localStorage.setItem('currentSellerId', 'brin-mart-12345'); // Simulate login

      setTimeout(() => {
        router.push('/seller');
      }, 2000);
    }
  };

  const getHeading = () => {
    switch (mode) {
      case 'signup':
        return 'Join ShopLink Sellers';
      case 'login':
        return 'Login to Your Account';
      default:
        return 'Welcome!';
    }
  };

  const getSubheading = () => {
    switch (mode) {
      case 'signup':
        return 'Sell amazing local products and deals.';
      case 'login':
        return 'Access your ShopLink account.';
      default:
        return 'Choose your path.';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50 lg:flex-row">
      {/* Left Section (Marketing/Illustration) - Visible only on larger screens */}
      <div className="relative items-center justify-center hidden p-8 overflow-hidden text-white lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 rounded-r-3xl">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/assets/images/one.jpg"
            alt="ShopLink Marketplace Background"
            layout="fill"
            objectFit="cover"
            className="filter grayscale"
          />
        </div>
        <div className="relative z-10 max-w-lg text-center">
          <div className="mb-6">
            <span className="text-4xl">
              {mode === 'signup' ? '🛒✨' : '👋🛍️'}
            </span>
          </div>
          <h1 className="mb-4 text-5xl font-extrabold leading-tight">
            {mode === 'signup' ? (
              <>Become a Seller with ShopLink!</>
            ) : (
              <>Welcome Back!</>
            )}
          </h1>
          <p className="mb-8 text-lg text-green-200">
            {mode === 'signup' ? (
              <>Expand your business and reach more local customers through WhatsApp.</>
            ) : (
              <>Continue managing your ShopLink experience.</>
            )}
          </p>
          <div className="flex items-center justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-xl text-yellow-400">★</span>
            ))}
            <span className="text-sm text-green-200">
              {mode === 'signup' ? 'Join thousands of successful sellers!' : 'Trusted by thousands of users.'}
            </span>
          </div>
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="flex items-center justify-center flex-1 p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md p-6 bg-white shadow-xl sm:p-8 rounded-2xl lg:rounded-3xl">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center mb-6 text-sm text-gray-500 transition hover:text-gray-700"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>

          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            {getHeading()}
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            {getSubheading()}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Signup Fields */}
            {mode === 'signup' && (
              <>
                <div>
                  <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                    Your Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-4 py-2 transition duration-200 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                {/* WhatsApp Phone Number Field */}
                <div>
                  <label htmlFor="phoneNumber" className="block mb-1 text-sm font-medium text-gray-700">
                    WhatsApp Phone Number<span className="text-red-500">*</span>
                  </label>
                  <div className="flex border border-gray-300 rounded-lg focus-within:ring-green-500 focus-within:border-green-500">
                    <select
                      id="countryCode"
                      name="countryCode"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-3 py-2 text-sm border-r border-gray-300 rounded-l-lg outline-none bg-gray-50"
                    >
                      <option value="+254">+254 (Kenya)</option>
                      <option value="+256">+256 (Uganda)</option>
                      <option value="+234">+234 (Nigeria)</option>
                      <option value="+255">+255 (Tanzania)</option>
                      <option value="+250">+250 (Rwanda)</option>
                      <option value="+211">+211 (South Sudan)</option>
                      <option value="+27">+27 (South Africa)</option>
                      <option value="+237">+237 (Cameroon)</option>
                      <option value="+251">+251 (Ethiopia)</option>
                      <option value="+20">+20 (Egypt)</option>
                    </select>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g., 712345678"
                      className="flex-1 w-full px-4 py-2 transition duration-200 bg-white rounded-r-lg outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Brand Name Field */}
                <div>
                  <label htmlFor="brandName" className="block mb-1 text-sm font-medium text-gray-700">
                    Brand Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="brandName"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g., ShopLink Store"
                    className="w-full px-4 py-2 transition duration-200 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                {/* Product Category Field */}
                <div>
                  <label htmlFor="productCategory" className="block mb-1 text-sm font-medium text-gray-700">
                    Product Category<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="productCategory"
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    placeholder="e.g., Electronics, Fashion, Groceries"
                    className="w-full px-4 py-2 transition duration-200 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                {/* Business Description Field */}
                <div>
                  <label htmlFor="businessDescription" className="block mb-1 text-sm font-medium text-gray-700">
                    Business Description (optional)
                  </label>
                  <textarea
                    id="businessDescription"
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="Tell us a little about your business and products."
                    rows="3"
                    className="w-full px-4 py-2 transition duration-200 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </>
            )}

            {/* Email field (common to all modes) */}
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Email Address<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 transition duration-200 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            {/* Password field (common to all modes) */}
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 pr-10 transition duration-200 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {mode === 'signup' && password.length > 0 && (
                <p className={`mt-1 text-xs font-semibold ${
                  passwordStrength === 'Strong' ? 'text-green-600' :
                  passwordStrength === 'Medium' ? 'text-orange-500' :
                  'text-red-600'
                }`}>
                  Password Strength: {passwordStrength}
                </p>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
                  Confirm Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 pr-10 transition duration-200 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {password !== confirmPassword && confirmPassword.length > 0 && (
                  <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
                )}
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-600">
                  <input type="checkbox" className="mr-2 text-green-600 rounded form-checkbox" />
                  Remember me
                </label>
                <a href="#" className="text-green-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 font-semibold text-white transition duration-200 bg-green-600 rounded-lg shadow-md hover:bg-green-700"
            >
              {mode === 'signup' ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          {/* Toggle between the two modes */}
          <div className="mt-6 space-y-2 text-sm text-center text-gray-600">
            {mode === 'signup' ? (
              <p>Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-medium text-green-600 hover:underline"
                >
                  Log in
                </button>
              </p>
            ) : (
              <p>Don’t have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="font-medium text-green-600 hover:underline"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>

          <p className="mt-6 text-sm text-center text-gray-600">
            By registering, you agree to ShopLink's <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onDismiss={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
