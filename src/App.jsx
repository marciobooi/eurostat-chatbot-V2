import { useState, useEffect, useRef } from "react";
import { Toaster } from 'react-hot-toast';
import './i18n'; // Initialize i18n

import { runTests } from "./utils/test";
import Chat from "./components/Chat";
import "./App.css";

function App() {

  const testsRunRef = useRef(false);

  useEffect(() => {

          // Run automated tests after app is loaded (only once)
      if (process.env.NODE_ENV === 'development' && !testsRunRef.current) {
        testsRunRef.current = true;
        //  runTests();
      }
  
  }, []);  return (
      <div className="app-container">
        <Chat />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </div>

  );
}

export default App;
