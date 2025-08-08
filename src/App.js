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
    
    // Check for service-related queries
    if (input.includes('service') || input.includes('offer') || input.includes('what do you do')) {
      let response = "Meet the Moment offers four core services:\n\n";
      proposalData.sections.services.items.forEach(item => {
        response += `• ${item.name}: ${item.description}\n\n`;
      });
      return response + proposalData.quickResponses.disclaimer;
    }
    
    // Check for timeline queries
    if (input.includes('timeline') || input.includes('how long') || input.includes('when')) {
      let response = "Our typical engagement timeline:\n\n";
      proposalData.sections.timeline.phases.forEach(phase => {
        response += `• ${phase.phase} (${phase.duration}): ${phase.activities}\n\n`;
      });
      return response + proposalData.quickResponses.disclaimer;
    }
    
    // Check for pricing/investment queries
    if (input.includes('cost') || input.includes('price') || input.includes('investment') || input.includes('fee')) {
      return proposalData.sections.investment.content + "\n\n" + proposalData.quickResponses.disclaimer;
    }
    
    // Check for "why" questions
    if (input.includes('why') && (input.includes('meet the moment') || input.includes('you'))) {
      let response = "Why choose Meet the Moment:\n\n";
      proposalData.sections.whyUs.points.forEach(point => {
        response += `• ${point}\n`;
      });
      return response + "\n" + proposalData.quickResponses.disclaimer;
    }
    
    // Check for scenario questions
    if (input.includes('small nonprofit') || input.includes('small organization')) {
      const scenario = proposalData.scenarios['small-nonprofit'];
      return `${scenario.title}:\n\n${scenario.description}\n\n${proposalData.quickResponses.disclaimer}`;
    }
    
    if (input.includes('mid-size') || input.includes('medium')) {
      const scenario = proposalData.scenarios['mid-size-nonprofit'];
      return `${scenario.title}:\n\n${scenario.description}\n\n${proposalData.quickResponses.disclaimer}`;
    }
    
    if (input.includes('large nonprofit') || input.includes('large organization')) {
      const scenario = proposalData.scenarios['large-nonprofit'];
      return `${scenario.title}:\n\n${scenario.description}\n\n${proposalData.quickResponses.disclaimer}`;
    }
    
    if (input.includes('grant')) {
      const scenario = proposalData.scenarios['grant-funded'];
      return `${scenario.title}:\n\n${scenario.description}\n\n${proposalData.quickResponses.disclaimer}`;
    }
    
    // Check for contact information
    if (input.includes('contact') || input.includes('reach') || input.includes('talk to')) {
      return proposalData.faq.find(f => f.category === 'contact').answer;
    }
    
    // Check for AI-related questions
    if (input.includes('ai') || input.includes('artificial intelligence')) {
      return proposalData.faq.find(f => f.category === 'ai').answer + "\n\n" + proposalData.quickResponses.disclaimer;
    }
    
    // Check for security-related questions
    if (input.includes('security') || input.includes('cyber') || input.includes('data privacy')) {
      return proposalData.faq.find(f => f.category === 'security').answer + "\n\n" + proposalData.quickResponses.disclaimer;
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
      content: "To discuss this proposal in detail and get definitive answers to your questions, please contact Joshua and Kim from Meet the Moment directly. They'll be happy to schedule a free 30-minute consultation to understand your specific needs and explain how Meet the Moment can help your organization."
    };
    setMessages(prev => [...prev, message]);
  };

  const quickTopics = [
    "What services do you offer?",
    "How much does this cost?",
    "What's the timeline?",
    "Why Meet the Moment?",
    "Help with AI strategy",
    "Cybersecurity assessment",
    "We're a small nonprofit",
    "How do we get started?"
  ];

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Community Service Society</h1>
          <div className="header-subtitle">Proposal Discussion with Meet the Moment</div>
        </div>
        <button className="contact-button" onClick={handleContactClick}>
          Contact Joshua & Kim
        </button>
      </header>

      <div className="disclaimer-banner">
        <strong>Important:</strong> This chat provides general information about the proposal. 
        For definitive answers and decisions, please contact Joshua and Kim from Meet the Moment directly.
      </div>

      <div className="chat-container">
        <div className="messages-area">
          {messages.length === 1 && (
            <div className="welcome-message">
              <h2>Welcome to the Proposal Discussion</h2>
              <p>
                Ask any questions about Meet the Moment's services, approach, or this proposal. 
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
                    {line}
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
              placeholder="Type your question about the proposal..."
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
