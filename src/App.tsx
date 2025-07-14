import { useState } from 'react'
import { Question as QuestionComponent } from './components/Question'
import { Question, Answer, QuestionHistory } from './types'
import './App.css'
import EndPage from './components/EndPage'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import LearnMore from './components/LearnMore';

const initialQuestion: Question = {
  id: '1',
  text: 'Bonjour! \r\n\r\nEnsemble, nous allons évaluer votre niveau de littératie. \r\nDans les prochaines pages, vous pourrez écrire votre réponse ou l\'enregistrer.\r\nChoisissez un sujet qui vous intéresse:',
  type: 'multiple-choice',
  options: ['Les animaux', 'Les sports', 'La cuisine']
}

function App() {
  const [history, setHistory] = useState<QuestionHistory>({
    questions: [initialQuestion],
    answers: [],
    currentQuestionIndex: 0
  })
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [endMessage, setEndMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleAnswerSubmit = (result: {
    shouldProceed: boolean;
    nextQuestion?: Question;
    feedback?: string;
    answer?: Answer;
    fin_test?: boolean;
    // Accept any extra fields
    [key: string]: any;
  }) => {
    if (result.fin_test) {
      setIsTestFinished(true);
      // Use the assistant's last message if available
      if (result.nextQuestion && result.nextQuestion.text) {
        setEndMessage(result.nextQuestion.text);
      } else if (result.feedback) {
        setEndMessage(result.feedback);
      } else {
        setEndMessage('Merci d\'avoir complété le test !');
      }
      return;
    }
    if (result.shouldProceed && result.nextQuestion && result.answer) {
      setHistory((prev: QuestionHistory) => {
        const newQuestions = [...prev.questions];
        const newAnswers = [...prev.answers, result.answer!];
        if (result.nextQuestion) {
          newQuestions.push(result.nextQuestion);
        }
        return {
          questions: newQuestions,
          answers: newAnswers,
          currentQuestionIndex: prev.currentQuestionIndex + 1
        };
      });
    }
  }

  const currentQuestion = history.questions[history.currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Évaluation du niveau de littératie
            </h1>
            <div className="text-sm font-medium text-blue-600 ml-8">
              {history.answers.length} réponse{history.answers.length > 1 ? 's' : ''} enregistrée{history.answers.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto py-12 sm:px-6 lg:px-8 w-full">
        <div className="px-4 sm:px-0">
          <div className="transition-opacity duration-300 ease-in-out">
            <Routes>
              <Route path="/" element={
                isTestFinished ? (
                  <EndPage message={endMessage} />
                ) : (
                  <QuestionComponent
                    key={currentQuestion.id}
                    question={currentQuestion}
                    onAnswerSubmit={handleAnswerSubmit}
                    history={history}
                  />
                )
              } />
              <Route path="/learn-more" element={<LearnMore />} />
            </Routes>
          </div>
          <div className="flex justify-center mt-8">
            {location.pathname === '/learn-more' ? (
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Retour à l'évaluation
              </button>
            ) : (
              <Link to="/learn-more" className="text-blue-600 hover:underline font-medium">En apprendre plus sur l'autoévaluation</Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
