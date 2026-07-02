import React, { useState, useEffect } from 'react';
import './App.css';
import formData from './formData.json';

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('brandFormAnswers');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('brandFormAnswers', JSON.stringify(answers));
  }, [answers]);

  const handleAnswerChange = (qId, value, type) => {
    if (type === 'checkbox') {
      const currentVals = answers[qId] || [];
      const newVals = currentVals.includes(value)
        ? currentVals.filter(v => v !== value)
        : [...currentVals, value];
      setAnswers({ ...answers, [qId]: newVals });
    } else {
      setAnswers({ ...answers, [qId]: value });
    }
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(answers, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "brand_form_answers.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const section = formData[currentSection];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Master Brand Form</h2>
        <div className="section-list">
          {formData.map((sec, idx) => (
            <button
              key={sec.id}
              className={`section-btn ${currentSection === idx ? 'active' : ''}`}
              onClick={() => setCurrentSection(idx)}
            >
              {sec.title}
            </button>
          ))}
        </div>
        <button className="export-btn" onClick={exportData}>Exportar Respuestas</button>
      </aside>
      
      <main className="content">
        <header className="content-header">
          <h1>{section.title}</h1>
        </header>
        
        <div className="questions-container">
          {section.questions.map(q => (
            <div key={q.id} className="question-block">
              <label className="question-label">{q.text}</label>
              
              {q.type === 'textarea' && (
                <textarea
                  className="question-textarea"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value, 'textarea')}
                  placeholder="Escribe tu respuesta aquí..."
                  rows={4}
                />
              )}
              
              {q.type === 'radio' && (
                <div className="options-group">
                  {q.options.map((opt, i) => (
                    <label key={i} className="option-label">
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value, 'radio')}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              
              {q.type === 'checkbox' && (
                <div className="options-group">
                  {q.options.map((opt, i) => (
                    <label key={i} className="option-label">
                      <input
                        type="checkbox"
                        value={opt}
                        checked={(answers[q.id] || []).includes(opt)}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value, 'checkbox')}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="navigation-buttons">
          <button 
            disabled={currentSection === 0} 
            onClick={() => setCurrentSection(s => s - 1)}
            className="nav-btn"
          >
            Anterior
          </button>
          <button 
            disabled={currentSection === formData.length - 1} 
            onClick={() => setCurrentSection(s => s + 1)}
            className="nav-btn primary"
          >
            Siguiente
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
