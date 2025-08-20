
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useExam, Exam } from '@/contexts/ExamContext';
import { toast } from 'sonner';

interface ExamFormProps {
  examToEdit?: Exam;
  onCancel: () => void;
}

export const ExamForm: React.FC<ExamFormProps> = ({ examToEdit, onCancel }) => {
  const { createExam, updateExam } = useExam();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState(examToEdit?.title || '');
  const [description, setDescription] = useState(examToEdit?.description || '');
  const [duration, setDuration] = useState(examToEdit?.duration.toString() || '30');
  const [isActive, setIsActive] = useState(examToEdit?.isActive || true);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !duration) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const durationNum = parseInt(duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      toast.error('Duration must be a positive number');
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
          duration: durationNum,
          isActive,
        });
      } else {
        // Create new exam
        createExam({
          title,
          description,
          duration: durationNum,
          isActive,
          questions: [],
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
  
  return (
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
            : examToEdit 
              ? 'Update Exam' 
              : 'Create Exam'
          }
        </Button>
      </div>
    </form>
  );
};
