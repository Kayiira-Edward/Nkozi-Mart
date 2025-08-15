
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';
import { Loader2 } from 'lucide-react';

// Assuming 'auth' and 'ToastNotification' are correctly imported from your project files.
import { auth } from '@/app/firebase/config';
import ToastNotification from "@/app/components/ToastNotification";

// This is the separate component for the Forgot Password form.
// It's rendered conditionally within the main component.
const ForgotPasswordForm = ({ onBackToLogin, setToast }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Function to handle the password reset process using Firebase.
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!auth) {
            setToast({ message: 'Authentication service is not available.', type: 'error', isVisible: true });
            setLoading(false);
            console.error('Password Reset Error: Firebase auth object is null.');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setToast({ message: `A password reset link has been sent to ${email}.`, type: 'success', isVisible: true });
            setEmail('');
            // After sending the link, automatically switch back to the login form.
            setTimeout(() => onBackToLogin(), 3000);
        } catch (error) {
            setToast({ message: `Failed to send reset email: ${error.message}`, type: 'error', isVisible: true });
            console.error('Password Reset Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center p-8 md:w-1/2 sm:p-12 lg:p-16">
            <h2 className="mb-8 text-4xl font-bold text-center text-gray-800">Forgot Password?</h2>
            <p className="mb-6 text-center text-gray-600">Enter your email and we'll send you a link to reset your password.</p>
            <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                    <label htmlFor="email-reset" className="block mb-2 text-sm font-medium text-gray-700">Email address</label>
                    <input
                        type="email"
                        id="email-reset"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
                        placeholder="Enter your email"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-semibold text-white bg-[#2edc86] hover:bg-[#25b36b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2edc86] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : 'Send Reset Link →'}
                </button>
            </form>
            <div className="mt-8 text-center">
                <a href="#" className="font-semibold text-gray-700 hover:underline" onClick={onBackToLogin}>
                    ← Back to Login
                </a>
            </div>
        </div>
    );
};

// Main Login Component
export default function LoginForm() {
    // State for login form fields and UI state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // State for showing toast notifications
    const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });
    
    // State to toggle between the login and forgot password views
    const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);

    const router = useRouter();
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Function to handle the login process using Firebase.
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setToast({ ...toast, isVisible: false });
        setLoading(true);

        if (!auth) {
            setError('Firebase authentication service is not available.');
            setToast({ message: 'Authentication service is not available. Please try again later.', type: 'error', isVisible: true });
            setLoading(false);
            console.error('Login Error: Firebase auth object is null.');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setToast({ message: 'Login successful! Redirecting...', type: 'success', isVisible: true });
            setTimeout(() => {
                router.push('/auth?mode=redirect');
            }, 1500);
        } catch (err) {
            setError('Failed to sign in. Please check your email and password.');
            setToast({ message: `Login failed: ${err.message}`, type: 'error', isVisible: true });
            console.error('Login Error:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        setToast({ message: 'Google Sign-in not yet implemented.', type: 'info', isVisible: true });
        console.log('Google Sign-in clicked');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#f0f2f5]">
            <div className="flex flex-col w-full max-w-4xl overflow-hidden bg-white shadow-2xl md:flex-row rounded-3xl">
                {/* Left Section - Aesthetic Background */}
                <div className="relative flex flex-col items-center justify-between p-8 text-center text-white md:w-1/2 bg-gradient-to-br from-teal-400 to-green-600">
                    {/* Abstract shapes for design */}
                    <div className="absolute inset-0 opacity-20">
                        <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10%" cy="10%" r="15" fill="currentColor" className="text-emerald-300" />
                            <circle cx="90%" cy="20%" r="20" fill="currentColor" className="text-orange-300" />
                            <circle cx="20%" cy="80%" r="18" fill="currentColor" className="text-blue-300" />
                            <circle cx="70%" cy="90%" r="25" fill="currentColor" className="text-purple-300" />
                            <rect x="30%" y="40%" width="40" height="40" rx="10" fill="currentColor" className="text-yellow-300" />
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <h1 className="mb-4 text-4xl font-extrabold">Nkozi Mart</h1>
                        <p className="mb-6 text-lg">Your local marketplace for amazing products.</p>
                        <p className="text-sm">Join our network of sellers and connect with customers!</p>
                    </div>
                    <div className="relative z-10 mt-8">
                        <p className="text-sm">Don't have an account?</p>
                        {/* This link directs the user to a separate registration page as per your request. */}
                        <Link href="/auth?mode=register" className="font-semibold text-white hover:underline">
                            Register Here
                        </Link>
                    </div>
                </div>

                {/* Right Section - Login or Forgot Password Form */}
                {isForgotPasswordMode ? (
                    <ForgotPasswordForm onBackToLogin={() => setIsForgotPasswordMode(false)} setToast={setToast} />
                ) : (
                    <div className="flex flex-col justify-center p-8 md:w-1/2 sm:p-12 lg:p-16">
                        <h2 className="mb-8 text-4xl font-bold text-center text-gray-800">Sign In</h2>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all pr-10"
                                        placeholder="Enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <div className="flex justify-end mt-2">
                                    <button
                                        type="button"
                                        className="text-sm font-medium text-gray-700 hover:underline"
                                        onClick={() => setIsForgotPasswordMode(true)}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>
                            {error && <p className="text-sm text-center text-red-600">{error}</p>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-semibold text-white bg-[#2edc86] hover:bg-[#25b36b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2edc86] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : 'Sign In →'}
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 text-gray-500 bg-white">or</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleSignIn}
                            className="flex items-center justify-center w-full px-4 py-3 text-lg font-semibold text-gray-700 transition-colors bg-white border border-gray-300 shadow-sm rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                        >
                            <FaGoogle className="mr-3" /> Continue with Google
                        </button>
                    </div>
                )}
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
