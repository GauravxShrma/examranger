
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { aiService } from '@/lib/ai-service';

// Define Subject type
export interface Subject {
  id: string;
  name: string;
  syllabus: string;
  createdAt: string;
  updatedAt: string;
}

// Define Question type
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation?: string;
}

// Define Exam type
export interface Exam {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  duration: number; // in minutes
  questions: Question[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  subjects: Subject[];
  exams: Exam[];
  activeExam: Exam | null;
  results: ExamResult[];
  userResults: ExamResult[];
  setActiveExam: (exam: Exam | null) => void;
  getAllSubjects: () => Subject[];
  getSubjectById: (id: string) => Subject | undefined;
  createSubject: (subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (id: string) => void;
  getAllExams: () => Exam[];
  getExamById: (id: string) => Exam | undefined;
  getExamsBySubject: (subjectId: string) => Exam[];
  createExam: (exam: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExam: (exam: Exam) => void;
  deleteExam: (id: string) => void;
  addQuestion: (examId: string, question: Omit<Question, 'id'>) => void;
  updateQuestion: (examId: string, question: Question) => void;
  deleteQuestion: (examId: string, questionId: string) => void;
  generateQuestionsFromSyllabus: (subjectId: string, count?: number) => Promise<Question[]>;
  submitExam: (userId: string, examId: string, answers: number[]) => ExamResult;
  getUserResults: (userId: string) => ExamResult[];
  getRankings: (examId: string) => ExamResult[];
}

// Mock data
const MOCK_SUBJECTS: Subject[] = [
  {
    id: '1',
    name: 'Computer Science',
    syllabus: 'Programming fundamentals, Data structures, Algorithms, Web development, Database systems, Software engineering principles, Object-oriented programming, System design, Network protocols, Security basics',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Mathematics',
    syllabus: 'Algebra, Calculus, Geometry, Trigonometry, Statistics, Probability, Linear algebra, Differential equations, Number theory, Mathematical logic',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

const MOCK_EXAMS: Exam[] = [
  {
    id: '1',
    title: 'Computer Science Fundamentals',
    description: 'Test your knowledge of programming basics, data structures, and algorithms.',
    subjectId: '1',
    duration: 30,
    questions: [
      {
        id: '1',
        text: 'What is the time complexity of binary search?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 1,
        explanation: 'Binary search has a time complexity of O(log n) as it divides the search space in half with each iteration.'
      },
      {
        id: '2',
        text: 'Which data structure follows LIFO principle?',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctAnswer: 1,
        explanation: 'A Stack follows the Last In, First Out (LIFO) principle.'
      }
    ],
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Mathematics Quiz',
    description: 'Test your mathematical skills including algebra, calculus, and geometry.',
    subjectId: '2',
    duration: 45,
    questions: [
      {
        id: '3',
        text: 'What is the derivative of x²?',
        options: ['x', '2x', 'x²', '2x²'],
        correctAnswer: 1,
        explanation: 'The derivative of x² is 2x using the power rule.'
      },
      {
        id: '4',
        text: 'What is the area of a circle with radius r?',
        options: ['πr', 'πr²', '2πr', '2πr²'],
        correctAnswer: 1,
        explanation: 'The area of a circle is πr².'
      }
    ],
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  }
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
  subjects: [],
  exams: [],
  activeExam: null,
  results: [],
  userResults: [],
  setActiveExam: () => {},
  getAllSubjects: () => [],
  getSubjectById: () => undefined,
  createSubject: () => {},
  updateSubject: () => {},
  deleteSubject: () => {},
  getAllExams: () => [],
  getExamById: () => undefined,
  getExamsBySubject: () => [],
  createExam: () => {},
  updateExam: () => {},
  deleteExam: () => {},
  addQuestion: () => {},
  updateQuestion: () => {},
  deleteQuestion: () => {},
  generateQuestionsFromSyllabus: async () => [],
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
  // Load data from localStorage on initialization
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const stored = localStorage.getItem('examranger_subjects');
    if (stored) {
      try {
codex/fix-blank-page-on-exams-y3gfm3
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed as Subject[];
        }
        console.warn('Stored subjects is not an array, resetting.');
      } catch (error) {
        console.error('Failed to parse stored subjects:', error);
      }
      localStorage.removeItem('examranger_subjects');

        return JSON.parse(stored) as Subject[];
      } catch (error) {
        console.error('Failed to parse stored subjects:', error);
        localStorage.removeItem('examranger_subjects');
      }
 main
    }
    return MOCK_SUBJECTS;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const stored = localStorage.getItem('examranger_exams');
    if (stored) {
      try {
 codex/fix-blank-page-on-exams-y3gfm3
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed as Exam[];
        }
        console.warn('Stored exams is not an array, resetting.');
      } catch (error) {
        console.error('Failed to parse stored exams:', error);
      }
      localStorage.removeItem('examranger_exams');

        return JSON.parse(stored) as Exam[];
      } catch (error) {
        console.error('Failed to parse stored exams:', error);
        localStorage.removeItem('examranger_exams');
      }
> main
    }
    return MOCK_EXAMS;
  });

  const [results, setResults] = useState<ExamResult[]>(() => {
    const stored = localStorage.getItem('examranger_results');
    if (stored) {
      try {
 codex/fix-blank-page-on-exams-y3gfm3
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed as ExamResult[];
        }
        console.warn('Stored results is not an array, resetting.');
      } catch (error) {
        console.error('Failed to parse stored results:', error);
      }
      localStorage.removeItem('examranger_results');

        return JSON.parse(stored) as ExamResult[];
      } catch (error) {
        console.error('Failed to parse stored results:', error);
        localStorage.removeItem('examranger_results');
      }
 main
    }
    return MOCK_RESULTS;
  });
  
  const [activeExam, setActiveExam] = useState<Exam | null>(null);

  // Save subjects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('examranger_subjects', JSON.stringify(subjects));
  }, [subjects]);

  // Save exams to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('examranger_exams', JSON.stringify(exams));
  }, [exams]);

  // Save results to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('examranger_results', JSON.stringify(results));
  }, [results]);

  // Get user results
  const userResults = [...results].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  // Get all subjects
  const getAllSubjects = () => subjects;

  // Get subject by id
  const getSubjectById = (id: string) => subjects.find(subject => subject.id === id);

  // Create subject
  const createSubject = (subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSubject: Subject = {
      ...subject,
      id: (subjects.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSubjects([...subjects, newSubject]);
    toast.success('Subject created successfully');
  };

  // Update subject
  const updateSubject = (subject: Subject) => {
    setSubjects(subjects.map(s => (s.id === subject.id ? subject : s)));
    toast.success('Subject updated successfully');
  };

  // Delete subject
  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
    toast.success('Subject deleted successfully');
  };

  // Get all exams
  const getAllExams = () => exams;

  // Get exam by id
  const getExamById = (id: string) => exams.find(exam => exam.id === id);

  // Get exams by subject
  const getExamsBySubject = (subjectId: string) => exams.filter(exam => exam.subjectId === subjectId);

  // Create exam
  const createExam = (exam: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExam: Exam = {
      ...exam,
      id: (exams.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

  // Generate questions from syllabus using AI
  const generateQuestionsFromSyllabus = async (subjectId: string, count: number = 30): Promise<Question[]> => {
    const subject = getSubjectById(subjectId);
    if (!subject) {
      toast.error('Subject not found');
      return [];
    }

    try {
      // Validate syllabus
      const validation = aiService.validateSyllabus(subject.syllabus);
      if (!validation.isValid) {
        toast.error(`Syllabus validation failed: ${validation.errors.join(', ')}`);
        return [];
      }

      // Check AI service status
      const status = await aiService.getStatus();
      if (status.status === 'offline') {
        toast.error('AI service is currently unavailable');
        return [];
      }

      // Generate questions using AI
      const questions = await aiService.generateQuestions(
        subject.name,
        subject.syllabus,
        count
      );

      toast.success(`Generated ${questions.length} questions successfully using AI!`);
      return questions;
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions. Please try again.');
      return [];
    }
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
      .filter((result) => result.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
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
        subjects,
        exams,
        activeExam,
        results,
        userResults,
        setActiveExam,
        getAllSubjects,
        getSubjectById,
        createSubject,
        updateSubject,
        deleteSubject,
        getAllExams,
        getExamById,
        getExamsBySubject,
        createExam,
        updateExam,
        deleteExam,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        generateQuestionsFromSyllabus,
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
