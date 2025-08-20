
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentExamsCard } from '@/components/dashboard/RecentExamsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useExam } from '@/contexts/ExamContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  FileText, 
  Award, 
  Clock, 
  Plus, 
  Brain,
  Settings,
  Play
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { exams, subjects, results } = useExam();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalExams = exams.length;
  const totalSubjects = subjects.length;
  const totalResults = results.length;
  const userResults = user ? results.filter(r => r.userId === user.id) : [];
  const averageScore = userResults.length > 0 
    ? Math.round(userResults.reduce((sum, r) => sum + r.percentage, 0) / userResults.length)
    : 0;

  const recentExams = exams
    .filter(exam => exam.isActive)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const userSubjects = subjects.map(subject => ({
    ...subject,
    examCount: exams.filter(exam => exam.subjectId === subject.id).length
  }));

  return (
    <MainLayout requireAuth>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600">Manage your subjects, create exams, and track your progress</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/subjects')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manage Subjects</h3>
                  <p className="text-sm text-gray-600">Add or edit your subjects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/exams/create')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Brain className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create Exam</h3>
                  <p className="text-sm text-gray-600">Generate AI-powered exam</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/exams')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Play className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Take Exams</h3>
                  <p className="text-sm text-gray-600">Start practicing now</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/results')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">View Results</h3>
                  <p className="text-sm text-gray-600">Check your performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Subjects"
            value={totalSubjects}
            icon={BookOpen}
          />
          <StatsCard
            title="Available Exams"
            value={totalExams}
            icon={FileText}
          />
          <StatsCard
            title="Exams Taken"
            value={userResults.length}
            icon={Award}
          />
          <StatsCard
            title="Average Score"
            value={`${averageScore}%`}
            icon={Clock}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your Subjects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Your Subjects
              </CardTitle>
              <CardDescription>
                Manage your subjects and create exams for each one
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userSubjects.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects yet</h3>
                  <p className="text-gray-600 mb-4">
                    Add your first subject to start creating AI-powered exams
                  </p>
                  <Button onClick={() => navigate('/admin/subjects')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Subject
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userSubjects.map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{subject.name}</h4>
                        <p className="text-sm text-gray-600">
                          {subject.syllabus.length > 100 
                            ? `${subject.syllabus.substring(0, 100)}...` 
                            : subject.syllabus
                          }
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {subject.examCount} exam{subject.examCount !== 1 ? 's' : ''} created
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate('/admin/subjects')}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => navigate('/exams/create')}
                        >
                          Create Exam
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Exams
              </CardTitle>
              <CardDescription>
                Your recently created or available exams
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentExams.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No exams yet</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first exam with AI-generated questions
                  </p>
                  <Button onClick={() => navigate('/exams/create')}>
                    <Brain className="mr-2 h-4 w-4" />
                    Create Your First Exam
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentExams.map((exam) => {
                    const subject = subjects.find(s => s.id === exam.subjectId);
                    return (
                      <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{exam.title}</h4>
                          <p className="text-sm text-gray-600">{exam.description}</p>
                          {subject && (
                            <p className="text-xs text-gray-500 mt-1">
                              Subject: {subject.name} • {exam.questions.length} questions • {exam.duration} min
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/exams/${exam.id}`)}
                        >
                          Take Exam
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
