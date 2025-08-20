
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExamForm } from '@/components/admin/ExamForm';
import { QuestionForm } from '@/components/admin/QuestionForm';
import { 
  BarChart,
  Clock,
  FileText, 
  FilePlus, 
  PlusCircle, 
  Edit, 
  Trash, 
  User,
  Users,
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useExam, Exam, Question } from '@/contexts/ExamContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const { exams, results, deleteExam, deleteQuestion } = useExam();
  const { user } = useAuth();
  
  // Dialog states
  const [showExamForm, setShowExamForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [examToDelete, setExamToDelete] = useState<string | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<{examId: string, questionId: string} | null>(null);
  
  // Create new exam
  const handleCreateExam = () => {
    setSelectedExam(null);
    setShowExamForm(true);
  };
  
  // Edit exam
  const handleEditExam = (exam: Exam) => {
    setSelectedExam(exam);
    setShowExamForm(true);
  };
  
  // Add question to exam
  const handleAddQuestion = (examId: string) => {
    setSelectedExam(exams.find(e => e.id === examId) || null);
    setSelectedQuestion(null);
    setShowQuestionForm(true);
  };
  
  // Edit question
  const handleEditQuestion = (examId: string, question: Question) => {
    setSelectedExam(exams.find(e => e.id === examId) || null);
    setSelectedQuestion(question);
    setShowQuestionForm(true);
  };
  
  // Handle exam delete confirmation
  const confirmDeleteExam = (examId: string) => {
    setExamToDelete(examId);
  };
  
  // Handle question delete confirmation
  const confirmDeleteQuestion = (examId: string, questionId: string) => {
    setQuestionToDelete({ examId, questionId });
  };
  
  // Execute exam deletion
  const handleExamDelete = () => {
    if (examToDelete) {
      deleteExam(examToDelete);
      setExamToDelete(null);
    }
  };
  
  // Execute question deletion
  const handleQuestionDelete = () => {
    if (questionToDelete) {
      deleteQuestion(questionToDelete.examId, questionToDelete.questionId);
      setQuestionToDelete(null);
    }
  };
  
  // Calculate total stats
  const totalExams = exams.length;
  const totalQuestions = exams.reduce((acc, exam) => acc + exam.questions.length, 0);
  const totalResults = results.length;
  const avgScore = results.length > 0
    ? Math.round(results.reduce((acc, result) => acc + result.percentage, 0) / results.length)
    : 0;
  
  return (
    <MainLayout requireAuth requireAdmin>
      <div className="page-container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage exams, questions, and view statistics</p>
          </div>
          <Button 
            onClick={handleCreateExam}
            className="bg-brand-600 hover:bg-brand-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Exam
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-brand-500 mr-3" />
                <div className="text-3xl font-bold">{totalExams}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FilePlus className="h-8 w-8 text-brand-500 mr-3" />
                <div className="text-3xl font-bold">{totalQuestions}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Exams Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-brand-500 mr-3" />
                <div className="text-3xl font-bold">{totalResults}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart className="h-8 w-8 text-brand-500 mr-3" />
                <div className="text-3xl font-bold">{avgScore}%</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="exams" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="exams">Exams</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="exams" className="animate-fade-in">
            {/* Exams Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Manage Exams</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-6">
                    {exams.length === 0 ? (
                      <div className="text-center p-12 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No Exams Found</h3>
                        <p className="text-gray-600 mb-4">
                          Create your first exam to get started.
                        </p>
                        <Button 
                          onClick={handleCreateExam}
                          className="bg-brand-600 hover:bg-brand-700"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create New Exam
                        </Button>
                      </div>
                    ) : (
                      exams.map(exam => (
                        <div key={exam.id} className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                          <div className="p-6 border-b border-gray-100">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold mb-1">{exam.title}</h3>
                                <p className="text-gray-600 text-sm">{exam.description}</p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditExam(exam)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => confirmDeleteExam(exam.id)}
                                >
                                  <Trash className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex mt-4 space-x-6 text-sm">
                              <div className="flex items-center text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{exam.duration} mins</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <FileText className="h-4 w-4 mr-1" />
                                <span>{exam.questions.length} questions</span>
                              </div>
                              <div className={`px-2 py-0.5 rounded-full text-xs ${exam.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {exam.isActive ? 'Active' : 'Inactive'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium">Questions</h4>
                              <Button
                                size="sm"
                                onClick={() => handleAddQuestion(exam.id)}
                                className="bg-brand-600 hover:bg-brand-700"
                              >
                                <PlusCircle className="h-4 w-4 mr-1" />
                                Add Question
                              </Button>
                            </div>
                            
                            {exam.questions.length === 0 ? (
                              <div className="text-center p-6 bg-gray-50 rounded-md">
                                <p className="text-gray-600">
                                  No questions added yet. Add your first question to complete this exam.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {exam.questions.map((question, index) => (
                                  <div
                                    key={question.id}
                                    className="p-4 border border-gray-100 rounded-md bg-gray-50"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-100 text-brand-800 text-sm font-semibold mr-3 flex-shrink-0">
                                          {index + 1}
                                        </span>
                                        <p className="text-gray-800">{question.text}</p>
                                      </div>
                                      <div className="flex space-x-2 ml-4">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleEditQuestion(exam.id, question)}
                                        >
                                          <Edit className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => confirmDeleteQuestion(exam.id, question.id)}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <Trash className="h-3.5 w-3.5" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-12 bg-gray-50 rounded-lg text-center">
                  <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">User Management</h3>
                  <p className="text-gray-600 mb-4 max-w-md mx-auto">
                    In a real application, this section would allow you to manage users, 
                    view their details, and control access permissions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="results" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Exam Results</CardTitle>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <div className="text-center p-12 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Results Yet</h3>
                    <p className="text-gray-600">
                      Once users start taking exams, their results will appear here.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {results.map(result => {
                        const exam = exams.find(e => e.id === result.examId);
                        return (
                          <div
                            key={result.id}
                            className="p-4 border border-gray-100 rounded-lg bg-white"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{exam?.title || 'Unknown Exam'}</h3>
                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <User className="h-3.5 w-3.5 mr-1" />
                                    <span>User ID: {result.userId}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    <span>{new Date(result.completedAt).toLocaleString()}</span>
                                  </div>
                                </div>
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
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Exam Form Dialog */}
      <Dialog open={showExamForm} onOpenChange={setShowExamForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedExam ? 'Edit Exam' : 'Create New Exam'}
            </DialogTitle>
          </DialogHeader>
          <ExamForm 
            examToEdit={selectedExam || undefined} 
            onCancel={() => setShowExamForm(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Question Form Dialog */}
      <Dialog open={showQuestionForm} onOpenChange={setShowQuestionForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedQuestion ? 'Edit Question' : 'Add Question'}
            </DialogTitle>
          </DialogHeader>
          {selectedExam && (
            <QuestionForm 
              examId={selectedExam.id}
              questionToEdit={selectedQuestion || undefined}
              onCancel={() => setShowQuestionForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Exam Delete Confirmation */}
      <AlertDialog open={!!examToDelete} onOpenChange={() => setExamToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this exam and all associated questions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleExamDelete} 
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Question Delete Confirmation */}
      <AlertDialog open={!!questionToDelete} onOpenChange={() => setQuestionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleQuestionDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default AdminDashboard;
