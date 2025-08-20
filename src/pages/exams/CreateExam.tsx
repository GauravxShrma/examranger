import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CreateExamForm } from '@/components/exams/CreateExamForm';
import { useNavigate } from 'react-router-dom';

const CreateExam: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/exams');
  };

  const handleCancel = () => {
    navigate('/exams');
  };

  return (
    <MainLayout requireAuth>
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create AI-Powered Exam</h1>
          <p className="text-gray-600">
            Generate a new exam with AI-created questions based on your subject syllabus. Simply select a subject and specify exam details!
          </p>
        </div>
        
        <CreateExamForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </MainLayout>
  );
};

export default CreateExam;
