
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 bg-white border-t border-gray-100">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">E</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">ExamRanger</span>
            </div>
          </div>
          
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link to="/" className="text-sm text-gray-600 hover:text-brand-600 transition-colors">Home</Link>
            <Link to="/about" className="text-sm text-gray-600 hover:text-brand-600 transition-colors">About</Link>
            <Link to="/contact" className="text-sm text-gray-600 hover:text-brand-600 transition-colors">Contact</Link>
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-brand-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-gray-600 hover:text-brand-600 transition-colors">Terms of Service</Link>
          </div>
          
          <div className="text-sm text-gray-500">
            © {year} ExamRanger. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
