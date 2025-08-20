import { Question } from '@/contexts/ExamContext';

// Mock AI service - replace with actual AI API integration
export class AIService {
  private static instance: AIService;
  
  private constructor() {}
  
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Generate questions from syllabus using AI
   * This is a mock implementation - replace with actual AI API call
   */
  public async generateQuestions(
    subjectName: string,
    syllabus: string,
    count: number = 30
  ): Promise<Question[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    const questions: Question[] = [];
    const syllabusTopics = syllabus.split(',').map(topic => topic.trim());
    
    // Generate questions based on syllabus topics
    for (let i = 0; i < count; i++) {
      const topic = syllabusTopics[i % syllabusTopics.length];
      const questionNumber = i + 1;
      
      // Create different types of questions based on topic
      const questionTypes = [
        {
          text: `What is the primary purpose of ${topic}?`,
          options: [
            `To enhance ${topic} functionality`,
            `To improve ${topic} performance`,
            `To provide ${topic} solutions`,
            `To optimize ${topic} processes`
          ],
          correctAnswer: Math.floor(Math.random() * 4),
          explanation: `${topic} serves multiple purposes including functionality enhancement, performance improvement, and process optimization.`
        },
        {
          text: `Which of the following best describes ${topic}?`,
          options: [
            `A fundamental concept in ${subjectName}`,
            `An advanced technique in ${subjectName}`,
            `A basic principle of ${subjectName}`,
            `A complex methodology in ${subjectName}`
          ],
          correctAnswer: Math.floor(Math.random() * 4),
          explanation: `${topic} represents a fundamental concept that forms the basis for understanding ${subjectName}.`
        },
        {
          text: `How does ${topic} contribute to ${subjectName}?`,
          options: [
            `By providing essential knowledge`,
            `Through practical applications`,
            `Via theoretical frameworks`,
            `All of the above`
          ],
          correctAnswer: Math.floor(Math.random() * 4),
          explanation: `${topic} contributes to ${subjectName} through multiple avenues including theoretical understanding and practical applications.`
        },
        {
          text: `What are the key components of ${topic}?`,
          options: [
            `Core elements and principles`,
            `Basic structures and functions`,
            `Fundamental concepts and methods`,
            `Essential features and characteristics`
          ],
          correctAnswer: Math.floor(Math.random() * 4),
          explanation: `${topic} consists of various key components that work together to form a comprehensive understanding.`
        },
        {
          text: `When would you typically use ${topic}?`,
          options: [
            `In basic applications`,
            `For advanced scenarios`,
            `During problem-solving`,
            `Throughout the learning process`
          ],
          correctAnswer: Math.floor(Math.random() * 4),
          explanation: `${topic} is used in various contexts depending on the specific requirements and complexity of the situation.`
        }
      ];
      
      const questionType = questionTypes[i % questionTypes.length];
      
      questions.push({
        id: questionNumber.toString(),
        text: questionType.text,
        options: questionType.options,
        correctAnswer: questionType.correctAnswer,
        explanation: questionType.explanation,
      });
    }
    
    return questions;
  }

  /**
   * Validate syllabus content for AI processing
   */
  public validateSyllabus(syllabus: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!syllabus || syllabus.trim().length === 0) {
      errors.push('Syllabus cannot be empty');
    }
    
    if (syllabus.length < 10) {
      errors.push('Syllabus must be at least 10 characters long');
    }
    
    if (syllabus.length > 5000) {
      errors.push('Syllabus is too long (maximum 5000 characters)');
    }
    
    const topics = syllabus.split(',').map(t => t.trim()).filter(t => t.length > 0);
    if (topics.length < 3) {
      errors.push('Syllabus should contain at least 3 topics (separated by commas)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get AI service status
   */
  public async getStatus(): Promise<{ status: 'online' | 'offline'; message: string }> {
    // Simulate status check
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      status: 'online',
      message: 'AI service is available for question generation'
    };
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();
