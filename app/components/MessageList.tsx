"use client";

import { Message } from '@prisma/client';
import { useEffect, useRef, memo } from 'react';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

/**
 * Composant qui affiche la liste des messages
 * Mémorisé pour éviter des rendus inutiles
 */
const MessageList = memo(function MessageList({ messages, isTyping }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Faire défiler automatiquement vers le bas lorsque de nouveaux messages arrivent ou que l'état de frappe change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Afficher un message d'accueil si aucun message n'est présent
  if (messages.length === 0) {
    return (
      <div className="w-full max-w-3xl overflow-y-auto flex-1 p-4">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-16 h-16 mb-4 text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <p className="text-gray-500 text-center font-medium">
            Nouvelle conversation
          </p>
          <p className="text-gray-400 text-sm text-center mt-2">
            Envoyez un message pour commencer à discuter
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl overflow-y-auto flex-1 p-4 space-y-4">
      {/* Liste des messages */}
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.isUserMessage ? 'justify-end' : 'justify-start'
          } animate-fadeIn`}
        >
          <div
            className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
              message.isUserMessage
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
            }`}
          >
            <p className="break-words">{message.content}</p>
            <div className={`text-xs mt-1 ${message.isUserMessage ? 'text-blue-100' : 'text-gray-400'}`}>
              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}
      
      {/* Indicateur de frappe */}
      {isTyping && (
        <div className="flex justify-start animate-fadeIn">
          <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-white border border-gray-200 text-gray-800 rounded-bl-none">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Référence pour le défilement automatique */}
      <div ref={messagesEndRef} />
    </div>
  );
});

// Nom d'affichage pour les outils de développement
MessageList.displayName = 'MessageList';

export default MessageList;