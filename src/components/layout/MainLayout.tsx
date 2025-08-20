
import React, { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { OnboardingForm } from '@/components/onboarding/OnboardingForm';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  skipOnboarding?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = false,
  requireAdmin = false,
  skipOnboarding = false,
}) => {
  const { user, loading, isAdmin } = useAuth();
  
  // Debug logging
  useEffect(() => {
    console.log('MainLayout rendered with:', { 
      user, 
      loading, 
      isAdmin, 
      requireAuth, 
      requireAdmin, 
      skipOnboarding,
      hasCompletedOnboarding: user?.hasCompletedOnboarding 
    });
  }, [user, loading, isAdmin, requireAuth, requireAdmin, skipOnboarding]);
  
  // Show loading state
  if (loading) {
    console.log('MainLayout: Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-brand-600 mx-auto flex items-center justify-center">
            <span className="text-white font-bold">E</span>
          </div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Check authentication if required
  if (requireAuth && !user) {
    console.log('MainLayout: Redirecting to login - no user');
    return <Navigate to="/login" replace />;
  }
  
  // Check admin access if required
  if (requireAdmin && !isAdmin) {
    console.log('MainLayout: Redirecting to dashboard - not admin');
    return <Navigate to="/dashboard" replace />;
  }

  // Check if user needs to complete onboarding
  if (requireAuth && user && !user.hasCompletedOnboarding && !skipOnboarding) {
    console.log('MainLayout: Showing onboarding form');
    return <OnboardingForm onComplete={() => window.location.href = '/dashboard'} />;
  }
  
  console.log('MainLayout: Rendering normal layout');
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
