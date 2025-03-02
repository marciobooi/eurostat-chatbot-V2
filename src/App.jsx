import React, { useEffect } from 'react';
import ChatBot from './components/ChatBot';
import './App.css';

function App() {
  useEffect(() => {
    // Add animation class after initial render
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-container');
      if (chatContainer) {
        chatContainer.classList.add('chat-loaded');
      }
    }, 100);
  }, []);

  return (
    <div className="App">
      <div className="chat-container">
        <ChatBot />
      </div>
    </div>
  );
}

export default App;
