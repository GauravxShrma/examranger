
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useExam } from '@/contexts/ExamContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { User, Mail, Edit, Award, BarChart, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { getUserResults } = useExam();
  const navigate = useNavigate();
  
  // Get user results
  const userResults = user ? getUserResults(user.id) : [];
  
  // Calculate statistics
  const totalExams = userResults.length;
  const averageScore = userResults.length > 0
    ? Math.round(userResults.reduce((acc, result) => acc + result.percentage, 0) / userResults.length)
    : 0;
  const bestScore = userResults.length > 0
    ? Math.max(...userResults.map(result => result.percentage))
    : 0;
  const lowestScore = userResults.length > 0
    ? Math.min(...userResults.map(result => result.percentage))
    : 0;
  
  // Sort results by date (newest first)
  const sortedResults = [...userResults].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
  
  return (
    <MainLayout requireAuth>
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">
            View and manage your personal information and exam history
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden bg-white shadow-sm border border-gray-100">
              <div className="bg-gradient-to-r from-brand-600 to-brand-400 h-24"></div>
              <div className="px-6 pb-6">
                <div className="flex justify-center -mt-12 mb-4">
                  <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                    <div className="w-full h-full rounded-full bg-brand-100 flex items-center justify-center">
                      <span className="text-4xl font-bold text-brand-600">
                        {user?.name.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">
                  {user?.name || 'User Name'}
                </h2>
                <p className="text-gray-500 text-center mb-6">
                  {user?.role === 'admin' ? 'Administrator' : 'Student'}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-brand-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{user?.name || 'User Name'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-brand-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user?.email || 'email@example.com'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/edit-profile')}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* Statistics Card */}
            <Card className="mt-6 overflow-hidden bg-white shadow-sm border border-gray-100">
              <CardHeader>
                <CardTitle className="text-xl">My Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-brand-500 mr-3" />
                      <span className="text-gray-700">Exams Taken</span>
                    </div>
                    <span className="font-bold">{totalExams}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center">
                      <BarChart className="h-5 w-5 text-brand-500 mr-3" />
                      <span className="text-gray-700">Average Score</span>
                    </div>
                    <span className="font-bold">{averageScore}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-brand-500 mr-3" />
                      <span className="text-gray-700">Best Score</span>
                    </div>
                    <span className="font-bold">{bestScore}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-gray-500 mr-3" />
                      <span className="text-gray-700">Lowest Score</span>
                    </div>
                    <span className="font-bold">{lowestScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Exam History */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm border border-gray-100 h-full">
              <CardHeader>
                <CardTitle className="text-xl">My Exam History</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">All Exams</TabsTrigger>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="best">Best Performance</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="animate-fade-in">
                    {renderExamHistory(sortedResults, navigate)}
                  </TabsContent>
                  
                  <TabsContent value="recent" className="animate-fade-in">
                    {renderExamHistory(sortedResults.slice(0, 5), navigate)}
                  </TabsContent>
                  
                  <TabsContent value="best" className="animate-fade-in">
                    {renderExamHistory(
                      [...sortedResults].sort((a, b) => b.percentage - a.percentage),
                      navigate
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Helper function to render exam history
const renderExamHistory = (results: any[], navigate: any) => {
  if (results.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Exam History Yet</h3>
        <p className="text-gray-600 mb-4">
          You haven't taken any exams yet. Start now to build your history!
        </p>
        <Button 
          onClick={() => navigate('/exams')}
          className="bg-brand-600 hover:bg-brand-700"
        >
          Take an Exam
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div 
          key={result.id} 
          className="p-4 rounded-lg border border-gray-100 hover:border-brand-200 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">Exam ID: {result.examId}</h3>
              <p className="text-gray-500 text-sm">
                Completed on {new Date(result.completedAt).toLocaleDateString()} at {
                  new Date(result.completedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium 
              ${result.percentage >= 70 
                ? 'bg-green-100 text-green-800' 
                : result.percentage >= 50 
                ? 'bg-amber-100 text-amber-800' 
                : 'bg-red-100 text-red-800'
              }`}
            >
              {result.score}/{result.maxScore} ({result.percentage}%)
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm">
              {result.rank ? (
                <span className="flex items-center text-brand-600">
                  <Award className="h-4 w-4 mr-1" />
                  Rank: #{result.rank}
                </span>
              ) : (
                <span className="text-gray-500">Ranking not available</span>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/results/${result.id}`)}
            >
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Profile;
