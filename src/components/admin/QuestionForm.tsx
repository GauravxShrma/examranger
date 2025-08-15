
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useExam, Question } from '@/contexts/ExamContext';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface QuestionFormProps {
  examId: string;
  questionToEdit?: Question;
  onCancel: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  examId,
  questionToEdit,
  onCancel,
}) => {
  const { addQuestion, updateQuestion } = useExam();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [text, setText] = useState(questionToEdit?.text || '');
  const [options, setOptions] = useState<string[]>(
    questionToEdit?.options || ['', '', '', '']
  );
  const [correctAnswer, setCorrectAnswer] = useState<number>(
    questionToEdit?.correctAnswer || 0
  );
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const addOption = () => {
    if (options.length < 8) {
      setOptions([...options, '']);
    } else {
      toast.error('Maximum 8 options allowed');
    }
  };
  
  const removeOption = (index: number) => {
    if (options.length <= 2) {
      toast.error('Minimum 2 options required');
      return;
    }
    
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    
    // Update correct answer if needed
    if (correctAnswer === index) {
      setCorrectAnswer(0);
    } else if (correctAnswer > index) {
      setCorrectAnswer(correctAnswer - 1);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text) {
      toast.error('Please enter the question text');
      return;
    }
    
    // Check if all options have content
    if (options.some(option => !option.trim())) {
      toast.error('All options must have content');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (questionToEdit) {
        // Update existing question
        updateQuestion(examId, {
          ...questionToEdit,
          text,
          options,
          correctAnswer,
        });
      } else {
        // Add new question
        addQuestion(examId, {
          text,
          options,
          correctAnswer,
        });
      }
      
      onCancel(); // Close form on success
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Failed to save question');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text">Question Text</Label>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the question"
            rows={3}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <Label>Answer Options</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              disabled={isSubmitting || options.length >= 8}
              className="h-8"
            >
              Add Option
            </Button>
          </div>
          
          <RadioGroup
            value={correctAnswer.toString()}
            onValueChange={(value) => setCorrectAnswer(parseInt(value))}
            className="space-y-3"
          >
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                  disabled={isSubmitting}
                />
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                  className="flex-1"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(index)}
                  disabled={isSubmitting || options.length <= 2}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </RadioGroup>
          <p className="text-sm text-muted-foreground mt-2">
            Select the radio button for the correct answer.
          </p>
        </div>
      </div>
      
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
          {isSubmitting
            ? 'Saving...'
            : questionToEdit
            ? 'Update Question'
            : 'Add Question'}
        </Button>
      </div>
    </form>
  );
};
