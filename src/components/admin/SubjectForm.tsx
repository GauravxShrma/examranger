import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useExam } from '@/contexts/ExamContext';
import { BookOpen, Plus, Loader2 } from 'lucide-react';

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  syllabus: z.string().min(10, 'Syllabus must be at least 10 characters long'),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  onSuccess?: () => void;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({ onSuccess }) => {
  const { createSubject } = useExam();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
  });

  const onSubmit = async (data: SubjectFormData) => {
    setIsSubmitting(true);
    try {
      createSubject({
        name: data.name,
        syllabus: data.syllabus,
      });
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating subject:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Add New Subject
        </CardTitle>
        <CardDescription>
          Create a new subject with its syllabus. This will be used to generate AI-powered exam questions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              placeholder="e.g., Computer Science, Mathematics, Physics"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="syllabus">Syllabus</Label>
            <Textarea
              id="syllabus"
              placeholder="Enter the complete syllabus for this subject. Include all topics, concepts, and areas that should be covered in the exam questions. Separate topics with commas for better AI understanding."
              rows={6}
              {...register('syllabus')}
              className={errors.syllabus ? 'border-red-500' : ''}
            />
            {errors.syllabus && (
              <p className="text-sm text-red-500">{errors.syllabus.message}</p>
            )}
            <p className="text-sm text-gray-500">
              Tip: Be specific and comprehensive. The AI will use this syllabus to generate relevant questions.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {isSubmitting ? 'Creating...' : 'Create Subject'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
