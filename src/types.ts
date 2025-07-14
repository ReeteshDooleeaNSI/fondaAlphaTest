export interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple-choice' | 'code';
  options?: string[];
}

export interface Answer {
  questionId: string;
  answer: string;
  timestamp: Date;
}

export interface EvaluationResult {
  shouldProceed: boolean;
  nextQuestion?: Question;
  feedback?: string;
  answer?: Answer;
  thread_id?: string;
  fin_test?: boolean;
}

export interface QuestionHistory {
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
} 