'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';

// Assuming you have shared Firebase instances
import { auth } from '@/app/firebase/config';

export default function AuthRedirector() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // If user is authenticated, they are a seller, redirect to dashboard
                router.push('/seller');
            } else {
                // If not authenticated, redirect to login page
                router.push('/auth?mode=login');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
                Redirecting...
            </div>
        );
    }

    return null;
}
