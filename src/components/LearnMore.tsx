import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearnMore() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="w-[700px] max-w-full mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">En apprendre plus</h1>
      <section className="mb-4 text-left w-full">
        <button
          className="w-full text-left text-xl font-semibold mb-2 focus:outline-none flex items-center justify-between"
          onClick={() => toggleSection(1)}
        >
          Fonctionnement de l’autoévaluation en littératie
          <span className="ml-2">{openSection === 1 ? '▲' : '▼'}</span>
        </button>
        {openSection === 1 && (
          <div className="w-full break-words overflow-x-hidden bg-white rounded-b-lg p-4 border-t border-gray-100">
            <p className="mb-2">Cette autoévaluation est conçue pour vous aider à mieux comprendre vos compétences en littératie, c'est-à-dire votre capacité à lire, écrire, comprendre et utiliser l'information dans la vie quotidienne.</p>
            <p className="mb-2">Elle s'inspire sur le <strong>PEICA</strong> (Programme pour l'évaluation internationale des compétences des adultes), qui classe les compétences en plusieurs niveaux, du plus simple au plus avancé, comme résumé ci-dessous :</p>
            <ul className="list-disc pl-6 mb-2">
              <li><strong>Inférieur à 1</strong> : Trouver une seule information dans un court texte très simple, sans avoir à comprendre la structure.</li>
              <li><strong>Niveau 1</strong> : Repérer une information claire dans un texte court, avec peu ou pas de distractions.</li>
              <li><strong>Niveau 2</strong> : Lire des textes simples avec quelques distractions. Faire de petites inférences ou comparaisons.</li>
              <li><strong>Niveau 3 et +</strong> : Comprendre et analyser des textes longs et complexes. Organiser, comparer, interpréter, évaluer ou synthétiser l'information. Faire appel à ses connaissances pour juger la qualité ou la pertinence du contenu.</li>
            </ul>
          </div>
        )}
      </section>
      <section className="mb-4 text-left w-full">
        <button
          className="w-full text-left text-xl font-semibold mb-2 focus:outline-none flex items-center justify-between"
          onClick={() => toggleSection(2)}
        >
          Déroulement de l'évaluation
          <span className="ml-2">{openSection === 2 ? '▲' : '▼'}</span>
        </button>
        {openSection === 2 && (
          <div className="w-full break-words overflow-x-hidden bg-white rounded-b-lg p-4 border-t border-gray-100">
            <p className="mb-2">L'autoévaluation se déroule en trois étapes progressives. Il est important de suivre toutes les étapes pour obtenir un portrait complet de vos compétences.</p>
            <ol className="list-decimal pl-6 mb-2">
              <li className="mb-1"><strong>Évaluation générale</strong><br />Vous commencez par répondre à des questions simples qui permettent de repérer vos compétences de base (niveaux inférieurs à 1 et 1).</li>
              <li className="mb-1"><strong>Évaluation intermédiaire</strong><br />Vous poursuivez avec des questions plus complexes (niveau 2), qui évaluent votre capacité à comprendre, rédiger et analyser des informations.</li>
              <li className="mb-1"><strong>Évaluation avancée</strong><br />Enfin, si votre niveau le permet, vous accédez à des questions de niveau 3 et plus, qui portent sur l'analyse, l'argumentation et la synthèse de textes longs.</li>
            </ol>
            <p className="mb-2"><strong>À la fin de l'évaluation</strong><br />Vous recevrez le résultat sur vos compétences, si vous le souhaitez, ainsi que des <strong>ressources adaptées</strong> et des <strong>conseils pratiques</strong> pour continuer à avancer.</p>
          </div>
        )}
      </section>
      <section className="mb-4 text-left w-full">
        <button
          className="w-full text-left text-xl font-semibold mb-2 focus:outline-none flex items-center justify-between"
          onClick={() => toggleSection(3)}
        >
          Besoin d'aide ?
          <span className="ml-2">{openSection === 3 ? '▲' : '▼'}</span>
        </button>
        {openSection === 3 && (
          <div className="w-full break-words overflow-x-hidden bg-white rounded-b-lg p-4 border-t border-gray-100">
            <p>Si vous rencontrez des difficultés ou avez des questions techniques, n'hésitez pas à nous contacter.</p>
          </div>
        )}
      </section>
      <section className="mb-4 text-left w-full">
        <button
          className="w-full text-left text-xl font-semibold mb-2 focus:outline-none flex items-center justify-between"
          onClick={() => toggleSection(4)}
        >
          Confidentialité
          <span className="ml-2">{openSection === 4 ? '▲' : '▼'}</span>
        </button>
        {openSection === 4 && (
          <div className="w-full break-words overflow-x-hidden bg-white rounded-b-lg p-4 border-t border-gray-100">
            <p>Nous respectons votre vie privée. Toutes les informations collectées sont protégées conformément à nos conditions d'utilisation et aux normes de confidentialité.</p>
          </div>
        )}
      </section>
    </div>
  );
} 