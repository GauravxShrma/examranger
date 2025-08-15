
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ExamCard } from '@/components/exams/ExamCard';
import { useExam } from '@/contexts/ExamContext';
import { useAuth } from '@/contexts/AuthContext';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ExamsList: React.FC = () => {
  const { exams, getUserResults } = useExam();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get completed exam IDs for the current user
  const completedExamIds = user
    ? getUserResults(user.id).map(result => result.examId)
    : [];
  
  // Filter exams based on search query and active status
  const filteredExams = exams
    .filter(exam => exam.isActive)
    .filter(exam => 
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  return (
    <MainLayout requireAuth>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Exams</h1>
            <p className="text-gray-600">Browse and take exams to test your knowledge</p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {filteredExams.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-100">
            <h2 className="text-xl font-medium text-gray-800 mb-2">No Exams Found</h2>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? `No exams match your search for "${searchQuery}"`
                : "There are no active exams available at the moment"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-brand-600 hover:underline"
              >
                Clear search
              </button>
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
