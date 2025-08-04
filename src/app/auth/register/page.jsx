'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import Link from 'next/link';
import { FaStore } from 'react-icons/fa';

// NOTE: Replace these with your actual Firebase configuration details.
const firebaseConfig = {
    apiKey: "AIzaSyA9D0J9-54ramNXlonXrWRCuXH9Qjqt-d4",
    authDomain: "shoplink-7ba8f.firebaseapp.com",
    projectId: "shoplink-7ba8f",
    storageBucket: "shoplink-7ba8f.firebasestorage.app",
    messagingSenderId: "196720230323",
    appId: "1:196720230323:web:da0dc7146e2837e02295c6",
    measurementId: "G-8DV4D4WBLY"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [storeName, setStoreName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password || !storeName || !contactNumber) {
            setError('All fields are required.');
            return;
        }

        try {
            // Step 1: Create the user account in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Step 2: Create a seller profile document in Firestore
            await setDoc(doc(db, 'sellers', user.uid), {
                storeName: storeName,
                contactNumber: contactNumber,
                email: user.email,
                createdAt: new Date(),
            });

            // Step 3: Redirect to the seller dashboard
            router.push('/seller');

        } catch (err) {
            setError('Failed to register. Please try again.');
            console.error('Registration Error:', err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
                <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Become a Seller</h2>
                <p className="mb-6 text-sm text-center text-gray-500">
                    Create a new account and set up your shop profile.
                </p>
                <form onSubmit={handleRegister} className="space-y-6">
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Store Name</label>
                        <input
                            type="text"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            required
                            className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">WhatsApp Contact Number</label>
                        <input
                            type="tel"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            required
                            className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {error && <p className="text-sm text-center text-red-600">{error}</p>}
                    <button
                        type="submit"
                        className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-yellow-500 border border-transparent rounded-md shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                    >
                        <FaStore className="mr-2" /> Register as a Seller
                    </button>
                </form>
                <div className="mt-6 text-sm text-center">
                    <p>Already have an account? <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
}
