
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

// Define Question type
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

// Define Exam type
export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  questions: Question[];
  isActive: boolean;
}

// Define Result type
export interface ExamResult {
  id: string;
  examId: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  answers: number[];
  completedAt: string;
  rank?: number;
  feedback: string;
}

// Define context type
interface ExamContextType {
  exams: Exam[];
  activeExam: Exam | null;
  results: ExamResult[];
  userResults: ExamResult[];
  setActiveExam: (exam: Exam | null) => void;
  getAllExams: () => Exam[];
  getExamById: (id: string) => Exam | undefined;
  createExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (exam: Exam) => void;
  deleteExam: (id: string) => void;
  addQuestion: (examId: string, question: Omit<Question, 'id'>) => void;
  updateQuestion: (examId: string, question: Question) => void;
  deleteQuestion: (examId: string, questionId: string) => void;
  submitExam: (userId: string, examId: string, answers: number[]) => ExamResult;
  getUserResults: (userId: string) => ExamResult[];
  getRankings: (examId: string) => ExamResult[];
}

// Mock data
const MOCK_EXAMS: Exam[] = [
  {
    id: '1',
    title: 'Introduction to Programming',
    description: 'Basic concepts of programming for beginners',
    duration: 30,
    isActive: true,
    questions: [
      {
        id: '1',
        text: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language', 
          'High Technology Modern Language', 
          'Hyper Transfer Markup Language', 
          'Hyper Text Modern Links'
        ],
        correctAnswer: 0,
      },
      {
        id: '2',
        text: 'Which language is primarily used for styling web pages?',
        options: ['HTML', 'JavaScript', 'CSS', 'Python'],
        correctAnswer: 2,
      },
      {
        id: '3',
        text: 'Which symbol is used for single-line comments in JavaScript?',
        options: ['#', '//', '/*', '<!--'],
        correctAnswer: 1,
      },
      {
        id: '4',
        text: 'Which of these is not a JavaScript framework/library?',
        options: ['React', 'Vue', 'Angular', 'Django'],
        correctAnswer: 3,
      },
      {
        id: '5',
        text: 'What does API stand for?',
        options: [
          'Application Programming Interface',
          'Automated Program Interaction',
          'Application Process Integration',
          'Advanced Programming Interface'
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: '2',
    title: 'Mathematics 101',
    description: 'Basic mathematics concepts',
    duration: 45,
    isActive: true,
    questions: [
      {
        id: '1',
        text: 'What is 2 + 2?',
        options: ['3', '4', '5', '22'],
        correctAnswer: 1,
      },
      {
        id: '2',
        text: 'What is the value of π (pi) to two decimal places?',
        options: ['3.14', '3.15', '3.16', '3.17'],
        correctAnswer: 0,
      },
      {
        id: '3',
        text: 'What is the square root of 64?',
        options: ['6', '7', '8', '9'],
        correctAnswer: 2,
      },
    ],
  },
];

const MOCK_RESULTS: ExamResult[] = [
  {
    id: '1',
    examId: '1',
    userId: '2',
    score: 4,
    maxScore: 5,
    percentage: 80,
    answers: [0, 2, 1, 3, 0],
    completedAt: '2023-05-15T10:30:00Z',
    rank: 1,
    feedback: 'Excellent work! You demonstrated a strong understanding of the material.'
  },
];

// Create context
const ExamContext = createContext<ExamContextType>({
  exams: [],
  activeExam: null,
  results: [],
  userResults: [],
  setActiveExam: () => {},
  getAllExams: () => [],
  getExamById: () => undefined,
  createExam: () => {},
  updateExam: () => {},
  deleteExam: () => {},
  addQuestion: () => {},
  updateQuestion: () => {},
  deleteQuestion: () => {},
  submitExam: () => ({
    id: '',
    examId: '',
    userId: '',
    score: 0,
    maxScore: 0,
    percentage: 0,
    answers: [],
    completedAt: '',
    feedback: '',
  }),
  getUserResults: () => [],
  getRankings: () => [],
});

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS);
  const [results, setResults] = useState<ExamResult[]>(MOCK_RESULTS);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);

  // Get user results
  const userResults = results.sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  // Get all exams
  const getAllExams = () => exams;

  // Get exam by id
  const getExamById = (id: string) => exams.find(exam => exam.id === id);

  // Create exam
  const createExam = (exam: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...exam,
      id: (exams.length + 1).toString(),
    };
    setExams([...exams, newExam]);
    toast.success('Exam created successfully');
  };

  // Update exam
  const updateExam = (exam: Exam) => {
    setExams(exams.map(e => (e.id === exam.id ? exam : e)));
    toast.success('Exam updated successfully');
  };

  // Delete exam
  const deleteExam = (id: string) => {
    setExams(exams.filter(exam => exam.id !== id));
    toast.success('Exam deleted successfully');
  };

  // Add question
  const addQuestion = (examId: string, question: Omit<Question, 'id'>) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) {
      toast.error('Exam not found');
      return;
    }
    
    const newQuestion = {
      ...question,
      id: (exam.questions.length + 1).toString(),
    };
    
    const updatedExam = {
      ...exam,
      questions: [...exam.questions, newQuestion],
    };
    
    setExams(exams.map(e => (e.id === examId ? updatedExam : e)));
    toast.success('Question added successfully');
  };

  // Update question
  const updateQuestion = (examId: string, question: Question) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) {
      toast.error('Exam not found');
      return;
    }
    
    const updatedExam = {
      ...exam,
      questions: exam.questions.map(q => (q.id === question.id ? question : q)),
    };
    
    setExams(exams.map(e => (e.id === examId ? updatedExam : e)));
    toast.success('Question updated successfully');
  };

  // Delete question
  const deleteQuestion = (examId: string, questionId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) {
      toast.error('Exam not found');
      return;
    }
    
    const updatedExam = {
      ...exam,
      questions: exam.questions.filter(q => q.id !== questionId),
    };
    
    setExams(exams.map(e => (e.id === examId ? updatedExam : e)));
    toast.success('Question deleted successfully');
  };

  // Submit exam
  const submitExam = (userId: string, examId: string, answers: number[]): ExamResult => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) {
      toast.error('Exam not found');
      throw new Error('Exam not found');
    }
    
    // Calculate score
    let score = 0;
    for (let i = 0; i < exam.questions.length; i++) {
      if (answers[i] === exam.questions[i].correctAnswer) {
        score++;
      }
    }
    
    const percentage = Math.round((score / exam.questions.length) * 100);
    
    // Generate feedback based on percentage
    let feedback = '';
    if (percentage >= 90) {
      feedback = 'Excellent! You have a strong understanding of the material.';
    } else if (percentage >= 70) {
      feedback = 'Good job! You understand most of the concepts.';
    } else if (percentage >= 50) {
      feedback = 'Fair. You understand some concepts but need more practice.';
    } else {
      feedback = 'Needs improvement. Consider reviewing the material again.';
    }
    
    // Create result
    const result: ExamResult = {
      id: (results.length + 1).toString(),
      examId,
      userId,
      score,
      maxScore: exam.questions.length,
      percentage,
      answers,
      completedAt: new Date().toISOString(),
      feedback,
    };
    
    // Update results
    setResults([...results, result]);
    
    // Calculate rankings for this exam
    const examResults = [...results, result].filter(r => r.examId === examId);
    examResults.sort((a, b) => b.percentage - a.percentage);
    
    // Update ranks
    for (let i = 0; i < examResults.length; i++) {
      examResults[i].rank = i + 1;
    }
    
    // Update results with ranks
    setResults(prevResults => 
      prevResults.map(r => {
        const updatedResult = examResults.find(er => er.id === r.id);
        return updatedResult || r;
      }).concat(
        examResults.filter(er => !prevResults.some(r => r.id === er.id))
      )
    );
    
    toast.success('Exam submitted successfully');
    return result;
  };

  // Get user results
  const getUserResults = (userId: string) => {
    return results
      .filter(result => result.userId === userId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  };

  // Get rankings for a specific exam
  const getRankings = (examId: string) => {
    return results
      .filter(result => result.examId === examId)
      .sort((a, b) => b.percentage - a.percentage);
  };

  return (
    <ExamContext.Provider
      value={{
        exams,
        activeExam,
        results,
        userResults,
        setActiveExam,
        getAllExams,
        getExamById,
        createExam,
        updateExam,
        deleteExam,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        submitExam,
        getUserResults,
        getRankings,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => useContext(ExamContext);
