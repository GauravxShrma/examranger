
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = false,
  requireAdmin = false, 
}) => {
  const { user, loading, isAdmin } = useAuth();
  
  // Show loading state
  if (loading) {
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
    return <Navigate to="/login" replace />;
  }
  
  // Check admin access if required
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
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
