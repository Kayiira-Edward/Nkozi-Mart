'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa'; // For Google sign-in icon

// Import the shared Firebase instances
import { auth } from '@/app/firebase/config';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/auth?mode=redirect'); // Redirect to AuthRedirector
        } catch (err) {
            setError('Failed to sign in. Please check your email and password.');
            console.error('Login Error:', err.message);
        } finally {
            setLoading(false);
        }
    };

    // Placeholder for Google Sign-in (requires Firebase Google Auth setup)
    const handleGoogleSignIn = () => {
        setError('Google Sign-in not yet implemented.');
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
                        <h1 className="mb-4 text-4xl font-extrabold">ShopLink</h1>
                        <p className="mb-6 text-lg">Your local marketplace for amazing products.</p>
                        <p className="text-sm">Join our network of sellers and connect with customers!</p>
                    </div>
                    <div className="relative z-10 mt-8">
                        <p className="text-sm">Don't have an account?</p>
                        <Link href="/auth?mode=register" className="font-semibold text-white hover:underline">
                            Register Here
                        </Link>
                    </div>
                </div>

                {/* Right Section - Login Form */}
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
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
                                placeholder="Enter password"
                            />
                        </div>
                        {error && <p className="text-sm text-center text-red-600">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-semibold text-white bg-[#2edc86] hover:bg-[#25b36b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2edc86] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Signing In...' : 'Sign In →'}
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
            </div>
        </div>
    );
}
