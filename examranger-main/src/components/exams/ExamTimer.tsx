
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ExamTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({ 
  durationMinutes, 
  onTimeUp,
  isPaused = false 
}) => {
  // Convert minutes to seconds
  const totalSeconds = durationMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isWarning, setIsWarning] = useState(false);
  
  useEffect(() => {
    // Only count down if not paused
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPaused, onTimeUp]);
  
  // Set warning state when time is running low (less than 20% left)
  useEffect(() => {
    if (timeLeft < totalSeconds * 0.2) {
      setIsWarning(true);
    } else {
      setIsWarning(false);
    }
  }, [timeLeft, totalSeconds]);
  
  // Format time as minutes:seconds
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progressPercentage = (timeLeft / totalSeconds) * 100;
  
  return (
    <div className={`p-4 rounded-lg ${isWarning ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-100'} transition-all duration-300 shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Clock className={`h-5 w-5 mr-2 ${isWarning ? 'text-red-500' : 'text-brand-500'}`} />
          <h3 className={`font-medium ${isWarning ? 'text-red-700' : 'text-gray-700'}`}>Time Remaining</h3>
        </div>
        <div className={`text-lg font-bold ${isWarning ? 'text-red-600' : 'text-brand-600'}`}>
          {formatTime()}
        </div>
      </div>
      
      <Progress 
        value={progressPercentage} 
        className={`h-2 ${isWarning ? 'bg-red-100' : 'bg-brand-100'}`} 
        indicatorClassName={isWarning ? 'bg-red-500' : 'bg-brand-500'} 
      />
    </div>
  );
};
