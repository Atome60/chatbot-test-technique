"use client";

import { useState, useEffect, useCallback } from 'react';
import { Message } from '@prisma/client';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import QuestionSelector from './QuestionSelector';
import LocationSelector from './LocationSelector';
import ItemSelector from './ItemSelector';

/**
 * Composant principal du chatbot
 * Gère l'état de la conversation, l'envoi et la réception des messages
 */
export default function Chatbot() {
  // États pour gérer les messages, la conversation et les états de chargement
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  console.log("🚀 ~ Chatbot ~ inputMessage:", inputMessage)
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [resetQuestionSelector, setResetQuestionSelector] = useState(false);
  /**
   * Crée une nouvelle conversation
   * Mémorisé avec useCallback pour éviter des recréations inutiles
   */
  const createNewConversation = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la conversation');
      }
      
      const data = await response.json();
      setConversationId(data.id);
      setMessages([]);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Crée une nouvelle conversation au chargement du composant
  useEffect(() => {
    createNewConversation();
  }, [createNewConversation]);

  /**
   * Gère l'envoi d'un message
   * @param content Contenu du message à envoyer
   */
  const handleSendMessage = async (content: string) => {
    if (!conversationId || !content.trim()) return;

    // Créer un message temporaire pour l'affichage immédiat
    const tempUserMessage: Message = {
      id: Date.now().toString(),
      content,
      isUserMessage: true,
      createdAt: new Date(),
      conversationId,
    };

    setMessages((prev) => [...prev, tempUserMessage]);
    setIsLoading(true);
    
    // Ajouter un indicateur de frappe
    setIsTyping(true);

    try {
      // Envoyer le message à l'API
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      const data = await response.json();
      
      // Simuler un délai de frappe pour le bot (effet UX)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ajouter la réponse du chatbot
      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        content: 'Merci pour votre message !',
        isUserMessage: false,
        createdAt: new Date(),
        conversationId,
      };

      // Mettre à jour les messages en remplaçant le message temporaire par le message sauvegardé
      // et en ajoutant la réponse du bot
      setMessages((prev) => [...prev.filter(m => m.id !== tempUserMessage.id), data, botMessage]);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
      setSelectedItems([]);
      setSelectedLocations([]); 
      setResetQuestionSelector(true);

    }
  };

  const handleQuestionChange = (question: Question | null) => {
    if (question) {
      setInputMessage(question.description || question.name || '');
      setResetQuestionSelector(false);
    }
  };

  useEffect(() => {
    if (resetQuestionSelector) {
      setInputMessage('');
      setResetQuestionSelector(false);
    }
  }, [resetQuestionSelector]);


  useEffect(() => {
    setInputMessage((prevMessage) => {
      let updatedMessage = prevMessage;

      if (updatedMessage.includes('x')) {
        const itemsList = selectedItems.join('; ');
        updatedMessage = updatedMessage.replace(/x/g, itemsList);
      }

      if (updatedMessage.includes('y')) {
        const locationsList = selectedLocations.join('; ');
        updatedMessage = updatedMessage.replace(/y/g, locationsList);
      }

      return updatedMessage;
    });
  }, [selectedItems, selectedLocations, inputMessage]);

  return (
    <div className="flex flex-row h-[80vh] w-full max-w-5xl mx-auto rounded-lg overflow-hidden shadow-xl border border-gray-200 bg-white">
      <div className="w-1/3 bg-gray-100 p-6 border-r border-gray-300">
        <div className="mb-6">
          <QuestionSelector onChange={handleQuestionChange} reset={resetQuestionSelector} />
        </div>
        <div className="mb-6">
          <LocationSelector 
            onChange={(locations) => {
              const safeLocations = Array.isArray(locations) ? locations : [];
              setSelectedLocations((prev) => {
                const updatedLocations = new Set(prev);
                safeLocations.forEach((location) => updatedLocations.add(location));
                return Array.from(updatedLocations);
              });
            }} 
          />
        </div>
        <div className="mb-6">
          <ItemSelector 
            onChange={(items) => {
              const safeItems = Array.isArray(items) ? items : [];
              setSelectedItems((prev) => {
                const updatedItems = new Set(prev);
                safeItems.forEach((item) => updatedItems.add(item));
                return Array.from(updatedItems);
              });
            }} 
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center shadow-lg">
          <h1 className="text-2xl font-bold">Chatbot</h1>
          <div className="flex space-x-4">
            <button 
              onClick={createNewConversation}
              disabled={isLoading}
              aria-label="Démarrer une nouvelle conversation"
              className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center disabled:opacity-50 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Nouvelle conversation
            </button>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col rounded-lg shadow-inner">
          <MessageList messages={messages} isTyping={isTyping} />
          <div className="p-6 border-t border-gray-200 bg-white">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isDisabled={isLoading || !conversationId} 
              value={inputMessage} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}