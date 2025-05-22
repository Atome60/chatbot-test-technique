"use client";

import React, { useState, useEffect } from 'react';

interface Question {
  id: string;
  label: string;
  description: string; // Ajout de la propriété description
  requiresLocation: boolean;
  requiresItem: boolean;
}

interface QuestionSelectorProps {
  onChange: (question: Question | null) => void;
  reset: boolean; // Added prop to trigger reset
}

const QuestionSelector: React.FC<QuestionSelectorProps> = ({ onChange, reset }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/questions');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des questions');
        }
        const data: Question[] = await response.json();
        setQuestions(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (selectedQuestion) {
      const updatedDescription = selectedQuestion.description;


      onChange({ ...selectedQuestion, description: updatedDescription });
    }
  }, [onChange]);

  useEffect(() => {
    // Notify parent component of the selected question
    onChange(selectedQuestion);
  }, [selectedQuestion, onChange]);

  const resetQuestion = () => {
    setSelectedQuestion(null); // Reset to default state
    onChange(null); // Notify parent of reset
  };


  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const question = questions.find(q => q.id === event.target.value) || null;
    setSelectedQuestion(question);
    onChange(question);
  };

  useEffect(() => {
    if (!selectedQuestion) {
      resetQuestion();
    }
  }, [selectedQuestion]);

  useEffect(() => {
    if (reset) {
      resetQuestion();
    }
  }, [reset]);

  if (isLoading) {
    return <p>Chargement des questions...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="question-selector">
      <label htmlFor="question" className="text-black">Choisissez une question :</label>
      <select id="question" onChange={handleSelect} value={selectedQuestion?.id || ''} className="w-full p-2 border rounded-md text-black">
        <option value="">-- Sélectionnez une question --</option>
        {questions.map((question) => (
          <option key={question.id} value={question.id}>{question.description}</option>
        ))}
      </select>

    </div>
  );
};

export default QuestionSelector;