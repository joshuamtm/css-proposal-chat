import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { proposalData } from './proposalData';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Initial greeting message
    setMessages([
      {
        id: Date.now(),
        type: 'bot',
        content: proposalData.quickResponses.greeting
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const findBestResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();
    
    // Check FAQ first
    for (const faq of proposalData.faq) {
      for (const question of faq.questions) {
        if (input.includes(question.toLowerCase()) || 
            question.toLowerCase().includes(input) ||
            calculateSimilarity(input, question.toLowerCase()) > 0.6) {
          return faq.answer + "\n\n" + proposalData.quickResponses.disclaimer;
        }
      }
    }
    
    // Check for objectives/goals queries
    if (input.includes('objective') || input.includes('goal') || input.includes('what will you do')) {
      let response = "The vCAIO engagement has five key objectives:\n\n";
      proposalData.sections.objectives.items.forEach(item => {
        response += `• ${item.name}: ${item.description}\n\n`;
      });
      return response + proposalData.quickResponses.disclaimer;
    }
    
    // Check for phase/timeline queries
    if (input.includes('phase') || input.includes('timeline') || input.includes('how long') || input.includes('when')) {
      let response = "The engagement has 5 phases over 12 months:\n\n";
      proposalData.sections.phases.timeline.forEach(phase => {
        response += `• ${phase.phase} (${phase.duration}): ${phase.activities}\n\n`;
      });
      return response + proposalData.quickResponses.disclaimer;
    }
    
    // Check for pricing/investment queries
    if (input.includes('cost') || input.includes('price') || input.includes('investment') || input.includes('fee') || input.includes('budget')) {
      let response = `${proposalData.sections.investment.content}\n\nWhat's included:\n`;
      proposalData.sections.investment.included.forEach(item => {
        response += `• ${item}\n`;
      });
      response += "\nNot included:\n";
      proposalData.sections.investment.notIncluded.forEach(item => {
        response += `• ${item}\n`;
      });
      return response + "\n" + proposalData.quickResponses.disclaimer;
    }
    
    // Check for outcomes/results queries
    if (input.includes('outcome') || input.includes('result') || input.includes('achieve') || input.includes('benefit')) {
      let response = "Expected outcomes from this engagement:\n\n";
      proposalData.sections.outcomes.items.forEach(item => {
        response += `• ${item}\n\n`;
      });
      response += proposalData.sections.outcomes.disclaimer;
      return response + "\n\n" + proposalData.quickResponses.disclaimer;
    }
    
    // Check for scenario questions
    if (input.includes('early phase') || input.includes('first') || input.includes('beginning')) {
      const scenario = proposalData.scenarios['early-phase'];
      return `${scenario.title}:\n\n${scenario.description}\n\n${proposalData.quickResponses.disclaimer}`;
    }
    
    if (input.includes('implementation') || input.includes('development') || input.includes('building')) {
      const scenario = proposalData.scenarios['implementation-phase'];
      return `${scenario.title}:\n\n${scenario.description}\n\n${proposalData.quickResponses.disclaimer}`;
    }
    
    if (input.includes('scaling') || input.includes('evaluation') || input.includes('final phase')) {
      const scenario = proposalData.scenarios['scaling-phase'];
      return `${scenario.title}:\n\n${scenario.description}\n\n${proposalData.quickResponses.disclaimer}`;
    }
    
    if (input.includes('vendor') || input.includes('developer') || input.includes('selection')) {
      const scenario = proposalData.scenarios['vendor-selection'];
      return `${scenario.title}:\n\n${scenario.description}\n\n${proposalData.quickResponses.disclaimer}`;
    }
    
    if (input.includes('risk') || input.includes('mitigation') || input.includes('safety')) {
      const scenario = proposalData.scenarios['risk-mitigation'];
      return `${scenario.title}:\n\n${scenario.description}\n\n${proposalData.quickResponses.disclaimer}`;
    }
    
    // Check for overview/about queries
    if (input.includes('overview') || input.includes('about') || input.includes('summary')) {
      return proposalData.sections.overview.content + "\n\n" + proposalData.quickResponses.disclaimer;
    }
    
    // Check for why continuous oversight
    if (input.includes('why') && (input.includes('12 months') || input.includes('continuous') || input.includes('oversight'))) {
      return proposalData.sections.whyContinuousOversight.content + "\n\n" + proposalData.quickResponses.disclaimer;
    }
    
    // Check for contact information
    if (input.includes('contact') || input.includes('reach') || input.includes('talk to')) {
      return proposalData.faq.find(f => f.category === 'contact').answer;
    }
    
    // Default fallback
    return proposalData.quickResponses.fallback;
  };

  const calculateSimilarity = (str1, str2) => {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    const intersection = words1.filter(word => words2.includes(word));
    return intersection.length / Math.max(words1.length, words2.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate processing time
    setTimeout(() => {
      const response = findBestResponse(inputValue);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickTopic = (topic) => {
    setInputValue(topic);
    inputRef.current?.focus();
  };

  const handleContactClick = () => {
    const message = {
      id: Date.now(),
      type: 'bot',
      content: "To discuss this proposal with Joshua & Kim directly, you can schedule a meeting with them at: https://calendly.com/joshua-and-kim. They are happy to meet with you, learn more about your needs and answer any questions you have."
    };
    setMessages(prev => [...prev, message]);
  };

  const quickTopics = [
    "What is this proposal about?",
    "What's a vCAIO?",
    "How much does this cost?",
    "What are the phases?",
    "Why MTM?",
    "What about the SNAP Calculator?",
    "What will you deliver?",
    "Who develops the software?",
    "Why 12 months?",
    "What are CSS's responsibilities?",
    "How do we measure success?",
    "What happens after 12 months?"
  ];

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Community Service Society</h1>
          <div className="header-subtitle">vCAIO Proposal for SNAP Calculator Project</div>
        </div>
        <button className="contact-button" onClick={handleContactClick}>
          Contact Joshua & Kim
        </button>
      </header>

      <div className="disclaimer-banner">
        <strong>Important:</strong> This chat provides information about the vCAIO proposal for the SNAP Calculator project. 
        For definitive answers and decisions, please contact Joshua and Kim from Meet the Moment directly.
      </div>

      <div className="chat-container">
        <div className="messages-area">
          {messages.length === 1 && (
            <div className="welcome-message">
              <h2>Welcome to the vCAIO Proposal Discussion</h2>
              <p>
                Ask any questions about Meet the Moment's Virtual Chief AI Officer proposal for the SNAP Calculator project. 
                You can type your question below or click one of the suggested topics to get started.
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-label">
                {message.type === 'bot' ? 'Meet the Moment' : 'You'}
              </div>
              <div className="message-content">
                {message.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line.split(/(https?:\/\/[^\s]+)/g).map((part, j) => {
                      if (part.match(/^https?:\/\/[^\s]+$/)) {
                        return (
                          <a 
                            key={j} 
                            href={part} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: message.type === 'bot' ? 'var(--css-cyan)' : 'white', textDecoration: 'underline' }}
                          >
                            {part}
                          </a>
                        );
                      }
                      return part;
                    })}
                    {i < message.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-topics">
          {quickTopics.map((topic, index) => (
            <button
              key={index}
              className="quick-topic-chip"
              onClick={() => handleQuickTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="input-area">
          <form onSubmit={handleSubmit} className="input-form">
            <input
              ref={inputRef}
              type="text"
              className="input-field"
              placeholder="Ask about the vCAIO proposal, phases, deliverables, pricing..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={!inputValue.trim() || isTyping}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
