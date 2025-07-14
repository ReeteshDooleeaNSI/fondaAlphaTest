import { Answer, EvaluationResult, Question } from '../types';
import { initializeAssistant, createThread, getThread, addMessageToThread, getAssistantResponse } from './assistantService';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Helper function to create the next question
function createNextQuestion(currentQuestionId: string, text: string): Question {
  return {
    id: `${parseInt(currentQuestionId) + 1}`,
    text,
    type: 'text'
  };
}

export async function evaluateAnswer(
  currentQuestion: Question,
  answer: Answer,
  history: { questions: Question[]; answers: Answer[] }
): Promise<EvaluationResult> {
  try {
    console.log('Starting answer evaluation for question:', currentQuestion.id);
    
    // Initialize assistant with the current question ID
    const assistantId = await initializeAssistant(currentQuestion.id);
    console.log('Assistant initialization result:', assistantId);

    let threadId = await getThread();

    // If this is the first question, create a new thread
    if (currentQuestion.id === '1') {
      console.log('Creating new thread for first question');
      threadId = await createThread(currentQuestion.text, answer.answer);
      console.log('Thread creation result:', threadId);
    } else {
      // Add just the answer to the existing thread
      const messageAdded = await addMessageToThread(answer.answer);
      if (!messageAdded) {
        console.error('Failed to add message to thread');
      }
    }

    if (!threadId || !assistantId) {
      console.warn('Assistant features unavailable, proceeding with default behavior');
      return {
        shouldProceed: true,
        nextQuestion: createNextQuestion(currentQuestion.id, 'Question suivante...'),
        feedback: 'Réponse enregistrée avec succès. Passons à la question suivante.',
        answer
      };
    }

    // Get the next question from the assistant
    const assistantResponse = await getAssistantResponse(assistantId);
    
    if (!assistantResponse) {
      console.warn('Failed to get assistant response, using default question');
      return {
        shouldProceed: true,
        nextQuestion: createNextQuestion(currentQuestion.id, 'Question suivante...'),
        feedback: 'Réponse enregistrée avec succès. Passons à la question suivante.',
        answer,
        thread_id: threadId
      };
    }

    // Parse assistantResponse as JSON if it is a string
    const parsedResponse = typeof assistantResponse === 'string' ? JSON.parse(assistantResponse) : assistantResponse;
    const assistantMessage = parsedResponse.message || assistantResponse;
    const finTest = parsedResponse.fin_test || false;

    // Create the result with the assistant's message
    const result: EvaluationResult = {
      shouldProceed: true,
      nextQuestion: createNextQuestion(currentQuestion.id, assistantMessage),
      feedback: 'Réponse enregistrée avec succès. Passons à la question suivante.',
      answer,
      thread_id: threadId,
      ...(finTest && { fin_test: true })
    };

    console.log('Evaluation completed successfully:', result);
    return result;

  } catch (error) {
    console.error('Detailed error in evaluateAnswer:', {
      error,
      questionId: currentQuestion.id,
      answerData: answer
    });

    const currentThreadId = await getThread();
    
    // Return a more detailed error message
    return {
      shouldProceed: false,
      feedback: 'Une erreur est survenue lors de l\'évaluation de votre réponse. Veuillez réessayer.',
      answer,
      ...(currentThreadId && { thread_id: currentThreadId })
    };
  }
} 