'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { FaSignInAlt } from 'react-icons/fa';

// Import the shared Firebase instances
import { auth } from '@/app/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Redirect authenticated users to the home page
                router.push('/');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (err) {
            setError('Failed to sign in. Please check your email and password.');
            console.error('Login Error:', err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
                <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Login to ShopLink</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {error && <p className="text-sm text-center text-red-600">{error}</p>}
                    <button
                        type="submit"
                        className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <FaSignInAlt className="mr-2" /> Sign In
                    </button>
                </form>
                <div className="mt-6 text-sm text-center">
                    <p>Don't have an account? <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign Up</Link></p>
                    <p className="mt-2">Want to sell? <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">Become a Seller</Link></p>
                </div>
            </div>
        </div>
    );
}
