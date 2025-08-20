import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExam } from '@/contexts/ExamContext';
import { Brain, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AIQuestionGeneratorProps {
  onQuestionsGenerated?: (questions: any[]) => void;
}

export const AIQuestionGenerator: React.FC<AIQuestionGeneratorProps> = ({ 
  onQuestionsGenerated 
}) => {
  const { subjects, generateQuestionsFromSyllabus } = useExam();
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const handleGenerateQuestions = async () => {
    if (!selectedSubject) {
      toast.error('Please select a subject');
      return;
    }

    setIsGenerating(true);
    try {
      const questions = await generateQuestionsFromSyllabus(selectedSubject, questionCount);
      setGeneratedQuestions(questions);
      onQuestionsGenerated?.(questions);
      toast.success(`Generated ${questions.length} questions successfully!`);
    } catch (error) {
      toast.error('Failed to generate questions. Please try again.');
      console.error('Error generating questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Question Generator
        </CardTitle>
        <CardDescription>
          Generate exam questions automatically using AI based on the subject syllabus.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Select Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
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
            <Label htmlFor="questionCount">Number of Questions</Label>
            <Input
              id="questionCount"
              type="number"
              min="1"
              max="100"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 30)}
              placeholder="30"
            />
          </div>
        </div>

        {/* Subject Syllabus Preview */}
        {selectedSubjectData && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Syllabus for {selectedSubjectData.name}:</h4>
            <p className="text-sm text-gray-600">{selectedSubjectData.syllabus}</p>
          </div>
        )}

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleGenerateQuestions}
            disabled={isGenerating || !selectedSubject}
            size="lg"
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            {isGenerating ? 'Generating Questions...' : 'Generate Questions'}
          </Button>
        </div>

        {/* Generated Questions Preview */}
        {generatedQuestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <h3 className="font-medium">Generated {generatedQuestions.length} Questions</h3>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-4">
              {generatedQuestions.slice(0, 5).map((question, index) => (
                <Card key={index} className="p-4">
                  <h4 className="font-medium mb-2">Question {index + 1}</h4>
                  <p className="text-sm mb-3">{question.text}</p>
                  <div className="space-y-1">
                    {question.options.map((option: string, optIndex: number) => (
                      <div
                        key={optIndex}
                        className={`text-sm p-2 rounded ${
                          optIndex === question.correctAnswer
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-50'
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}. {option}
                        {optIndex === question.correctAnswer && (
                          <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                        )}
                      </div>
                    ))}
                  </div>
                  {question.explanation && (
                    <p className="text-xs text-gray-500 mt-2">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  )}
                </Card>
              ))}
              
              {generatedQuestions.length > 5 && (
                <div className="text-center text-gray-500 text-sm">
                  ... and {generatedQuestions.length - 5} more questions
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">💡 Tips for Better Results</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Ensure your syllabus is comprehensive and well-structured</li>
            <li>• Use clear, specific topic names in your syllabus</li>
            <li>• Separate different topics with commas for better AI understanding</li>
            <li>• Review generated questions before using them in exams</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
