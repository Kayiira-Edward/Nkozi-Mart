'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { FaUserPlus } from 'react-icons/fa';

// Import the shared Firebase auth instance
import { auth } from '@/app/firebase/config';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // On successful signup, redirect to home page
            router.push('/');
        } catch (err) {
            setError('Failed to create account. Please try again.');
            console.error('Signup Error:', err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
                <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Sign Up for ShopLink</h2>
                <form onSubmit={handleSignup} className="space-y-6">
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
                        className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <FaUserPlus className="mr-2" /> Create Buyer Account
                    </button>
                </form>
                <div className="mt-6 text-sm text-center">
                    <p>Already have an account? <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
}
