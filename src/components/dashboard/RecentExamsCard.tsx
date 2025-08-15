
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExamResult } from '@/contexts/ExamContext';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock } from 'lucide-react';

interface RecentExamsCardProps {
  results: ExamResult[];
  exams: {[key: string]: string}; // Map of exam IDs to exam titles
}

export const RecentExamsCard: React.FC<RecentExamsCardProps> = ({ results, exams }) => {
  return (
    <Card className="overflow-hidden h-full">
      <CardHeader>
        <CardTitle className="text-xl">Recent Exams</CardTitle>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            <p>You haven't taken any exams yet.</p>
            <Link to="/exams" className="text-brand-600 hover:underline mt-2 inline-block">
              View available exams
            </Link>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="p-4 rounded-lg border border-gray-100 hover:border-brand-200 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">
                      {exams[result.examId] || 'Unknown Exam'}
                    </h3>
                    <Badge
                      className={`${
                        result.percentage >= 70
                          ? 'bg-green-500'
                          : result.percentage >= 50
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {result.percentage}%
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>
                        {new Date(result.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>
                        {new Date(result.completedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Score: <span className="font-semibold">{result.score}/{result.maxScore}</span>
                    </span>
                    <Link
                      to={`/results/${result.id}`}
                      className="text-sm text-brand-600 hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
