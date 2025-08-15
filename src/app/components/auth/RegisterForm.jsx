
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';

import { auth, db } from '@/app/firebase/config';
import ToastNotification from "@/app/components/ToastNotification";

// Define a list of common country codes.
const countryCodes = [
    { code: "+256", name: "Uganda" },
    { code: "+1", name: "USA" },
    { code: "+44", name: "UK" },
    { code: "+254", name: "Kenya" },
    // Add more country codes as needed
];

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [storeName, setStoreName] = useState('');
    const [contactCode, setContactCode] = useState('+256');
    const [contactNumber, setContactNumber] = useState('');
    const [error, setError] = useState('');
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });

    const router = useRouter();

    const validatePassword = (pwd) => {
        const errors = [];
        if (pwd.length < 8) {
            errors.push('Password must be at least 8 characters long.');
        }
        if (!/[A-Z]/.test(pwd)) {
            errors.push('Password must contain at least one uppercase letter.');
        }
        if (!/[a-z]/.test(pwd)) {
            errors.push('Password must contain at least one lowercase letter.');
        }
        if (!/[0-9]/.test(pwd)) {
            errors.push('Password must contain at least one number.');
        }
        if (!/[!@#$%^&*(),.?":{}|<>_]/.test(pwd)) {
            errors.push('Password must contain at least one special character.');
        }
        return errors;
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordErrors(validatePassword(newPassword));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setToast({ ...toast, isVisible: false });
        setLoading(true);

        if (!auth) {
            setError('Firebase authentication service is not available.');
            setToast({ message: 'Authentication service is not available. Please try again later.', type: 'error', isVisible: true });
            setLoading(false);
            console.error('Registration Error: Firebase auth object is null.');
            return;
        }

        if (!email || !password || !storeName || !contactNumber) {
            setError('All fields are required.');
            setToast({ message: 'All fields are required.', type: 'error', isVisible: true });
            setLoading(false);
            return;
        }

        const currentPasswordErrors = validatePassword(password);
        if (currentPasswordErrors.length > 0) {
            setPasswordErrors(currentPasswordErrors);
            setError('Please fix the password errors.');
            setToast({ message: 'Please fix the password errors.', type: 'error', isVisible: true });
            setLoading(false);
            return;
        }
        
        // NEW: Phone number validation
        if (contactNumber.startsWith('0')) {
            setError('Please enter the phone number without the leading zero (e.g., 772123456).');
            setToast({ message: 'Please enter the phone number without the leading zero.', type: 'error', isVisible: true });
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const fullPhoneNumber = `${contactCode}${contactNumber}`;
            
            // This is the FIX: Add 'uid' as an explicit field in the document.
            await setDoc(doc(db, 'sellers', user.uid), {
                uid: user.uid, // <-- The new, crucial line to add!
                storeName: storeName,
                whatsapp: fullPhoneNumber,
                email: user.email,
                createdAt: new Date(),
                isSeller: true,
            });

            setToast({ message: 'Registration successful! Redirecting...', type: 'success', isVisible: true });
            setTimeout(() => {
                router.push('/auth?mode=redirect');
            }, 1500);

        } catch (err) {
            setError('Failed to register. Please try again.');
            setToast({ message: `Registration failed: ${err.message}`, type: 'error', isVisible: true });
            console.error('Registration Error:', err.message);
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
                        <p className="text-sm">Start selling today and connect with customers!</p>
                    </div>
                    <div className="relative z-10 mt-8">
                        <p className="text-sm">Already have an account?</p>
                        <Link href="/auth?mode=login" className="font-semibold text-white hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Right Section - Register Form */}
                <div className="flex flex-col justify-center p-8 md:w-1/2 sm:p-12 lg:p-16">
                    <h2 className="mb-8 text-4xl font-bold text-center text-gray-800">Register Your Shop</h2>
                    <form onSubmit={handleRegister} className="space-y-6">
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
                                    onChange={handlePasswordChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all pr-10"
                                    placeholder="Set your password"
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
                            {passwordErrors.length > 0 && (
                                <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                                    {passwordErrors.map((err, index) => (
                                        <li key={index}>{err}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div>
                            <label htmlFor="storeName" className="block mb-2 text-sm font-medium text-gray-700">Store Name</label>
                            <input
                                type="text"
                                id="storeName"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
                                placeholder="e.g., My Awesome Shop"
                            />
                        </div>
                        <div>
                            <label htmlFor="contactNumber" className="block mb-2 text-sm font-medium text-gray-700">WhatsApp Contact Number</label>
                            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                                <select
                                    id="countryCode"
                                    value={contactCode}
                                    onChange={(e) => setContactCode(e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
                                >
                                    {countryCodes.map((country, index) => (
                                        <option key={index} value={country.code}>
                                            {country.code} ({country.name})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="tel"
                                    id="contactNumber"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
                                    placeholder="e.g., 7XXXXXXXX"
                                />
                            </div>
                            {/* NEW: Display a helpful message to the user */}
                            <p className="mt-2 text-sm text-gray-500">
                                Please enter your number without the leading zero (e.g., 772123456).
                            </p>
                        </div>
                        {error && <p className="text-sm text-center text-red-600">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading || passwordErrors.length > 0}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-semibold text-white bg-[#2edc86] hover:bg-[#25b36b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2edc86] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Registering...' : 'Register Shop →'}
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
            <ToastNotification
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onDismiss={() => setToast({ ...toast, isVisible: false })}
            />
        </div>
    );
}
