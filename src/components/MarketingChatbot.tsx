import React, { useState } from 'react';
import { chatWithMarketingBot } from '../services/geminiService';
import { Loader2 } from 'lucide-react';

export const MarketingChatbot = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>(() => {
    const saved = localStorage.getItem('marketingChatHistory');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem('marketingChatHistory');
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    localStorage.setItem('marketingChatHistory', JSON.stringify(messages));
  }, [messages]);

  const handleClear = () => {
    setMessages([]);
    localStorage.removeItem('marketingChatHistory');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    
    setMessages(prev => [...prev, { role: 'user', text: message }]);
    setLoading(true);
    
    try {
      const response = await chatWithMarketingBot(message);
      const cleanedResponse = response?.replace(/\*/g, '').trim() || 'Sorry, I couldn\'t answer that.';
      setMessages(prev => [...prev, { role: 'bot', text: cleanedResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Error contacting AI.' }]);
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto flex flex-col h-[80vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Marketing Bot</h2>
        <button onClick={handleClear} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm">
          Clear Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto mb-2 border rounded-md p-2 bg-white">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-md ${m.role === 'user' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a marketing question..."
          className="flex-1 p-2 border rounded-md"
        />
        <button className="bg-indigo-600 text-white px-4 rounded-md" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : 'Send'}
        </button>
      </form>
    </div>
  );
};
