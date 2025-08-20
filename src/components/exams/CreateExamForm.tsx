import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExam } from '@/contexts/ExamContext';
import { Brain, Plus, Loader2, BookOpen, Clock } from 'lucide-react';
import { toast } from 'sonner';

const examSchema = z.object({
  title: z.string().min(1, 'Exam title is required'),
  description: z.string().min(1, 'Description is required'),
  subjectId: z.string().min(1, 'Please select a subject'),
  duration: z.string().min(1, 'Duration is required'),
  questionCount: z.string().min(1, 'Question count is required'),
});

type ExamFormData = z.infer<typeof examSchema>;

interface CreateExamFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateExamForm: React.FC<CreateExamFormProps> = ({ onSuccess, onCancel }) => {
  const { subjects, createExam, generateQuestionsFromSyllabus } = useExam();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
  });

  const selectedSubjectId = watch('subjectId');
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  const onSubmit = async (data: ExamFormData) => {
    if (!selectedSubject) {
      toast.error('Please select a valid subject');
      return;
    }

    setIsSubmitting(true);
    setIsGeneratingQuestions(true);

    try {
      // Generate AI questions
      const questions = await generateQuestionsFromSyllabus(
        selectedSubjectId, 
        parseInt(data.questionCount)
      );

      if (questions.length === 0) {
        toast.error('Failed to generate questions. Please try again.');
        return;
      }

      // Create the exam
      createExam({
        title: data.title,
        description: data.description,
        subjectId: selectedSubjectId,
        duration: parseInt(data.duration),
        isActive: true,
        questions: questions,
      });

      toast.success(`Exam "${data.title}" created successfully with ${questions.length} AI-generated questions!`);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating exam:', error);
      toast.error('Failed to create exam. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsGeneratingQuestions(false);
    }
  };

  if (subjects.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            No Subjects Available
          </CardTitle>
          <CardDescription>
            You need to add subjects first before creating exams.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">
              Please add subjects with their syllabus to create AI-powered exams.
            </p>
            <Button onClick={onCancel}>
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Create AI-Powered Exam
        </CardTitle>
        <CardDescription>
          Create a new exam with AI-generated questions based on your subject syllabus.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Exam Title</Label>
            <Input
              id="title"
              placeholder="e.g., Computer Science Midterm, Mathematics Final"
              {...register('title')}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this exam covers..."
              rows={3}
              {...register('description')}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select onValueChange={(value) => {
              // Update the form value
              const event = { target: { value } };
              register('subjectId').onChange(event);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
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
            {errors.subjectId && (
              <p className="text-sm text-red-500">{errors.subjectId.message}</p>
            )}
          </div>

          {selectedSubject && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Selected Subject: {selectedSubject.name}</h4>
              <p className="text-sm text-blue-700">
                <strong>Syllabus:</strong> {selectedSubject.syllabus}
              </p>
              <p className="text-sm text-blue-600 mt-2">
                AI will generate questions based on this syllabus.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="5"
                max="180"
                placeholder="30"
                {...register('duration')}
                className={errors.duration ? 'border-red-500' : ''}
              />
              {errors.duration && (
                <p className="text-sm text-red-500">{errors.duration.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionCount">Number of Questions</Label>
              <Input
                id="questionCount"
                type="number"
                min="5"
                max="50"
                placeholder="30"
                {...register('questionCount')}
                className={errors.questionCount ? 'border-red-500' : ''}
              />
              {errors.questionCount && (
                <p className="text-sm text-red-500">{errors.questionCount.message}</p>
              )}
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 mb-1">AI-Powered Question Generation</h4>
                <p className="text-sm text-green-700">
                  Questions will be automatically generated using AI based on your subject syllabus. 
                  Each question will have 4 multiple-choice options with explanations.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isGeneratingQuestions ? 'Generating Questions...' : 'Creating Exam...'}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Exam
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
