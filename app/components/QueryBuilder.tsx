"use client";

import React, { useState, useEffect } from 'react';
import QuestionSelector from './QuestionSelector';
import LocationSelector from './LocationSelector';
import ItemSelector from './ItemSelector';

interface Question {
  id: string;
  label: string;
  requiresLocation: boolean;
  requiresItem: boolean;
}

const QueryBuilder = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleQuestionChange = (question: Question) => {
    setSelectedQuestion(question);
    setSelectedLocations([]); // Reset locations if question changes
    setSelectedItems([]); // Reset items if question changes
  };

  const getUpdatedDescription = () => {
    if (!selectedQuestion) return '';

    let updatedDescription = selectedQuestion.label;

    if (updatedDescription.includes('x')) {
      const itemsList = selectedItems.join(', ');
      updatedDescription = updatedDescription.replace('x', itemsList);
    }

    if (updatedDescription.includes('y')) {
      const locationsList = selectedLocations.join(', ');
      updatedDescription = updatedDescription.replace('y', locationsList);
    }

    return updatedDescription;
  };

  useEffect(() => {
    console.log('Updated Question Description:', getUpdatedDescription());
  }, [selectedItems, selectedLocations]);

  const handleLocationChange = (locations: string[]) => {
    setSelectedLocations(locations);
  };

  const handleItemChange = (items: string[]) => {
    setSelectedItems(items);
  };

  return (
    <div className="query-builder">
      <h1>Construisez votre requête</h1>
      <QuestionSelector onChange={handleQuestionChange} />

      {selectedQuestion?.requiresLocation && (
        <LocationSelector onChange={handleLocationChange} />
      )}

      {selectedQuestion?.requiresItem && (
        <ItemSelector onChange={handleItemChange} />
      )}

      {/* Aperçu en temps réel de la requête */}
      <div className="query-preview">
        <h2>Aperçu de la requête</h2>
        <p><strong>Question :</strong> {selectedQuestion ? selectedQuestion.label : 'Non sélectionnée'}</p>
        <p><strong>Lieux :</strong> {selectedLocations.length > 0 ? selectedLocations.join(', ') : 'Aucun'}</p>
        <p><strong>Items :</strong> {selectedItems.length > 0 ? selectedItems.join(', ') : 'Aucun'}</p>
      </div>

      <style jsx>{`
        .error {
          color: red;
          font-size: 0.9em;
          margin-top: 0.5em;
        }
        .actions {
          margin-top: 1em;
          display: flex;
          gap: 1em;
        }
        .reset-button {
          background-color: #f5f5f5;
          border: 1px solid #ccc;
          padding: 0.5em 1em;
          cursor: pointer;
        }
        .reset-button:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default QueryBuilder;