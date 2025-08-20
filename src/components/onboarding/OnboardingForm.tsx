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
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Plus, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  syllabus: z.string().min(10, 'Syllabus must be at least 10 characters long'),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface OnboardingFormProps {
  onComplete: () => void;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
  const { createSubject } = useExam();
  const { completeOnboarding } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjects, setSubjects] = useState<SubjectFormData[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

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
      // Add subject to local state
      setSubjects([...subjects, data]);
      reset();
      toast.success(`Added ${data.name} to your subjects`);
    } catch (error) {
      console.error('Error adding subject:', error);
      toast.error('Failed to add subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    if (subjects.length === 0) {
      toast.error('Please add at least one subject before continuing');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create all subjects
      for (const subject of subjects) {
        await createSubject({
          name: subject.name,
          syllabus: subject.syllabus,
        });
      }

      // Mark onboarding as complete
      completeOnboarding();
      onComplete();
      toast.success('Onboarding completed! You can now create exams with AI-generated questions.');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
    toast.success('Subject removed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-brand-600" />
            <CardTitle className="text-3xl font-bold">Welcome to ExamRanger!</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Let's set up your subjects and syllabus to get started with AI-powered exam generation.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-brand-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-brand-600 text-white' : 'bg-gray-200'
              }`}>
                {currentStep > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
              </div>
              <span className="font-medium">Add Subjects</span>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-brand-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-brand-600 text-white' : 'bg-gray-200'
              }`}>
                {currentStep > 2 ? <CheckCircle className="h-5 w-5" /> : '2'}
              </div>
              <span className="font-medium">Review & Complete</span>
            </div>
          </div>

          {currentStep === 1 && (
            <>
              {/* Subject Form */}
              <Card className="border-2 border-dashed border-brand-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Your First Subject
                  </CardTitle>
                  <CardDescription>
                    Create a subject with its comprehensive syllabus. The AI will use this to generate exam questions.
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
                        💡 Tip: Be specific and comprehensive. Include topics like: Programming fundamentals, Data structures, Algorithms, Web development, Database systems, etc.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      {isSubmitting ? 'Adding...' : 'Add Subject'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Added Subjects List */}
              {subjects.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Subjects ({subjects.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subjects.map((subject, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-lg">{subject.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {subject.syllabus.split(',').slice(0, 3).join(', ')}...
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSubject(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Step Button */}
              {subjects.length > 0 && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-2"
                    size="lg"
                  >
                    Continue to Review
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          {currentStep === 2 && (
            <>
              {/* Review Section */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Review Your Subjects</h3>
                  <p className="text-gray-600">
                    Here are the subjects you've added. You can go back to add more or complete the setup.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjects.map((subject, index) => (
                    <Card key={index} className="p-4">
                      <h4 className="font-medium text-lg mb-2">{subject.name}</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <strong>Syllabus:</strong>
                        </p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                          {subject.syllabus}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-2"
                  >
                    ← Back to Add Subjects
                  </Button>
                  <Button
                    onClick={handleCompleteOnboarding}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {isSubmitting ? 'Setting up...' : 'Complete Setup'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
