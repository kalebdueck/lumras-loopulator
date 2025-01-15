import React, {useState} from 'react';
import LoopForm from "./LoopForm";
import {Container} from "react-bootstrap";
import ResultDisplay from "./ResultDisplay";
import "./index.css";
import {Results} from "./Games";

function App() {

    const [results, setResults] = useState(null);
    const handleResults = (results: any) => {
        setResults(results);
    }

    return (
          <div>
              <div className="py-5 text-center">
                  <h2>Lumra Loops</h2>
                  <p className="lead">Calculator to determine odds of lumra looping</p>
              </div>

              <div className="row">
                  <div className="col-md-12">
                      <Container>
                          <LoopForm handleResults={handleResults}/>
                          {results !== null && (
                              <ResultDisplay results={results}/>
                          )}
                      </Container>
                  </div>
              </div>
          </div>
  );
}

export default App;
