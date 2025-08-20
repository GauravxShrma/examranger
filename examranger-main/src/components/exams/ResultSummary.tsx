
import React from 'react';
import { CheckCircle, XCircle, Award, TrendingUp, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ExamResult } from '@/contexts/ExamContext';

interface ResultSummaryProps {
  result: ExamResult;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ result }) => {
  // Determine color based on score percentage
  const getColorClass = () => {
    if (result.percentage >= 80) return 'text-green-600';
    if (result.percentage >= 60) return 'text-brand-600';
    if (result.percentage >= 40) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getBgColorClass = () => {
    if (result.percentage >= 80) return 'bg-green-500';
    if (result.percentage >= 60) return 'bg-brand-500';
    if (result.percentage >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  const getGrade = () => {
    if (result.percentage >= 90) return 'A';
    if (result.percentage >= 80) return 'B';
    if (result.percentage >= 70) return 'C';
    if (result.percentage >= 60) return 'D';
    if (result.percentage >= 50) return 'E';
    return 'F';
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
      <div className="bg-gray-50 p-6 border-b border-gray-100">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Your Result Summary</h3>
        <p className="text-gray-600">Completed on {new Date(result.completedAt).toLocaleDateString()}</p>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Score Card */}
          <div className="flex-1 bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-700">Score</h4>
                <p className="text-gray-500 text-sm">Your exam performance</p>
              </div>
              <FileText className="h-6 w-6 text-brand-500" />
            </div>
            
            <div className="flex items-baseline space-x-2">
              <span className={`text-4xl font-bold ${getColorClass()}`}>{result.score}</span>
              <span className="text-gray-500">/ {result.maxScore}</span>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{result.percentage}%</span>
              </div>
              <Progress value={result.percentage} className="h-2 bg-gray-100" indicatorClassName={getBgColorClass()} />
            </div>
          </div>
          
          {/* Grade Card */}
          <div className="flex-1 bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-700">Grade</h4>
                <p className="text-gray-500 text-sm">Your performance level</p>
              </div>
              <Award className="h-6 w-6 text-brand-500" />
            </div>
            
            <div className="flex items-center justify-center mt-2">
              <div className={`${getBgColorClass()} text-white w-24 h-24 rounded-full flex items-center justify-center`}>
                <span className="text-4xl font-bold">{getGrade()}</span>
              </div>
            </div>
            
            <p className="text-center mt-4 text-gray-600">{result.feedback}</p>
          </div>
          
          {/* Rank Card */}
          <div className="flex-1 bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-700">Ranking</h4>
                <p className="text-gray-500 text-sm">Your position among peers</p>
              </div>
              <TrendingUp className="h-6 w-6 text-brand-500" />
            </div>
            
            {result.rank ? (
              <div className="text-center py-4">
                <span className="text-4xl font-bold text-brand-600">#{result.rank}</span>
                <p className="text-gray-600 mt-2">
                  You are ranked #{result.rank} among all participants
                </p>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Ranking information not available
              </div>
            )}
          </div>
        </div>
        
        {/* Feedback Section */}
        <div className="bg-brand-50 rounded-lg p-6 border border-brand-100">
          <h4 className="text-lg font-medium text-brand-800 mb-2">Feedback</h4>
          <p className="text-brand-700">{result.feedback}</p>
        </div>
        
        {/* Correct/Incorrect Summary */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center p-4 rounded-lg bg-green-50 border border-green-100">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <h5 className="font-medium text-green-800">Correct Answers</h5>
              <p className="text-2xl font-bold text-green-600">{result.score}</p>
            </div>
          </div>
          
          <div className="flex-1 flex items-center p-4 rounded-lg bg-red-50 border border-red-100">
            <XCircle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <h5 className="font-medium text-red-800">Incorrect Answers</h5>
              <p className="text-2xl font-bold text-red-600">{result.maxScore - result.score}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
