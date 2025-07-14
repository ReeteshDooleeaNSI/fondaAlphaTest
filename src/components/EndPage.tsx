import { useState } from 'react';

interface EndPageProps {
  message: string;
}

export default function EndPage({ message }: EndPageProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you could send the email to your backend or another service
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Assistant Message Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600 h-96 overflow-y-auto rounded-t-2xl text-left flex flex-col justify-left items-center">
          <h2 className="text-2xl font-bold text-white mb-2 mt-0">
            {message.split('\n').map((line, index) => (
              line ? <p key={index} className={index > 0 ? 'mt-4 mb-0' : 'mt-0 mb-0'}>{line}</p> : null
            ))}
          </h2>
        </div>
        {/* Email Form Content */}
        <div className="p-8 text-center">
          <h3 className="text-xl font-bold mb-4 text-blue-700">Merci d'avoir complété votre auto-l'évaluation !</h3>
          <p className="mb-6 text-gray-700">Si vous souhaitez recevoir vos résultats et des ressources d'apprentissage personnalisées, veuillez entrer vos informations de contact ci-dessous. Une réponse:</p>
          {submitted ? (
            <div className="text-green-600 font-semibold">Merci ! Votre email a été enregistré.</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Envoyer
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 