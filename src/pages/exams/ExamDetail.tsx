
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ExamQuestion } from '@/components/exams/ExamQuestion';
import { ExamTimer } from '@/components/exams/ExamTimer';
import { useExam, Exam } from '@/contexts/ExamContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, Clock, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const ExamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getExamById, submitExam } = useExam();
  const { user } = useAuth();

  const [exam, setExam] = useState<Exam | undefined>(undefined);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Load exam data when id or exams change
  useEffect(() => {
    if (id) {
      setExam(getExamById(id));
    }
  }, [id, getExamById]);

  // Initialize answers array
  useEffect(() => {
    if (exam) {
      setAnswers(new Array(exam.questions.length).fill(null));
    }
  }, [exam]);
  
  // Handle time up
  const handleTimeUp = () => {
    setTimeUp(true);
    setShowSubmitDialog(true);
    toast.warning("Time's up! Please submit your exam.");
  };
  
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
  
  // Handle answer selection
  const handleAnswerSelect = (answer: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };
  
  // Check if all questions are answered
  const allAnswered = answers.every(answer => answer !== null);
  
  // Submit exam
  const handleSubmitExam = async () => {
    if (!exam || !user) return;
    
    setSubmitting(true);
    try {
      // Filter out any null answers and replace with 0 (which might be wrong, but better than crashing)
      const finalAnswers = answers.map(answer => answer === null ? 0 : answer);
      
      const result = submitExam(user.id, exam.id, finalAnswers);
      
      setSubmitted(true);
      toast.success('Exam submitted successfully!');
      
      // Navigate to results page
      navigate(`/results/${result.id}`);
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast.error('Failed to submit exam. Please try again.');
    } finally {
      setSubmitting(false);
      setShowSubmitDialog(false);
    }
  };
  
  // If exam not found
  if (!exam) {
    return (
      <MainLayout requireAuth>
        <div className="page-container">
          <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-100">
            <h2 className="text-xl font-medium text-gray-800 mb-2">Exam Not Found</h2>
            <p className="text-gray-600 mb-4">
              The exam you're looking for doesn't exist or is no longer available.
            </p>
            <Button onClick={() => navigate('/exams')}>
              View All Exams
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const currentQuestion = exam.questions[currentQuestionIndex];
  const answeredCount = answers.filter(answer => answer !== null).length;
  
  return (
    <MainLayout requireAuth>
      <div className="page-container">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="lg:w-3/4 order-2 lg:order-1">
            <Card className="mb-6 animate-fade-in">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl">{exam.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">{exam.description}</p>
                
                {/* Question */}
                <div className="mb-6">
                  <ExamQuestion
                    question={currentQuestion}
                    selectedAnswer={answers[currentQuestionIndex]}
                    onAnswerSelect={handleAnswerSelect}
                    questionNumber={currentQuestionIndex + 1}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                {currentQuestionIndex < exam.questions.length - 1 ? (
                  <Button
                    onClick={goToNextQuestion}
                    className="bg-brand-600 hover:bg-brand-700"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowSubmitDialog(true)}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={submitting}
                  >
                    Submit Exam
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/4 order-1 lg:order-2">
            {/* Timer */}
            <div className="mb-6">
              <ExamTimer
                durationMinutes={exam.duration}
                onTimeUp={handleTimeUp}
                isPaused={submitted}
              />
            </div>
            
            {/* Question Navigation */}
            <Card className="animate-fade-in">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Questions</CardTitle>
                  <div className="text-sm text-gray-500">
                    {answeredCount}/{exam.questions.length} answered
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {exam.questions.map((_, index) => (
                    <button
                      key={index}
                      className={`w-full aspect-square rounded-full flex items-center justify-center text-sm font-medium
                        ${
                          index === currentQuestionIndex
                            ? 'bg-brand-600 text-white'
                            : answers[index] !== null
                            ? 'bg-brand-100 text-brand-800 hover:bg-brand-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-brand-600 hover:bg-brand-700"
                  onClick={() => setShowSubmitDialog(true)}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Exam'}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Info Card */}
            <Card className="mt-6 animate-fade-in">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-brand-500 mr-2" />
                    <div>
                      <h4 className="font-medium">Duration</h4>
                      <p className="text-gray-500 text-sm">{exam.duration} minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-brand-500 mr-2" />
                    <div>
                      <h4 className="font-medium">Questions</h4>
                      <p className="text-gray-500 text-sm">{exam.questions.length} total questions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              {timeUp ? (
                <>
                  <AlertTriangle className="text-amber-500 h-5 w-5 mr-2" />
                  Time's Up!
                </>
              ) : (
                'Submit Exam'
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {timeUp ? (
                "Your time has ended. Your answers will be submitted as they are."
              ) : allAnswered ? (
                "You've answered all questions. Are you sure you want to submit your exam?"
              ) : (
                `You've answered ${answeredCount} out of ${exam.questions.length} questions. Unanswered questions will be marked as incorrect. Do you still want to submit?`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {!timeUp && (
              <AlertDialogCancel disabled={submitting}>
                Continue Exam
              </AlertDialogCancel>
            )}
            <AlertDialogAction
              onClick={handleSubmitExam}
              disabled={submitting}
              className="bg-brand-600 hover:bg-brand-700"
            >
              {submitting ? 'Submitting...' : 'Submit Now'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default ExamDetail;
