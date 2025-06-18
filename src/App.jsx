import { useState, useEffect, useRef } from "react";

import { runTests } from "./utils/test";
import "./App.css";

function App() {

  const testsRunRef = useRef(false);

  useEffect(() => {

          // Run automated tests after app is loaded (only once)
      if (process.env.NODE_ENV === 'development' && !testsRunRef.current) {
        testsRunRef.current = true;
         runTests();
      }
  
  }, []);

  return (
      <div className="app-container">
      </div>

  );
}

export default App;
