
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, Award, BookOpen } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Exam, useExam } from '@/contexts/ExamContext';

interface ExamCardProps {
  exam: Exam;
  userCompleted?: boolean;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, userCompleted = false }) => {
  const navigate = useNavigate();
  const { subjects } = useExam();
  const subject = subjects.find(s => s.id === exam.subjectId);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-scale-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold">{exam.title}</CardTitle>
          {exam.isActive ? (
            <Badge variant="default" className="bg-brand-500">Active</Badge>
          ) : (
            <Badge variant="outline" className="text-gray-500">Inactive</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-gray-600 mb-4 text-sm">{exam.description}</p>
        
        {subject && (
          <div className="flex items-center mb-3 text-sm text-gray-500">
            <BookOpen className="h-4 w-4 mr-1 text-brand-500" />
            <span>{subject.name}</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1 text-brand-500" />
            <span>{exam.questions.length} Questions</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-brand-500" />
            <span>{exam.duration} Minutes</span>
          </div>
          
          {userCompleted && (
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-1 text-brand-500" />
              <span>Completed</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          className="w-full bg-brand-600 hover:bg-brand-700 transition-colors"
          onClick={() => navigate(`/exams/${exam.id}`)}
        >
          {userCompleted ? 'View Results' : 'Start Exam'}
        </Button>
      </CardFooter>
    </Card>
  );
};
