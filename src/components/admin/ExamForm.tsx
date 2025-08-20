
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useExam, Exam, Question } from '@/contexts/ExamContext';
import { AIQuestionGenerator } from './AIQuestionGenerator';
import { toast } from 'sonner';
import { BookOpen, Plus, Loader2 } from 'lucide-react';

interface ExamFormProps {
  examToEdit?: Exam;
  onCancel: () => void;
}

export const ExamForm: React.FC<ExamFormProps> = ({ examToEdit, onCancel }) => {
  const { createExam, updateExam, subjects } = useExam();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  
  const [title, setTitle] = useState(examToEdit?.title || '');
  const [description, setDescription] = useState(examToEdit?.description || '');
  const [subjectId, setSubjectId] = useState(examToEdit?.subjectId || '');
  const [duration, setDuration] = useState(examToEdit?.duration.toString() || '30');
  const [isActive, setIsActive] = useState(examToEdit?.isActive || true);
  const [questions, setQuestions] = useState<Question[]>(examToEdit?.questions || []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !subjectId || !duration) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const durationNum = parseInt(duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      toast.error('Duration must be a positive number');
      return;
    }
    
    if (questions.length === 0) {
      toast.error('Please add at least one question to the exam');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (examToEdit) {
        // Update existing exam
        updateExam({
          ...examToEdit,
          title,
          description,
          subjectId,
          duration: durationNum,
          isActive,
          questions,
        });
      } else {
        // Create new exam
        createExam({
          title,
          description,
          subjectId,
          duration: durationNum,
          isActive,
          questions,
        });
      }
      
      onCancel(); // Close form on success
    } catch (error) {
      console.error('Error saving exam:', error);
      toast.error('Failed to save exam');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuestionsGenerated = (generatedQuestions: Question[]) => {
    setQuestions(generatedQuestions);
    setShowAIGenerator(false);
    toast.success(`Added ${generatedQuestions.length} questions to the exam`);
  };

  const addManualQuestion = () => {
    const newQuestion: Question = {
      id: (questions.length + 1).toString(),
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    if (field === 'options') {
      updatedQuestions[index] = { ...updatedQuestions[index], options: value };
    } else {
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    }
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Exam Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter exam title"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter exam description"
              rows={3}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={isActive}
              onCheckedChange={(checked: boolean) => setIsActive(checked)}
              id="isActive"
              disabled={isSubmitting}
            />
            <Label htmlFor="isActive">Active (available to users)</Label>
          </div>
        </div>

        {/* Questions Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Questions ({questions.length})
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAIGenerator(true)}
                  disabled={!subjectId}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  AI Generate
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addManualQuestion}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Manual
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Add questions to your exam. You can generate questions using AI or add them manually.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No questions added yet.</p>
                <p className="text-sm">Use AI generation or add questions manually to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Question Text</Label>
                        <Textarea
                          value={question.text}
                          onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                          placeholder="Enter the question"
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <Label>Options</Label>
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${index}`}
                                id={`correct-${index}-${optIndex}`}
                                checked={question.correctAnswer === optIndex}
                                onChange={() => updateQuestion(index, 'correctAnswer', optIndex)}
                                className="mr-2"
                                aria-label={`Mark option ${optIndex + 1} as correct answer`}
                              />
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...question.options];
                                  newOptions[optIndex] = e.target.value;
                                  updateQuestion(index, 'options', newOptions);
                                }}
                                placeholder={`Option ${optIndex + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Explanation (Optional)</Label>
                        <Textarea
                          value={question.explanation || ''}
                          onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                          placeholder="Explain why this answer is correct"
                          rows={2}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-brand-600 hover:bg-brand-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              examToEdit ? 'Update Exam' : 'Create Exam'
            )}
          </Button>
        </div>
      </form>

      {/* AI Question Generator Modal */}
      {showAIGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Generate Questions with AI</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAIGenerator(false)}
                >
                  Close
                </Button>
              </div>
              <AIQuestionGenerator onQuestionsGenerated={handleQuestionsGenerated} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
