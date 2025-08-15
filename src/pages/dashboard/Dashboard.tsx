
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentExamsCard } from '@/components/dashboard/RecentExamsCard';
import { Award, BarChart2, Clock, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { exams, getUserResults } = useExam();
  const navigate = useNavigate();
  
  // Get user results
  const userResults = user ? getUserResults(user.id) : [];
  
  // Calculate statistics
  const totalExams = exams.length;
  const completedExams = userResults.length;
  const averageScore = userResults.length > 0
    ? Math.round(userResults.reduce((acc, result) => acc + result.percentage, 0) / userResults.length)
    : 0;
  const bestScore = userResults.length > 0
    ? Math.max(...userResults.map(result => result.percentage))
    : 0;
  
  // Create exams map for RecentExamsCard
  const examsMap = exams.reduce((acc, exam) => {
    acc[exam.id] = exam.title;
    return acc;
  }, {} as {[key: string]: string});
  
  return (
    <MainLayout requireAuth>
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name || 'User'}
          </h1>
          <p className="text-gray-600">
            Here's an overview of your exam performance and progress.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Available Exams" 
            value={totalExams}
            icon={Clock}
          />
          <StatsCard 
            title="Completed Exams" 
            value={completedExams}
            description={`${Math.round((completedExams / totalExams) * 100) || 0}% completion rate`}
            icon={Award}
          />
          <StatsCard 
            title="Average Score" 
            value={`${averageScore}%`}
            trend={
              userResults.length > 1 
                ? { 
                    value: userResults[0].percentage - userResults[1].percentage, 
                    isPositive: userResults[0].percentage >= userResults[1].percentage 
                  }
                : undefined
            }
            icon={BarChart2}
          />
          <StatsCard 
            title="Best Score" 
            value={`${bestScore}%`}
            icon={Star}
          />
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Exams */}
          <div className="lg:col-span-2">
            <RecentExamsCard results={userResults} exams={examsMap} />
          </div>
          
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <Button 
                  className="w-full justify-start text-left bg-brand-600 hover:bg-brand-700"
                  onClick={() => navigate('/exams')}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Take New Exam
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={() => navigate('/profile')}
                >
                  <Award className="mr-2 h-4 w-4" />
                  View Your Progress
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={() => navigate('/rankings')}
                >
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Check Rankings
                </Button>
              </div>
              
              {completedExams === 0 && (
                <div className="mt-8 p-4 bg-brand-50 rounded-lg border border-brand-100">
                  <h3 className="font-medium text-brand-800 mb-2">Get Started</h3>
                  <p className="text-brand-700 text-sm mb-4">
                    You haven't taken any exams yet. Start now to track your progress!
                  </p>
                  <Button
                    className="w-full bg-brand-600 hover:bg-brand-700"
                    onClick={() => navigate('/exams')}
                  >
                    Take Your First Exam
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
