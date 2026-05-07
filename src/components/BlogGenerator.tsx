import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { generateBlogContent } from '../services/geminiService';

export const BlogGenerator = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateBlogContent(topic, tone);
      setContent(result || '');
    } catch (error) {
      console.error(error);
      setContent('Error generating blog content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTopic('');
    setTone('Professional');
    setContent('');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Blog Post Generator</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
        <input 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic for your blog post..."
          className="p-2 border border-gray-300 rounded-md"
          required
        />
        <select 
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option>Professional</option>
          <option>Casual</option>
          <option>Humorous</option>
          <option>Authoritative</option>
        </select>
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-indigo-600 text-white p-2 rounded-md flex items-center justify-center gap-2" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Generate Blog Post'}
          </button>
          <button type="button" onClick={handleClear} className="bg-gray-200 text-gray-700 p-2 rounded-md" disabled={loading}>
            Clear All
          </button>
        </div>
      </form>
      {content && <div className="bg-white p-4 border rounded-md shadow-sm whitespace-pre-wrap">{content}</div>}
    </div>
  );
};
