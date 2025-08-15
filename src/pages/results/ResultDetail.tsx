
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ResultSummary } from '@/components/exams/ResultSummary';
import { ExamQuestion } from '@/components/exams/ExamQuestion';
import { useExam, ExamResult } from '@/contexts/ExamContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, Share, Award } from 'lucide-react';
import { toast } from 'sonner';

const ResultDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { results, getExamById } = useExam();
  const { user } = useAuth();
  
  const [result, setResult] = useState<ExamResult | undefined>(undefined);
  const [exam, setExam] = useState<any>(undefined);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Find the result and related exam
  useEffect(() => {
    if (id) {
      const foundResult = results.find(r => r.id === id);
      if (foundResult) {
        setResult(foundResult);
        const foundExam = getExamById(foundResult.examId);
        setExam(foundExam);
      }
    }
  }, [id, results, getExamById]);
  
  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Navigate to next question
  const goToNextQuestion = () => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Check if this result belongs to the current user
  const isUserResult = user && result && result.userId === user.id;
  
  // If result not found or doesn't belong to user
  if (!result || !exam || !isUserResult) {
    return (
      <MainLayout requireAuth>
        <div className="page-container">
          <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-100">
            <h2 className="text-xl font-medium text-gray-800 mb-2">
              {!result ? 'Result Not Found' : 'Unauthorized Access'}
            </h2>
            <p className="text-gray-600 mb-4">
              {!result 
                ? "The result you're looking for doesn't exist."
                : "You don't have permission to view this result."}
            </p>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-brand-600 hover:bg-brand-700"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Share result (mock function)
  const shareResult = () => {
    toast.success('Sharing is not implemented in this demo');
  };
  
  return (
    <MainLayout requireAuth>
      <div className="page-container">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.title} Results</h1>
            <p className="text-gray-600">Review your performance and see detailed feedback</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={shareResult}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              onClick={() => navigate('/exams')}
              className="bg-brand-600 hover:bg-brand-700"
            >
              <Award className="h-4 w-4 mr-2" />
              Take Another Exam
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="detailed">Question Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="animate-fade-in">
            <ResultSummary result={result} />
          </TabsContent>
          
          <TabsContent value="detailed" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Question navigation sidebar */}
              <div className="order-2 md:order-1 md:col-span-1">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
                      {exam.questions.map((_, index) => {
                        const isCorrect = result.answers[index] === exam.questions[index].correctAnswer;
                        
                        return (
                          <button
                            key={index}
                            className={`w-full aspect-square rounded-full flex items-center justify-center text-sm font-medium
                              ${
                                index === currentQuestionIndex
                                  ? 'ring-2 ring-offset-2 ring-brand-500'
                                  : ''
                              }
                              ${
                                isCorrect
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            onClick={() => setCurrentQuestionIndex(index)}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>
                    
                    <div className="flex justify-between mt-6 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-100 mr-1"></div>
                        <span>Correct</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-100 mr-1"></div>
                        <span>Incorrect</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Question detail */}
              <div className="order-1 md:order-2 md:col-span-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      Question {currentQuestionIndex + 1} of {exam.questions.length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ExamQuestion
                      question={exam.questions[currentQuestionIndex]}
                      selectedAnswer={result.answers[currentQuestionIndex]}
                      onAnswerSelect={() => {}}
                      questionNumber={currentQuestionIndex + 1}
                      showResult={true}
                      isCorrect={
                        result.answers[currentQuestionIndex] === 
                        exam.questions[currentQuestionIndex].correctAnswer
                      }
                    />
                    
                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={goToPreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={goToNextQuestion}
                        disabled={currentQuestionIndex === exam.questions.length - 1}
                      >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ResultDetail;
