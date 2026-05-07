import React, { useState } from 'react';
import { researchKeywords } from '../services/geminiService';
import { Loader2 } from 'lucide-react';

const parseCSV = (csv: string) => {
  const lines = csv.split('\n').filter(line => line.trim() !== '');
  return lines.map(line => line.split(',').map(cell => cell.trim()));
};

export const KeywordTool = () => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState<string[][]>(() => {
    const saved = localStorage.getItem('marketingKeywords');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem('marketingKeywords');
      return [];
    }
  });
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    localStorage.setItem('marketingKeywords', JSON.stringify(keywords));
  }, [keywords]);

  const handleClear = () => {
    setTopic('');
    setKeywords([]);
    setFilter('All');
    localStorage.removeItem('marketingKeywords');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFilter('All');
    try {
      const topics = topic.split(',').map(t => t.trim()).filter(t => t);
      const results = await Promise.all(topics.map(t => researchKeywords(t)));
      
      const allRows: string[][] = [];
      let headers: string[] = [];

      results.forEach((result, index) => {
        const cleanedResult = result?.replace(/\*/g, '') || '';
        const parsed = parseCSV(cleanedResult);
        if (parsed.length > 0) {
          if (index === 0) {
            headers = parsed[0];
            allRows.push(headers);
            allRows.push(...parsed.slice(1));
          } else {
            const dataRows = parsed[0].join(',') === headers.join(',') ? parsed.slice(1) : parsed;
            allRows.push(...dataRows);
          }
        }
      });
      
      setKeywords(allRows);
    } catch (error) {
      console.error(error);
      setKeywords([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = keywords.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keywords_${topic.replace(/,|\s+/g, '_') || 'research'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredKeywords = filter === 'All' 
    ? keywords 
    : [keywords[0], ...keywords.slice(1).filter(row => row[3] === filter)];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Keyword Khojo</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <input 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topics comma-separated (e.g. SEO, Content Marketing)..."
          className="p-2 border border-gray-300 rounded-md"
          required
        />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-indigo-600 text-white p-2 rounded-md flex items-center justify-center gap-2" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Get Accurate Keywords'}
          </button>
          <button type="button" onClick={handleClear} className="bg-gray-200 text-gray-700 p-2 rounded-md" disabled={loading}>
            Clear All
          </button>
        </div>
      </form>
      {keywords.length > 0 && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2 text-sm">
            <span className="font-semibold text-gray-700">Filter by Difficulty:</span>
            {['All', 'High', 'Medium', 'Low'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className={`px-2 py-1 rounded ${filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button onClick={exportToCSV} className="bg-gray-800 text-white p-2 rounded-md text-sm">Export to CSV</button>
        </div>
      )}
      {filteredKeywords.length > 0 ? (
        <div className="bg-white border rounded-md shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {filteredKeywords[0].map((header, i) => <th key={i} className="p-3 font-semibold">{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredKeywords.slice(1).map((row, i) => (
                <tr key={i} className="border-t">
                  {row.map((cell, j) => <td key={j} className="p-3">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : keywords.length > 0 && <p className="text-gray-500 text-sm">No keywords match the selected filter.</p>}
    </div>
  );
};
