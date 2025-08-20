import React from 'react';
import { Question } from '@/contexts/ExamContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ExamQuestionProps {
  question: Question;
  selectedAnswer: number | null;
  onAnswerSelect: (answerIndex: number) => void;
  questionNumber: number;
  showResult?: boolean;
  isCorrect?: boolean;
}

export const ExamQuestion: React.FC<ExamQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
  showResult = false,
  isCorrect = false,
}) => {
  return (
    <div className={`p-6 rounded-lg ${showResult ? (isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200') : 'bg-white border border-gray-100 shadow-sm'}`}>
      <h3 className="text-lg font-medium mb-4 flex items-start">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-100 text-brand-800 text-sm font-semibold mr-3 flex-shrink-0">
          {questionNumber}
        </span>
        <span>{question.text}</span>
      </h3>
      
      <RadioGroup
        value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}
        onValueChange={(value) => onAnswerSelect(parseInt(value))}
        className="space-y-3"
      >
        {question.options.map((option, index) => {
          // Determine the style based on whether we're showing results
          let optionClassName = 'border rounded-md p-3 transition-all';
          
          if (showResult) {
            if (index === question.correctAnswer) {
              // This is the correct answer
              optionClassName += ' bg-green-50 border-green-300';
            } else if (index === selectedAnswer && index !== question.correctAnswer) {
              // This is the wrong answer that was selected
              optionClassName += ' bg-red-50 border-red-300';
            } else {
              // Other options
              optionClassName += ' border-gray-200';
            }
          } else {
            // Normal mode
            optionClassName += selectedAnswer === index 
              ? ' border-brand-500 bg-brand-50' 
              : ' border-gray-200 hover:border-brand-200 hover:bg-brand-50/50';
          }
          
          return (
            <div key={index} className={optionClassName}>
              <div className="flex items-start space-x-2">
                <RadioGroupItem 
                  value={index.toString()} 
                  id={`question-${questionNumber}-option-${index}`} 
                  disabled={showResult}
                  className="mt-1"
                />
                <Label 
                  htmlFor={`question-${questionNumber}-option-${index}`}
                  className={`cursor-pointer flex-1 ${showResult && index === question.correctAnswer ? 'font-medium' : ''}`}
                >
                  {option}
                </Label>
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};
