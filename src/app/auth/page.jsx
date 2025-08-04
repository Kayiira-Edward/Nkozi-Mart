'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AuthPage() {
  const router = useRouter();
  // Set initial mode to 'signup'
  const [mode, setMode] = useState('signup'); // 'signup' or 'login'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Effect to reset form fields when mode changes
  useEffect(() => {
    // Clear all form fields and password strength feedback when toggling mode
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPasswordStrength('');
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

  // Simple message display for demo purposes
  const displayMessage = (message, type = 'info') => {
    const messageBox = document.createElement('div');
    messageBox.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    messageBox.textContent = message;
    document.body.appendChild(messageBox);
    setTimeout(() => {
      messageBox.remove();
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        displayMessage('Passwords do not match.', 'error');
        return;
      }
      if (passwordStrength !== 'Strong' && password.length > 0) {
        displayMessage('Please choose a stronger password.', 'error');
        return;
      }
      console.log('User Registration Data:', { name, email, password });
      displayMessage('Registration successful! Welcome to ShopLink!', 'success');
      // Redirect to the home page after successful signup
      router.push('/');
    } else { // Login mode
      console.log('User Login Data:', { email, password });

      // Check for admin credentials
      if (email === 'edwardbrin1@gmail.com' && password === 'Edward_75') {
        displayMessage('Admin login successful! Redirecting...', 'success');
        router.push('/admin');
      } else {
        displayMessage(`Login successful for ${email}!`, 'success');
        // Redirect to the home page for all other logins
        router.push('/');
      }
    }
  };

  const getHeading = () => {
    switch (mode) {
      case 'signup':
        return 'Join ShopLink';
      case 'login':
        return 'Login to Your Account';
      default:
        return 'Welcome!';
    }
  };

  const getSubheading = () => {
    switch (mode) {
      case 'signup':
        return 'Discover amazing local products and deals.';
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
            alt="WhatsApp Marketplace Background"
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
              <>Shop Local, Live Better with ShopLink!</>
            ) : (
              <>Welcome Back!</>
            )}
          </h1>
          <p className="mb-8 text-lg text-green-200">
            {mode === 'signup' ? (
              <>Find everything you need from trusted local shops, delivered to your door.</>
            ) : (
              <>Continue managing your ShopLink experience.</>
            )}
          </p>
          <div className="flex items-center justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-xl text-yellow-400">★</span>
            ))}
            <span className="text-sm text-green-200">
              {mode === 'signup' ? 'Thousands of happy shoppers!' : 'Trusted by thousands of users.'}
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
    </div>
  );
}