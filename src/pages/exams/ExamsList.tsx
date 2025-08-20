
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ExamCard } from '@/components/exams/ExamCard';
import { useExam } from '@/contexts/ExamContext';
import { useAuth } from '@/contexts/AuthContext';
import { Search, BookOpen, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ExamsList: React.FC = () => {
  console.log('ExamsList component is rendering!');
  
  const { exams, subjects, getUserResults } = useExam();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  
  console.log('ExamsList data:', { exams, subjects, user });
  
  // Debug logging
  useEffect(() => {
    console.log('ExamsList useEffect triggered with:', { exams, subjects, user });
  }, [exams, subjects, user]);
  
  // Get completed exam IDs for the current user
  const completedExamIds = user
    ? getUserResults(user.id).map(result => result.examId)
    : [];
  
  // Filter exams based on search query, subject, and active status
  const filteredExams = exams
    .filter(exam => exam.isActive)
    .filter(exam => selectedSubject === '' || exam.subjectId === selectedSubject)
    .filter(exam => 
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  console.log('Filtered exams:', filteredExams);
  
  // Add a simple fallback to ensure something is always rendered
  if (!user) {
    console.log('No user found, showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we load your data.</p>
        </div>
      </div>
    );
  }
  
  console.log('Rendering main ExamsList content');
  
  return (
    <MainLayout requireAuth>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Exams</h1>
            <p className="text-gray-600">Browse and take exams to test your knowledge</p>
          </div>
          
          <Button
            onClick={() => navigate('/exams/create')}
            className="bg-brand-600 hover:bg-brand-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Exam
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {subject.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {filteredExams.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-100">
            <h2 className="text-xl font-medium text-gray-800 mb-2">No Exams Found</h2>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? `No exams match your search for "${searchQuery}"`
                : "There are no exams available yet. Create your first exam with AI-generated questions!"
              }
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="text-brand-600 hover:underline"
              >
                Clear search
              </button>
            ) : (
              <Button
                onClick={() => navigate('/exams/create')}
                className="bg-brand-600 hover:bg-brand-700"
              >
                Create Your First Exam
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map(exam => (
              <ExamCard
                key={exam.id}
                exam={exam}
                userCompleted={completedExamIds.includes(exam.id)}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ExamsList;
