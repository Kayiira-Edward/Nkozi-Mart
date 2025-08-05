'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LoginForm from '@/app/components/auth/LoginForm';
import RegisterForm from '@/app/components/auth/RegisterForm';
import AuthRedirector from '@/app/auth/AuthRedirector'; // This component will handle post-auth redirection

function AuthPageContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  // If the mode is 'redirect', render the AuthRedirector component
  if (mode === 'redirect') {
    return <AuthRedirector />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#F0F2F5]">
      {/* If mode is 'register', show the RegisterForm (for new sellers) */}
      {/* Otherwise, default to LoginForm */}
      {mode === 'register' ? (
        <RegisterForm />
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthPageContent />
    </Suspense>
  );
}
