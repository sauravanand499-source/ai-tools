import React, { useState } from 'react';
import { generateMarketingContent } from '../services/geminiService';
import { Loader2 } from 'lucide-react';

export const ContentPlanner = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [plan, setPlan] = useState(() => localStorage.getItem('marketingPlan') || '');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    localStorage.setItem('marketingPlan', plan);
  }, [plan]);

  const handleClear = () => {
    setTopic('');
    setPlan('');
    localStorage.removeItem('marketingPlan');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateMarketingContent(topic, platform);
      const cleanedResult = result?.replace(/\*/g, '').trim() || 'No plan generated.';
      setPlan(cleanedResult);
    } catch (error) {
      console.error(error);
      setPlan('Error generating plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Content Planner</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <input 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What is your topic?"
          className="p-2 border border-gray-300 rounded-md"
          required
        />
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="p-2 border border-gray-300 rounded-md">
          <option>Instagram</option>
          <option>LinkedIn</option>
          <option>Twitter</option>
          <option>Facebook</option>
        </select>
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-indigo-600 text-white p-2 rounded-md flex items-center justify-center gap-2" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Generate Plan'}
          </button>
          <button type="button" onClick={handleClear} className="bg-gray-200 text-gray-700 p-2 rounded-md" disabled={loading}>
            Clear All
          </button>
        </div>
      </form>
      {plan && <div className="bg-white p-4 border rounded-md shadow-sm whitespace-pre-wrap">{plan}</div>}
    </div>
  );
};
