
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Award, BarChart, UserCheck } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
                Ace Your Exams <br className="hidden md:block" />
                <span className="text-brand-600">Track Your Progress</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto md:mx-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
                An intelligent exam platform that helps you assess your knowledge, track performance, and improve your skills.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <Button 
                  className="bg-brand-600 hover:bg-brand-700 text-white py-6 px-8 text-lg"
                  onClick={() => navigate(user ? '/dashboard' : '/register')}
                >
                  {user ? 'Go to Dashboard' : 'Get Started'}
                </Button>
                <Button 
                  variant="outline" 
                  className="py-6 px-8 text-lg"
                  onClick={() => navigate('/exams')}
                >
                  Explore Exams
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="relative">
                <div className="relative z-10 bg-white rounded-lg shadow-xl p-4 md:p-8 border border-gray-100">
                  {/* Exam dashboard mockup */}
                  <div className="bg-gray-50 h-64 rounded-md border border-gray-200 p-4">
                    <div className="w-2/3 h-6 bg-brand-100 rounded-md mb-4"></div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-brand-200 mr-3"></div>
                        <div className="w-1/2 h-4 bg-gray-200 rounded-md"></div>
                      </div>
                      <div className="w-full h-16 bg-white rounded-md border border-gray-200"></div>
                      <div className="w-full h-16 bg-white rounded-md border border-gray-200"></div>
                      <div className="w-3/4 h-16 bg-white rounded-md border border-gray-200"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 -mt-6 -mr-6 h-64 w-64 bg-brand-100 rounded-full blur-3xl opacity-20 z-0"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 bg-brand-100 rounded-full blur-3xl opacity-20 z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose ExamRanger?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform offers everything you need to assess knowledge and track progress effectively.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Exams</h3>
              <p className="text-gray-600">
                Take exams on various subjects with well-crafted questions to test your knowledge.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-gray-600">
                Get immediate feedback and detailed analysis of your performance after each exam.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your improvement over time with detailed statistics and visualizations.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                <UserCheck className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fair Rankings</h3>
              <p className="text-gray-600">
                Compare your performance with peers and see where you stand in the rankings.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-brand-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:pr-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
                <p className="text-xl text-gray-600">
                  Join thousands of students who are improving their skills with ExamRanger.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-brand-600 hover:bg-brand-700 text-white py-6 px-8 text-lg"
                  onClick={() => navigate(user ? '/dashboard' : '/register')}
                >
                  {user ? 'Go to Dashboard' : 'Create Account'}
                </Button>
                <Button 
                  variant="outline" 
                  className="py-6 px-8 text-lg"
                  onClick={() => navigate('/login')}
                >
                  {user ? 'View Exams' : 'Sign In'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
