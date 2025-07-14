import { useState } from 'react';
import { Question as QuestionType, Answer } from '../types';
import { evaluateAnswer } from '../services/evaluationService';
import { AudioRecorder } from './AudioRecorder';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface QuestionProps {
  question: QuestionType;
  onAnswerSubmit: (result: { 
    shouldProceed: boolean; 
    nextQuestion?: QuestionType; 
    feedback?: string;
    answer: Answer;
  }) => void;
  history: { questions: QuestionType[]; answers: Answer[] };
}

export function Question({ question, onAnswerSubmit, history }: QuestionProps) {
  const [answer, setAnswer] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const answerData: Answer = {
      questionId: question.id,
      answer: answer + (audioUrl ? ` [Enregistrement Audio: ${audioUrl}]` : ''),
      timestamp: new Date()
    };

    try {
      const result = await evaluateAnswer(question, answerData, history);
      setFeedback(result.feedback || null);
      onAnswerSubmit({ ...result, answer: answerData });
    } catch (error) {
      setFeedback('Une erreur est survenue lors de la soumission de votre réponse. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAudioRecordingComplete = (blobUrl: string) => {
    setAudioUrl(blobUrl);
  };

  const handleTranscriptionComplete = (transcription: string) => {
    setAnswer(transcription);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Question Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600 overflow-y-auto rounded-t-2xl text-left flex flex-col justify-left items-center">
          <h2 className="text-2xl font-bold text-white mb-2 mt-0">
            {question.text.split('\n').map((line, index) => (
              line ? <p key={index} className={index > 0 ? 'mt-4 mb-0' : 'mt-0 mb-0'}>{line}</p> : null
            ))}
          </h2>
          <p className="text-blue-100 text-sm mt-0 mb-0">
            Écrivez ou enregistrez votre réponse ci-dessous
          </p>
        </div>

        {/* Question Content */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {question.type === 'multiple-choice' && question.options ? (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700 font-medium">{option}</span>
                  </label>
                ))}
                {/* Checkbox and button for first question */}
                {question.id === '1' ? (
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="accept-terms"
                        checked={isChecked}
                        onChange={e => setIsChecked(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                        required
                      />
                      <label htmlFor="accept-terms" className="ml-2 text-gray-700 text-sm select-none">
                        J'accepte les{' '}
                        <a
                          href="https://www.example.com/conditions-utilisation"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          conditions d'utilisation
                        </a>
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !answer.trim() || !isChecked}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm shrink-0 min-w-[160px] justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Traitement...</span>
                        </>
                      ) : (
                        <>
                          <span>Envoyer la réponse</span>
                          <PaperAirplaneIcon className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting || !answer.trim()}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm shrink-0 min-w-[160px] justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Traitement...</span>
                        </>
                      ) : (
                        <>
                          <span>Envoyer la réponse</span>
                          <PaperAirplaneIcon className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Écrivez votre réponse ici..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-none min-h-[120px]"
                />
                <div className="flex items-center justify-between mt-4">
                  <AudioRecorder
                    onRecordingComplete={handleAudioRecordingComplete}
                    onTranscriptionComplete={handleTranscriptionComplete}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !answer.trim()}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm shrink-0 min-w-[160px] justify-center ml-4"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Traitement...</span>
                      </>
                    ) : (
                      <>
                        <span>Envoyer la réponse</span>
                        <PaperAirplaneIcon className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {feedback && (
            <div className={`mt-6 p-4 rounded-xl border ${
              feedback.includes('erreur')
                ? 'bg-red-50 border-red-100 text-red-700'
                : 'bg-blue-50 border-blue-100 text-blue-700'
            }`}>
              <p className="text-sm font-medium">{feedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 